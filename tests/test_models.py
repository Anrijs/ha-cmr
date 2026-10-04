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
    assert device.role == "gateway"
    assert device.alerts.critical == 1


def test_controller_counts_as_connected():
    device = models.CmrDevice.from_rest({".id": "*1", "identity": "ctl", "controller": "true"})
    assert device.connected


def test_device_role_from_board():
    assert models.device_role([], "CRS320-8P-8B-4S+") == "switch"
    assert models.device_role([], "wAP ax") == "ap"
    assert models.device_role([], "RB5009UPr+S+") == "router"
    assert models.device_role([], "ATLGM") == "lte"


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


def test_parse_link_details_from_console():
    details = models.parse_link_details(LINK_DETAIL)
    assert set(details) == {"*6", "*7"}  # *B has no detected ports
    assert details["*6"] == "*sfp-sfpplus1(,tx=29.9KiB,rx=32.1KiB)--*sfp-sfpplus1(,tx=18.0KiB,rx=17.3KiB)"
    ports = models.parse_links(details["*7"])
    assert ports[0].a == models.PortEnd("ether2", True, "powered-on", "375.5KiB", "8.9MiB")
    assert ports[0].b == models.PortEnd("ether1", True, None, "8.9MiB", "369.9KiB")
