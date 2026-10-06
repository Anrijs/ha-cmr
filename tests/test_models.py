"""Tests for the CMR REST parsing helpers (run with: python -m pytest tests)."""

import importlib.util
from pathlib import Path
import sys

import pytest

# Import models.py directly so the tests don't need Home Assistant installed.
_SPEC = importlib.util.spec_from_file_location(
    "cmr_models",
    Path(__file__).parents[1] / "custom_components" / "cmr" / "models.py",
)
models = importlib.util.module_from_spec(_SPEC)
sys.modules[_SPEC.name] = models
_SPEC.loader.exec_module(models)


@pytest.mark.parametrize(
    ("text", "seconds"),
    [
        ("2d19h18m28s", 2 * 86400 + 19 * 3600 + 18 * 60 + 28),
        ("23h47m1s", 23 * 3600 + 47 * 60 + 1),
        ("10m1s", 601),
        ("1w2d", 9 * 86400),
        ("00:10:05", 605),
        ("1d 02:03:04", 86400 + 7384),
        ("", None),
        (None, None),
        ("soon", None),
    ],
)
def test_parse_duration(text, seconds):
    assert models.parse_duration(text) == seconds


@pytest.mark.parametrize(
    ("candidate", "installed", "newer"),
    [
        # The controller offers older versions as upgrades; they must not be updates.
        ("7.39rc1", "7.40_ab12", False),
        ("7.38.4", "7.40_ab3", False),
        ("7.40", "7.40_ab12", True),
        ("7.40beta1", "7.40_ab12", True),
        ("7.40rc1", "7.40beta3", True),
        ("7.40.1", "7.40", True),
        ("7.40", "7.40", False),
        ("7.41beta1", "7.40.2", True),
        (None, "7.40", False),
        ("garbage", "7.40", False),
    ],
)
def test_is_newer(candidate, installed, newer):
    assert models.is_newer(candidate, installed) is newer


def test_is_prerelease():
    assert models.is_prerelease("7.40_ab12")
    assert models.is_prerelease("7.39rc1")
    assert not models.is_prerelease("7.38.4")


def test_signed32_coordinates():
    # Negative coordinates are rendered as unsigned 32-bit.
    assert models.signed32("4294967294") == -2
    assert models.signed32("4294967125") == -171
    assert models.signed32("143") == 143
    assert models.signed32(None) is None


def test_alert_summary():
    summary = models.parse_alert_summary("0/11 1/7/3/0")
    assert summary == models.AlertSummary(on=0, total=11, critical=1, high=7, medium=3, low=0)
    assert models.parse_alert_summary("") is None


def test_parse_links():
    links = models.parse_links(
        "*ether2(poe=powered-on,tx=215.9KiB,rx=7.5MiB)--*ether1(,tx=7.2MiB,rx=126.9KiB)"
    )
    assert len(links) == 1
    assert links[0].a == models.PortEnd("ether2", True, "powered-on", "215.9KiB", "7.5MiB")
    assert links[0].b == models.PortEnd("ether1", True, None, "7.2MiB", "126.9KiB")
    assert models.parse_links(None) == []


def test_device_from_rest():
    device = models.CmrDevice.from_rest(
        {
            ".id": "*6",
            "identity": "Site-GW",
            "board": "ATLGM",
            "version": "7.40_ab12",
            "available-version": "7.39rc1",
            "address": "192.0.2.1",
            "labels": "house,gw,gateway",
            "auto-labels": "192.0.2.1,arm64,ATLGM,Site-GW",
            "packages": "system,wireless",
            "uptime": "2d19h21m28s",
            "alerts": "0/11 1/7/3/0",
            "serial": "HX0000TEST1",
            "connected": "true",
            "upgrade-available": "true",
        }
    )
    assert device.key == "HX0000TEST1"
    assert device.connected and not device.controller
    assert device.upgrade_flag and not device.update_available
    assert device.arch == "arm64"
    assert device.model_code is None
    assert device.alerts.critical == 1
    # Upgrade job / rule selectors: identity, any label or auto-label, or "all".
    assert device.matches_labels("Site-GW")
    assert device.matches_labels("ap,gw")
    assert device.matches_labels("arm64")
    assert device.matches_labels("all")
    assert not device.matches_labels("ap,switch")
    assert not device.matches_labels("")
    assert not device.pending and not device.remote_pending and not device.inactive


def test_pairing_flags():
    waiting_here = models.CmrDevice.from_rest({".id": "*1", "identity": "new", "pending": "true"})
    waiting_there = models.CmrDevice.from_rest({".id": "*2", "identity": "new2", "remote-pending": "true"})
    assert waiting_here.pending and not waiting_here.remote_pending and waiting_here.unpaired
    assert waiting_there.remote_pending and not waiting_there.pending and waiting_there.unpaired
    assert models.CmrDevice.from_rest({".id": "*3", "identity": "x", "inactive": "true", "stale": "yes"}).inactive


@pytest.mark.parametrize(
    ("selector", "labels", "expected"),
    [
        ("office,lab", {"office"}, True),
        ("office,lab", {"core"}, False),
        ("office,+ap", {"office", "ap"}, True),
        ("office,+ap", {"office"}, False),
        ("office,-ap", {"office", "ap"}, False),
        ("office,-ap", {"office"}, True),
        ("all,-core", {"core"}, False),
        ("all,-core", {"ap"}, True),
        ("-core", {"ap"}, True),
        ("-core", {"core"}, False),
        ("+ap", {"ap", "house"}, True),
        ("+ap", {"house"}, False),
        ("all", set(), True),
        ("", {"ap"}, False),
        ("office+ap", {"office", "ap"}, False),  # one odd label name, not AND
    ],
)
def test_selector_grammar(selector, labels, expected):
    assert models.selector_matches(selector, labels) is expected


def test_controller_counts_as_connected():
    device = models.CmrDevice.from_rest({".id": "*1", "identity": "ctl", "controller": "true"})
    assert device.connected


def test_snapshot_nodes_and_links():
    snapshot = models.parse_snapshot(
        {
            "cmr/device": [{".id": "*1", "identity": "A", "serial": "S1", "controller": "true"}],
            "cmr/layout/node": [
                {".id": "*4", "name": "A", "layout": "House", "device": "A@10.0.0.1", "x": "79", "y": "4294967294"}
            ],
            "cmr/layout/link": [{".id": "*1", "layout": "House", "node1": "A", "node2": "B"}],
            "cmr": {"enabled": "true"},
        }
    )
    assert snapshot.controller.identity == "A"
    assert snapshot.nodes[0].device_identity == "A"
    assert snapshot.nodes[0].y == -2
    assert snapshot.links[0].ports == []
    assert snapshot.settings == {"enabled": "true"}


@pytest.mark.parametrize(
    ("installed", "available", "downgrade"),
    [
        ("7.40_ab12", "7.39rc1", True),  # internal build ahead of its channel
        ("7.40_ab12", "7.40", False),
        ("7.40", "7.40", False),
        ("7.40", None, False),
        ("7.38.5", "7.39rc1", False),
    ],
)
def test_would_downgrade(installed, available, downgrade):
    device = models.CmrDevice.from_rest(
        {".id": "*1", "identity": "x", "version": installed, "available-version": available}
    )
    assert device.would_downgrade is downgrade
    # An upgrade is never offered for the same pair a rule would downgrade.
    assert not (device.would_downgrade and device.update_available)


LINK_DETAIL = (
    "*6  ;;; fiber to building B, sfp-sfpplus1 both ends\r\n"
    "    layout=Everything node1=all-Site-Core node2=all-Site-Switch\r\n"
    "    links=*sfp-sfpplus1(,tx=29.9KiB,rx=32.1KiB)--*sfp-sfpplus1(,tx=18.0KiB,\r\n"
    "       rx=17.3KiB)\r\n"
    " \r\n"
    "*7  ;;; 5009 ether2 PoE-out powers ATL ether1\r\n"
    "    layout=Everything node1=all-Site-Core node2=all-Site-GW\r\n"
    "    links=*ether2(poe=powered-on,tx=375.5KiB,rx=8.9MiB)--*ether1(,tx=8.9MiB,\r\n"
    "       rx=369.9KiB)\r\n"
    " \r\n"
    "*B  ;;; ZeroTier over LTE to the branch office (its router isn't a CMR client); hAP s\r\n"
    "       its behind it\r\n"
    "    layout=Everything node1=all-Site-GW node2=all-hAP-Branch\r\n"
)


DEVICE_DETAIL = """Flags: L - LOCAL; C - CONNECTED
 *1 LC  ids=5DCD392DEAED1A27C7DC5E6572532685C38B11A7CC3B93AA5915386B694E7378/6093A
        52559427C19BAD31874C8457402EAD9026ADF14AE0910EE7B7720515674
        peer=peer-5dcd board="RB5009UPr+S+" labels=house,router alerts=0/12 0/9/3/0
        serial="HMW0BMZMXEY" identity="Site-Core"

 *2 C   peer=peer-f6c0 board="CRS320-8P-8B-4S+" labels=sauna,switch alerts=1/12
        0/9/3/0 serial="HG409N3K4C1" identity="Annex-Switch"

 *3  p  peer=peer-new identity="Pending-AP"
"""


def test_parse_device_alerts_from_console():
    assert models.parse_device_alerts(DEVICE_DETAIL) == {"*1": "0/12 0/9/3/0", "*2": "1/12 0/9/3/0"}
    assert models.parse_alert_summary("1/12 0/9/3/0").on == 1


def test_parse_link_details_from_console():
    details = models.parse_link_details(LINK_DETAIL)
    assert set(details) == {"*6", "*7"}  # *B has no detected ports
    assert details["*6"] == "*sfp-sfpplus1(,tx=29.9KiB,rx=32.1KiB)--*sfp-sfpplus1(,tx=18.0KiB,rx=17.3KiB)"
    ports = models.parse_links(details["*7"])
    assert ports[0].a == models.PortEnd("ether2", True, "powered-on", "375.5KiB", "8.9MiB")
    assert ports[0].b == models.PortEnd("ether1", True, None, "8.9MiB", "369.9KiB")


CATALOG = [
    {"product_code": "RB5009UPr+S+OUT", "product_name": "RB5009UPr+S+OUT", "product_status": "Current", "url": "u1",
     "images": {"small": ["s1.png"], "large": ["l1.jpg"]}},
    {"product_code": "RB5009UPr+S+IN", "product_name": "RB5009UPr+S+IN", "product_status": "Current", "url": "u2",
     "images": {"small": ["s2.png"], "large": ["l2.jpg"]}},
    {"product_code": "C53UiG+5HPaxD2HPaxD", "product_name": "hAP ax³", "product_status": "Current", "url": "u3",
     "images": {"small": ["s3.png"], "large": []}},
    {"product_code": "NOIMAGE1", "product_name": "No image", "images": {}},
]


def test_product_matching():
    products = [p for p in (models.compact_product(i) for i in CATALOG) if p]
    assert len(products) == 3  # entries without images are dropped
    # Exact product code from the device's auto-labels wins.
    assert models.match_product(products, "hAP ax^3", "C53UiG+5HPaxD2HPaxD")["name"] == "hAP ax³"
    # Without a code, the board name matches the product name loosely ...
    assert models.match_product(products, "hAP ax^3", None)["code"] == "C53UiG+5HPaxD2HPaxD"
    # ... or is a prefix of the code; the shortest code wins.
    hit = models.match_product(products, "RB5009UPr+S+", None)
    assert (hit["code"], hit["image"], hit["image_large"]) == ("RB5009UPr+S+IN", "s2.png", "l2.jpg")
    assert hit["ambiguous"]  # IN and OUT both match: photo yes, name no
    assert models.match_product(products, "CRS999", None) is None
    assert models.match_product(products, None, None) is None


def test_discontinued_products_only_as_a_fallback():
    """The full catalog (`is_history`) lists discontinued products as "Archived";
    a board name falls back to them only when no current product fits."""
    item = lambda code, name, status: {  # noqa: E731
        "product_code": code, "product_name": name, "product_status": status, "images": {"small": [f"{code}.png"]},
    }
    # Listed first on purpose: list order must not let them win.
    products = [p for p in (models.compact_product(i) for i in [
        item("RB951Ui-2HnD", "hAP", "Archived"),
        item("RB5009UG+S+IN", "RB5009UG+S+IN", "Archived"),
        item("RB5009UPr+S", "RB5009UPr+S", "Archived"),
        item("C53UiG+5HPaxD2HPaxD-OLD", "hAP ax³", "Archived"),
        *CATALOG,
    ]) if p]
    # A discontinued model gets its photo and name.
    assert models.match_product(products, "hAP", None)["code"] == "RB951Ui-2HnD"
    assert models.match_product(products, "RB5009UG+S+", None)["code"] == "RB5009UG+S+IN"
    # A current product keeps its match: same name, or a shorter archived code.
    assert models.match_product(products, "hAP ax^3", None)["code"] == "C53UiG+5HPaxD2HPaxD"
    assert models.match_product(products, "RB5009UPr+S", None)["code"] == "RB5009UPr+S+IN"
    # The exact code from the auto-labels wins whatever the status.
    assert models.match_product(products, "hAP ax^3", "C53UiG+5HPaxD2HPaxD-OLD")["code"] == "C53UiG+5HPaxD2HPaxD-OLD"


def _params(**values):
    return [{"name": name, "data": data, "group_name": "Ethernet"} for name, data in values.items()]


def test_port_spec_from_catalog_parameters():
    # RB5009: the 2.5G port is ether1; the PoE-in/out counts are the same ports.
    rb5009 = _params(**{
        "Number of 2.5G Ethernet ports with Reverse PoE (PoE-in)": "1",
        "Number of 2.5G Ethernet ports": "1",
        "10/100/1000 Ethernet ports": "7",
        "Number of 1G Ethernet ports with Reverse PoE (PoE-in)": "7",
        "SFP+ ports": "1",
        "PoE-out ports": "Ether1-Ether8",
        "Number of USB ports": "1",
    })
    assert models.port_spec(rb5009) == {
        "ether": [["2.5G", 1], ["1G", 7]], "mgmt": 0, "cages": [["sfp+", 1]], "poe_out": [[1, 8]],
    }
    # A lone 10/100 port beside many fast ones is the management port; QSFP56
    # is not an SFP56 cage.
    spine = _params(**{
        "10/100 Ethernet ports": "1",
        "Number of 50G SFP56 ports": "8",
        "Number of 200G QSFP56 ports": "2",
        "Number of 400G QSFP56-DD ports": "2",
    })
    assert models.port_spec(spine) == {
        "ether": [], "mgmt": 1, "cages": [["sfp56", 8], ["qsfp56", 2], ["qsfp56-dd", 2]], "poe_out": [],
    }
    # Five 10/100 ports are the ports themselves; several PoE-out ranges.
    hex_lite = _params(**{"10/100 Ethernet ports": "5", "PoE-out ports": "Ether1-Ether8 (af/at), Ether 10"})
    assert models.port_spec(hex_lite)["ether"] == [["100M", 5]]
    assert models.port_spec(hex_lite)["poe_out"] == [[1, 8], [10, 10]]
    assert models.port_spec(_params(**{"Number of Combo 10G Ethernet/ SFP+ ports": "4* (2.5G ETH/10G SFP+)"}))[
        "cages"
    ] == [["combo", 4]]
    # Accessories have no ports.
    assert models.port_spec(_params(**{"Material": "Aluminium"})) is None
    assert models.port_spec(None) is None
    product = models.compact_product({**CATALOG[0], "parameters": rb5009})
    assert product["ports"]["cages"] == [["sfp+", 1]]


def test_parse_job_devices():
    rows = [
        {"device": "AP@192.0.2.24", "state": "done", "current-version": "7.90", "upgrade-version": "7.90"},
        {"device": "AP@192.0.2.25", "state": "pending", "error": "no upgrade available"},
        {"device": "Core", "state": "done"},  # the controller itself: identity only
    ]
    parsed = models.parse_job_devices(rows)
    assert [(d.identity, d.address, d.state, d.error) for d in parsed] == [
        ("AP", "192.0.2.24", "done", None),
        ("AP", "192.0.2.25", "pending", "no upgrade available"),
        ("Core", None, "done", None),
    ]
    assert parsed[0].current_version == "7.90" and parsed[0].device_key is None
    assert models.parse_job_devices(None) == []


def test_alert_rule_kind_and_scope():
    def rule(**fields):
        return models.CmrAlertRule.from_rest({".id": "*1", "name": "r", **fields})

    # State conditions stay active while they match.
    assert rule(**{"cpu-above": "95"}).kind == "state"
    assert rule(**{"connected": "false"}).kind == "state"  # "disconnected" is a state too
    assert rule(**{"upgrade-available": "true"}).kind == "state"
    # Event conditions fire per occurrence; REST shows them as true, an outcome or a filter.
    assert rule(**{"rebooted": "true"}).kind == "event"
    assert rule(**{"upgrade-done": "fail"}).kind == "event"
    assert rule(**{"interface-change": "not-running", "interface-type": "ethernet"}).kind == "event"
    assert rule(**{"log-regex": "login failure", "log-topics": "system"}).kind == "event"
    assert rule(**{"rebooted": "false", "cpu-above": "95"}).kind == "state"  # an explicit no is no condition
    # Only a finished upgrade job is a system alert.
    assert rule(**{"upgrade-job-done": "success"}).scope == "system"
    assert rule(**{"upgrade-done": "success"}).scope == "device"


def test_wifi_items():
    """Shapes as REST returned them on 7.26beta1 (2026-10-06)."""
    raw = {
        ".id": "*2", "comment": "office", "disabled": "false", "hide-ssid": "false", "labels": "house,+ap,+5ghz",
        "security.authentication-types": "wpa2-psk,wpa3-psk", "security.encryption": "ccmp", "security.ft": "true",
        "security.passphrase": "secret", "ssid": "Office", "vlan-id": "10",
    }
    assert models.strip_secrets(raw) == {k: v for k, v in raw.items() if k != "security.passphrase"}
    network = models.CmrWifiNetwork.from_rest(models.strip_secrets(raw))
    assert (network.ssid, network.selector, network.bands, network.vlan_id) == ("Office", ["house", "+ap"], ["5"], 10)
    assert network.authentication == ["wpa2-psk", "wpa3-psk"] and network.fast_roaming and not network.hidden
    radio = models.CmrWifiRadio.from_rest({
        ".id": "*1", "channel.band": "5ghz-ax", "channel.frequency": "5180", "channel.width": "20/40/80mhz",
        "configuration.chains": "0,1", "configuration.country": "Latvia", "disabled": "true", "labels": "+2ghz",
    })
    assert (radio.selector, radio.bands, radio.band, radio.frequency, radio.disabled) == ([], ["2.4"], "5ghz-ax", "5180", True)
    assert models.split_wifi_labels("-6GHZ,office") == (["office"], ["6"])
