"""Pushed alerts, their payload parsing, and REST error classification."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from custom_components.cmr import api, webhook
from custom_components.cmr.const import EVENT_ALERT

from .conftest import FakeController


def test_parse_payload_tolerates_broken_json() -> None:
    assert webhook.parse_payload('{"alert": "cpu>95%", "severity": "high"}') == {"alert": "cpu>95%", "severity": "high"}
    # A message with an unescaped quote breaks the JSON; the pairs are still recovered.
    broken = '{"alert":"link","severity":"low","message":"port "ether1" down"}'
    assert webhook.parse_payload(broken)["alert"] == "link"
    assert webhook.parse_payload("plain text") == {"message": "plain text"}
    assert webhook.parse_payload("") == {}
    assert webhook.parse_payload("[1, 2]") == {"message": [1, 2]}


def test_normalize_alert() -> None:
    alert = webhook.normalize_alert({"alert": "cpu>95%", "severity": "HIGH", "device": "unknown", "identity": "AP1", "version": ""})
    assert alert == {
        "alert": "cpu>95%", "rule_id": None, "severity": "high", "category": None, "device": "AP1", "serial": None,
        "address": None, "version": None, "available_version": None, "upgrade_version": None, "upgrade_state": None,
        "upgrade_error": None, "iface": None, "iface_change": None, "job_devices": None, "job_upgraded": None,
        "job_run_time": None, "message": None, "test": False,
    }
    assert webhook.normalize_alert({})["severity"] == "medium"
    assert webhook.normalize_alert({"severity": "bogus"})["severity"] == "medium"
    # Bodies set before 0.12 carry the rule's name and severity as they were then.
    old = webhook.normalize_alert({"alert": "[alert-name]", "severity": "[severity]", "category": "[category]",
                                   "rule": "cpu>95%", "rule_severity": "high", "device": "(empty)"})
    assert (old["alert"], old["severity"], old["category"], old["device"]) == ("cpu>95%", "high", None, None)
    assert webhook.normalize_alert({"category": "performance,version"})["category"] == "performance"


def test_alert_setup_script_points_every_rule_at_the_webhook() -> None:
    script = webhook.alert_setup_script("http://ha.local:8123/", "abc")
    assert 'action.http-url="http://ha.local:8123/api/webhook/abc"' in script
    assert script.startswith(":foreach a in=[/cmr/alert find]")
    # The controller fills in the rule's name and severity; the body carries the rule's id.
    assert '\\"alert\\":\\"[alert-name]\\"' in script and '\\"severity\\":\\"[severity]\\"' in script
    assert 'action.http-body=("{\\"rule_id\\":\\"" . $a . "\\",\\"alert\\"' in script
    assert '\\"upgrade_error\\":\\"[upgrade-error]\\"' in script and "rule_severity" not in script
    body = webhook.alert_http_action("http://ha.local:8123", "abc", "*4")["action.http-body"]
    assert body.startswith('{"rule_id":"*4","alert":"[alert-name]"')
    assert webhook.webhook_url(None, "abc") == "http://homeassistant.local:8123/api/webhook/abc"


def test_alert_http_action_fields() -> None:
    fields = webhook.alert_http_action("http://ha.local:8123", "abc", "*4")
    assert fields["action.http-url"] == "http://ha.local:8123/api/webhook/abc"
    assert fields["action.http-method"] == "post"
    assert fields["action.http-headers"] == "Content-Type: application/json"
    body = fields["action.http-body"]
    assert body.startswith('{"rule_id":"*4","alert":"[alert-name]","severity":"[severity]","category":"[category]"')
    assert body.endswith('"job_run_time":"[job-run-time]","message":"[message]"}')
    assert webhook.pushes_to_home_assistant("http://ha.local:8123/api/webhook/abc", "abc")
    assert not webhook.pushes_to_home_assistant("https://example.invalid/hook", "abc")
    assert not webhook.pushes_to_home_assistant(None, "abc")


def test_alert_summary_for_alerts_without_a_log_message() -> None:
    """Values as a 7.26beta1 controller sent them (2026-10-06)."""
    summary = lambda **body: webhook.normalize_alert(body)["message"]  # noqa: E731
    assert summary(upgrade_error="no upgrade available", upgrade_state="pending") == "Upgrade failed: no upgrade available"
    assert summary(upgrade_version="7.26beta1", upgrade_error="", upgrade_state="done") == "Upgraded to 7.26beta1"
    # A pinned upgrade reports no version.
    assert summary(upgrade_version="unknown", upgrade_error="", upgrade_state="done") == "Upgrade done"
    assert summary(job_devices="1", job_upgraded="1", job_run_time="106") == "1 of 1 devices upgraded in 1 min 46 s"
    # A job that ends without installing anything has no end or run time yet.
    assert summary(job_devices="1", job_upgraded="0", job_run_time="unknown") == "0 of 1 devices upgraded"
    assert summary(iface="ether1", iface_change="not-running") == "ether1 link down"
    assert summary(message="login failure for user admin", upgrade_state="unknown") == "login failure for user admin"
    assert summary(upgrade_state="unknown", iface="unknown") is None


async def test_test_push_is_logged_not_fired(hass: HomeAssistant, entry, hass_client) -> None:
    """The alert's Test sends `[placeholder]` for every value: it proves the webhook
    works, so it lands in the timeline and fires no alert event."""
    import json

    fired = []
    hass.bus.async_listen(EVENT_ALERT, fired.append)
    rule = next(iter(entry.runtime_data.data.alerts.values()))
    body = json.loads(webhook.alert_http_action(None, "test-webhook-id", rule.rest_id)["action.http-body"])
    test_body = {key: value if key == "rule_id" else webhook.TEST_VALUE for key, value in body.items()}
    client = await hass_client()
    assert (await client.post("/api/webhook/test-webhook-id", json=test_body)).status == 200
    await hass.async_block_till_done()
    assert fired == []
    last = entry.runtime_data.eventlog.events[-1]
    assert last["title"] == f"Test push from alert {rule.name}"
    assert not last["notable"]


async def test_push_alerts_sets_and_clears_http_actions(
    hass: HomeAssistant, controller: FakeController, make_entry, hass_ws_client
) -> None:
    rules = controller.data["cmr/alert"]
    rules[0]["action.http-url"] = "https://example.invalid/other"  # someone else's webhook, must survive
    entry = make_entry(allow_upgrades=True)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    client = await hass_ws_client(hass)

    await client.send_json({"id": 1, "type": "cmr/alert_push", "entry_id": entry.entry_id, "enable": True})
    reply = await client.receive_json()
    assert reply["success"] and reply["result"] == {"done": len(rules), "failures": []}
    assert all("test-webhook-id" in rule["action.http-url"] for rule in rules)
    assert all(rule["action.http-method"] == "post" for rule in rules)
    await hass.async_block_till_done()
    assert all(rule.webhook_url and "test-webhook-id" in rule.webhook_url for rule in entry.runtime_data.data.alerts.values())

    # Stop: only our actions are cleared.
    rules[1]["action.http-url"] = "https://example.invalid/other"
    await entry.runtime_data.async_refresh()
    await client.send_json({"id": 2, "type": "cmr/alert_push", "entry_id": entry.entry_id, "enable": False})
    reply = await client.receive_json()
    assert reply["success"] and reply["result"]["done"] == len(rules) - 1
    assert rules[1]["action.http-url"] == "https://example.invalid/other"
    assert all("action.http-url" not in rule for rule in rules if rule is not rules[1])


async def test_push_alerts_refused_without_actions(hass: HomeAssistant, entry, hass_ws_client) -> None:
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "cmr/alert_push", "entry_id": entry.entry_id, "enable": True})
    reply = await client.receive_json()
    assert not reply["success"] and reply["error"]["code"] == "not_allowed"


def test_connection_errors_read_like_advice() -> None:
    from types import SimpleNamespace

    import aiohttp

    key = SimpleNamespace(host="192.0.2.8", port=443, ssl=True)
    refused = aiohttp.ClientConnectorError(key, ConnectionRefusedError(111, "Connect call failed"))
    detail = api.connection_detail(refused, "https://192.0.2.8")
    assert detail.startswith("192.0.2.8 refused the connection on port 443 (www-ssl)")
    assert "port 80 (www)" in api.connection_detail(refused, "http://192.0.2.8")
    unreachable = aiohttp.ClientConnectorError(key, OSError(101, "Network unreachable"))
    assert api.connection_detail(unreachable, "https://192.0.2.8") == "No route to 192.0.2.8 from Home Assistant (network unreachable)."
    custom = aiohttp.ClientConnectorError(SimpleNamespace(host="192.0.2.8", port=888, ssl=False), ConnectionRefusedError(111, "x"))
    assert "refused the connection on port 888 (HTTP)" in api.connection_detail(custom, "http://192.0.2.8:888")
    tls = aiohttp.ClientConnectorSSLError(
        SimpleNamespace(host="192.0.2.8", port=888, ssl=True),
        OSError(1, "[SSL: WRONG_VERSION_NUMBER] wrong version number (_ssl.c:1082)"),
    )
    assert api.connection_detail(tls, "https://192.0.2.8:888") == (
        "192.0.2.8:888 speaks plain HTTP, not HTTPS: turn off Use HTTPS (or point to the www-ssl port)."
    )
    assert "within 20 s" in api.connection_detail(TimeoutError(), "https://192.0.2.8")
    assert "isn't the REST API" in api.connection_detail(ValueError("bad json"), "https://192.0.2.8")


def test_rest_error_classification() -> None:
    assert isinstance(api._error_for("GET", "cmr", 400, {"message": "no such command"}), api.CmrNotFoundError)
    assert isinstance(api._error_for("GET", "cmr", 400, {"detail": "not enough permissions"}), api.CmrAuthError)
    err = api._error_for("POST", "execute", 500, {"message": "failure", "detail": "script error"})
    assert isinstance(err, api.CmrRouterError) and err.detail == "failure script error"
    assert isinstance(api._error_for("GET", "x", 404, "<html>not found</html>"), api.CmrNotFoundError)


async def test_pushed_alert_reaches_bus_and_event_entity(
    hass: HomeAssistant, entry, controller: FakeController, hass_client
) -> None:
    fired = []
    hass.bus.async_listen(EVENT_ALERT, lambda event: fired.append(event.data))
    client = await hass_client()
    response = await client.post(
        "/api/webhook/test-webhook-id",
        data='{"alert":"cpu>95%","severity":"high","device":"Site-GW","serial":"S0000000002","message":"CPU 97%"}',
    )
    assert response.status == 200
    await hass.async_block_till_done()
    (data,) = fired
    assert data["device_key"] == "S0000000002" and data["entry_id"] == entry.entry_id

    events = [s for s in hass.states.async_all("event") if s.attributes.get("event_type") == "high"]
    assert len(events) == 2  # the fleet event entity and the gateway's own
    assert all(s.attributes["alert"] == "cpu>95%" for s in events)


async def test_pushed_alert_device_from_its_text(hass: HomeAssistant, entry, controller: FakeController, hass_client) -> None:
    """Without usable placeholders the device named in the message is used; job alerts stay fleet-wide."""
    fired = []
    hass.bus.async_listen(EVENT_ALERT, lambda event: fired.append(event.data))
    client = await hass_client()
    body = '{"alert":"cpu>95%","severity":"high","device":"[identity]","message":"CPU 97% on Site-GW@192.0.2.1"}'
    assert (await client.post("/api/webhook/test-webhook-id", data=body)).status == 200
    controller.data["cmr/alert"][5]["upgrade-job-done"] = "yes"  # "upgrade successful" becomes a job alert
    await entry.runtime_data.async_refresh()
    body = '{"alert":"upgrade successful","severity":"low","message":"job of Site-GW done"}'
    assert (await client.post("/api/webhook/test-webhook-id", data=body)).status == 200
    await hass.async_block_till_done()
    assert [data["device_key"] for data in fired] == ["S0000000002", None]
