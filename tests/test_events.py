"""Tests for log classification and trouble detection (no Home Assistant needed)."""

from datetime import datetime, timedelta
import importlib.util
from pathlib import Path
import sys

_DIR = Path(__file__).parents[1] / "custom_components" / "cmr"


def _load(name):
    spec = importlib.util.spec_from_file_location(f"cmr_{name}", _DIR / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


logparse = _load("logparse")
insights = _load("insights")

T0 = datetime(2026, 10, 4, 12, 0, 0)


# --------------------------------------------------------------- logparse


def test_wifi_disconnect():
    e = logparse.classify(
        ["wireless", "info"],
        "02:00:5e:10:00:01@2ghz-AP-2(IoT) disconnected, connection lost, signal strength -40, channel 2437/n",
    )
    assert e.category == "wifi"
    assert e.data == {
        "mac": "02:00:5E:10:00:01", "interface": "2ghz-AP-2", "ssid": "IoT", "event": "disconnected",
        "reason": "connection lost", "signal": -40, "channel": "2437/n",
    }
    assert e.title == "Wi-Fi client 02:00:5E:10:00:01 disconnected from IoT (connection lost)"


def test_wifi_connect_without_ssid():
    e = logparse.classify(["wireless", "info"], "AA:BB:CC:DD:EE:FF@wifi1 connected, signal strength -61")
    assert (e.category, e.data["event"], e.data["ssid"], e.data["signal"], e.data["reason"]) == (
        "wifi", "connected", None, -61, None,
    )


def test_link_and_login_and_config():
    up = logparse.classify(["interface", "info"], "ether6 link up (speed 1G, full duplex)")
    assert (up.category, up.data["state"], up.data["detail"], up.severity) == ("link", "up", "speed 1G, full duplex", "info")
    down = logparse.classify(["interface", "info"], "ether6 link down")
    assert (down.data["state"], down.severity) == ("down", "notice")

    ok = logparse.classify(["system", "info", "account"], "user admin logged in from 10.0.0.2 via ssh")
    assert (ok.category, ok.data["address"], ok.data["service"]) == ("login", "10.0.0.2", "ssh")
    tool = logparse.classify(["system", "info", "account"], "user ha logged out from 10.0.0.9 via rest-api")
    assert (tool.category, tool.data["event"]) == ("api", "out")
    fail = logparse.classify(["system", "error", "critical"], "login failure for user admin via api")
    assert (fail.category, fail.severity, fail.data["address"], fail.data["event"]) == ("security", "error", None, "failure")

    cfg = logparse.classify(
        ["system", "info"],
        "ip service changed by ssh-cmd:admin@10.0.0.2/action:136 (/ip service set www-ssl disabled=no)",
    )
    assert (cfg.category, cfg.data["action"], cfg.data["who"]) == ("config", "changed", "ssh-cmd:admin@10.0.0.2")
    assert cfg.title.startswith("Ip service changed by")


def test_ssh_auth_lines():
    ok = logparse.classify(["ssh", "info"], "4d2e0 publickey accepted for user: vibe, fingerprint: SHA256:abc=")
    assert (ok.category, ok.data["user"], ok.data["event"]) == ("login", "vibe", "auth")
    bad = logparse.classify(["ssh", "info"], "4d2e0 password failed for user: root")
    assert (bad.category, bad.severity, bad.data["event"]) == ("security", "warning", "failure")


def test_dhcp_and_fallback():
    e = logparse.classify(["dhcp", "info"], "defconf assigned 192.168.88.10 for AA:BB:CC:DD:EE:FF phone")
    assert (e.category, e.data["mac"], e.data["host"]) == ("dhcp", "AA:BB:CC:DD:EE:FF", "phone")
    other = logparse.classify(["certificate", "info"], "generated CA certificate: rest-ca")
    assert (other.category, other.title) == ("certificate", "generated CA certificate: rest-ca")


def test_find_identity_is_token_based():
    ids = ["hAP", "Site-hAPax3", "GW"]
    assert logparse.find_identity("2ghz-Site-hAPax3-2", ids) == "Site-hAPax3"
    assert logparse.find_identity("5ghz-hAP", ids) == "hAP"
    assert logparse.find_identity("wifi1", ids) is None


def test_router_time_formats():
    now = datetime(2026, 10, 4, 0, 2, 0)
    assert logparse.parse_router_time("2026-10-03 17:25:13", now) == datetime(2026, 10, 3, 17, 25, 13)
    assert logparse.parse_router_time("23:59:00", now) == datetime(2026, 10, 3, 23, 59, 0)
    assert logparse.parse_router_time("00:01:00", now) == datetime(2026, 10, 4, 0, 1, 0)
    assert logparse.parse_router_time("dec/31 10:00:00", now) == datetime(2025, 12, 31, 10, 0, 0)
    assert logparse.parse_router_time("garbage", now) is None
    assert logparse.gmt_offset_seconds("+03:00") == 10800
    assert logparse.gmt_offset_seconds("-05:30") == -19800
    assert logparse.gmt_offset_seconds("10800") == 10800
    assert logparse.log_id_value("*12AD") == 0x12AD


# --------------------------------------------------------------- insights


def wifi_drop(minute, signal=-38):
    return {
        "time": T0 + timedelta(minutes=minute),
        "category": "wifi",
        "device_key": "AP1",
        "device_name": "AP1",
        "data": {"event": "disconnected", "mac": "AA:BB:CC:DD:EE:FF", "signal": signal, "reason": "connection lost"},
    }


def test_wifi_flapping_raises_updates_and_resolves():
    engine = insights.InsightEngine()
    changes = [c for m in range(4) for c in engine.observe(wifi_drop(m))]
    assert changes == []  # below the threshold of 5
    (kind, insight), = engine.observe(wifi_drop(4))
    assert kind == "raised" and insight.kind == "wifi_flapping" and insight.count == 5
    title, detail = insights.describe(insight)
    assert "keeps dropping" in title and "strong" in detail and "connection lost" in detail
    (kind, insight), = engine.observe(wifi_drop(6))
    assert kind == "updated" and insight.count == 6
    assert engine.sweep(T0 + timedelta(minutes=20)) == []  # still within the quiet period
    resolved = engine.sweep(T0 + timedelta(minutes=37))
    assert [i.key for i in resolved] == ["wifi_flapping:AA:BB:CC:DD:EE:FF"] and not engine.active


def test_spread_out_drops_do_not_raise():
    engine = insights.InsightEngine()
    changes = [c for m in range(0, 100, 20) for c in engine.observe(wifi_drop(m))]
    assert changes == []


def test_weak_signal_diagnosis():
    engine = insights.InsightEngine()
    for m in range(5):
        changes = engine.observe(wifi_drop(m, signal=-80))
    assert "weak" in insights.describe(changes[0][1])[1]


def test_login_failures_group_by_source():
    engine = insights.InsightEngine()
    raised = []
    for i in range(5):
        raised += engine.observe({
            "time": T0 + timedelta(seconds=30 * i), "category": "security",
            "data": {"event": "failure", "address": "203.0.113.9", "user": "admin" if i % 2 else "root"},
        })
    (kind, insight), = raised
    assert insight.subject == "203.0.113.9" and insight.data["users"] == ["admin", "root"]


def test_device_offline_and_recovery():
    engine = insights.InsightEngine()
    down = [{"key": "D1", "name": "Switch", "connected": False, "disconnected_for": 600}]
    assert engine.check_devices(down, T0) == []  # 10 min: not yet
    down[0]["disconnected_for"] = 1000
    (kind, insight), = engine.check_devices(down, T0)
    assert kind == "raised" and insight.kind == "device_offline"
    (kind, insight), = engine.check_devices([{"key": "D1", "name": "Switch", "connected": True}], T0)
    assert kind == "resolved" and insight.resolved == T0


def test_offline_device_removed_from_controller_resolves():
    engine = insights.InsightEngine()
    down = [{"key": "D1", "name": "Switch", "connected": False, "disconnected_for": 1000}]
    (kind, _), = engine.check_devices(down, T0)
    assert kind == "raised"
    # The device is deleted from the controller: it must not stay an issue forever.
    (kind, insight), = engine.check_devices([], T0 + timedelta(hours=1))
    assert kind == "resolved" and insight.key == "device_offline:D1"
    assert engine.active == {}
    assert engine.sweep(T0 + timedelta(days=1)) == []


def test_thresholds_are_configurable():
    engine = insights.InsightEngine(thresholds={"wifi_flapping": 2, "link_flapping": 0})
    assert engine.observe(wifi_drop(0)) == []
    (kind, insight), = engine.observe(wifi_drop(1))
    assert kind == "raised" and insight.count == 2
    # 0 turns a rule off entirely.
    for i in range(5):
        assert engine.observe({
            "time": T0 + timedelta(seconds=i), "category": "link", "device_key": "D1", "device_name": "Switch",
            "data": {"interface": "ether1", "state": "down"},
        }) == []
    # Reconfiguring keeps the state and applies the new numbers.
    engine.configure({"link_flapping": 1}, timedelta(minutes=5))
    assert engine.rules["link_flapping"].threshold == 1 and engine.rules["wifi_flapping"].threshold == 5
    assert engine.offline_after == timedelta(minutes=5)
    down = [{"key": "D2", "name": "AP", "connected": False, "disconnected_for": 400}]
    (kind, insight), = engine.check_devices(down, T0)
    assert kind == "raised" and "5 minutes" in insights.describe(insight, engine.offline_after)[1]


def test_wifi_log_rows():
    row = {"source": "Office-AP@192.0.2.5", "time": "2026-10-04 20:45:19", "address": "3c:dc:75:c0:85:ac",
           "event": "disconnected", "bssid": "d0:ea:11:ae:17:fe"}
    e = logparse.wifi_log_event(row)
    assert e.category == "wifi" and e.severity == "info"
    assert e.title == "Wi-Fi client 3C:DC:75:C0:85:AC disconnected from Office-AP"
    assert e.data == {"mac": "3C:DC:75:C0:85:AC", "event": "disconnected", "bssid": "D0:EA:11:AE:17:FE",
                      "source": "Office-AP@192.0.2.5", "identity": "Office-AP"}
    failed = logparse.wifi_log_event({**row, "event": "failed"})
    assert failed.severity == "notice" and "failed to connect" in failed.title
    assert logparse.wifi_log_event({"address": "not-a-mac", "event": "connected"}) is None
    assert logparse.wifi_log_event({**row, "event": "roamed"}) is None
    # The flapping rule counts these rows like log lines.
    engine = insights.InsightEngine(thresholds={"wifi_flapping": 2})
    for i in range(2):
        changes = engine.observe({"time": T0 + timedelta(minutes=i), "category": "wifi", "device_key": "AP1",
                                  "device_name": "Office-AP", "data": e.data})
    (kind, insight), = changes
    assert kind == "raised" and insight.data["where"] == "Office-AP"


def test_state_round_trip():
    engine = insights.InsightEngine()
    for m in range(5):
        engine.observe(wifi_drop(m))
    restored = insights.InsightEngine(engine.as_dict())
    assert restored.active.keys() == engine.active.keys()
    (kind, _), = restored.observe(wifi_drop(5))
    assert kind == "updated"


def test_dismiss_forgets_counts_and_keeps_offline_quiet():
    from datetime import UTC, datetime, timedelta

    from custom_components.cmr import insights

    engine = insights.InsightEngine()
    now = datetime(2026, 10, 5, 12, 0, tzinfo=UTC)
    for i in range(5):
        engine.observe({
            "time": now + timedelta(seconds=i), "category": "security", "severity": "warning",
            "data": {"event": "failure", "user": "admin", "address": "203.0.113.9", "service": "ssh"},
        })
    key = next(iter(engine.active))
    assert key.startswith("login_failures:")
    dismissed = engine.dismiss(key, now + timedelta(minutes=1))
    assert dismissed is not None and dismissed.resolved is not None
    assert key not in engine.active
    # The old failures are forgotten: four new ones don't reach the threshold again.
    for i in range(4):
        engine.observe({
            "time": now + timedelta(minutes=2, seconds=i), "category": "security", "severity": "warning",
            "data": {"event": "failure", "user": "admin", "address": "203.0.113.9", "service": "ssh"},
        })
    assert key not in engine.active
    assert engine.dismiss("login_failures:nobody", now) is None

    # A dismissed offline insight stays quiet while the device is still down, and
    # may come back after it has been online once.
    down = [{"key": "S1", "name": "AP", "connected": False, "pending": False, "disconnected_for": 3600}]
    assert [c for c, _ in engine.check_devices(down, now)] == ["raised"]
    assert engine.dismiss("device_offline:S1", now).kind == "device_offline"
    assert engine.check_devices(down, now + timedelta(minutes=5)) == []
    up = [{**down[0], "connected": True, "disconnected_for": None}]
    assert engine.check_devices(up, now + timedelta(minutes=6)) == []
    assert [c for c, _ in engine.check_devices(down, now + timedelta(minutes=30))] == ["raised"]
    # The dismissal survives a save/load round trip.
    engine.dismiss("device_offline:S1", now)
    assert "device_offline:S1" in insights.InsightEngine(engine.as_dict())._dismissed
