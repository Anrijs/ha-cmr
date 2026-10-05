"""Home Assistant setup tests against a fake controller.

Needs `pytest-homeassistant-custom-component` (see README, Development); the
directory is skipped when it isn't installed.
"""

from __future__ import annotations

from collections.abc import Callable
import copy
from datetime import UTC, datetime, timedelta
import json
from pathlib import Path
from typing import Any

import pytest

pytest.importorskip("pytest_homeassistant_custom_component")

from homeassistant.const import CONF_HOST, CONF_PASSWORD, CONF_SSL, CONF_USERNAME, CONF_VERIFY_SSL
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.cmr.api import CmrApi, CmrAuthError, CmrNotFoundError
from custom_components.cmr.const import CONF_WEBHOOK_ID, DOMAIN

FIXTURES = Path(__file__).parents[1] / "fixtures"

# Recorded from a real controller, anonymised. The `alerts` and `links`
# values are computed fields that REST leaves out; the fake controller
# serves them the way the real one does (see below).
CONTROLLER = json.loads((FIXTURES / "controller.json").read_text())

# (seconds ago, topics, message): stamped when served, so time filters see them as fresh.
LOG_LINES = [
    (150, "interface,info", "ether6 link down"),
    (143, "interface,info", "ether6 link up (speed 1G, full duplex)"),
    (60, "wireless,info", "02:00:5E:10:00:01@wifi1-Site-AP1(Home) disconnected, connection lost, signal strength -71"),
    (30, "system,error,critical", "login failure for user admin from 203.0.113.9 via ssh"),
]
# (seconds ago, source, client MAC, event, BSSID); the remote AP never appears in the controller's own log.
WIFI_ROWS = [
    (180, "Remote-AP@198.51.100.216", "3C:DC:75:C0:85:AC", "disconnected", "D0:EA:11:AE:17:FE"),
    (175, "Remote-AP@198.51.100.216", "3C:DC:75:C0:85:AC", "connected", "D0:EA:11:AE:17:FE"),
    # The same event the controller's log line reports, from the AP's point of view.
    (60, "Site-AP1@192.0.2.15", "02:00:5E:10:00:01", "disconnected", "D0:EA:11:AE:17:00"),
]


def stamp(seconds_ago: int) -> str:
    """A controller timestamp (the fake clock runs at UTC)."""
    return (datetime.now(UTC) - timedelta(seconds=seconds_ago)).strftime("%Y-%m-%d %H:%M:%S")


class FakeController:
    """Answers the REST calls the integration makes, from the fixture."""

    def __init__(self) -> None:
        self.data: dict[str, Any] = copy.deepcopy(CONTROLLER)
        self.calls: list[tuple[str, str, dict[str, Any] | None]] = []
        self.auth_ok = True
        self.has_cmr = True
        self.console_ok = True
        # Set to override the generated rows (e.g. [{}] for a controller that serves no fields).
        self.wifi_logs: list[dict[str, Any]] | None = None

    @property
    def devices(self) -> list[dict[str, Any]]:
        return self.data["cmr/device"]

    def device(self, identity: str) -> dict[str, Any]:
        return next(d for d in self.devices if d["identity"] == identity)

    async def request(self, method: str, path: str, payload: dict[str, Any] | None = None) -> Any:
        self.calls.append((method, path, payload))
        if not self.auth_ok:
            raise CmrAuthError(f"{method} {path}: HTTP 401")
        if path.startswith("cmr") and not self.has_cmr:
            raise CmrNotFoundError(f"{method} {path}: no such command", "no such command")
        if method == "GET":
            return self._get(path)
        if method == "PATCH":
            return self._patch(path, payload or {})
        return self._post(path, payload or {})

    def _patch(self, path: str, payload: dict[str, Any]) -> Any:
        menu, _, item_id = path.rpartition("/")
        for item in self.data.get(menu, []):
            if item[".id"] == item_id:
                item.update(payload)
                return item
        raise CmrNotFoundError(f"PATCH {path}: no such item", "no such item")

    def _get(self, path: str) -> Any:
        if path == "system/resource":
            return {"platform": "ExampleVendor", "board-name": "RB-TEST"}
        if path == "system/clock":
            return {"gmt-offset": "+00:00", "time": "12:00:00", "date": "2026-10-04"}
        if path == "log":
            return [
                {".id": f"*{i + 1}", "time": stamp(ago), "topics": topics, "message": message}
                for i, (ago, topics, message) in enumerate(LOG_LINES)
            ]
        if path not in self.data:
            raise CmrNotFoundError(f"GET {path}: no such command", "no such command")
        items = copy.deepcopy(self.data[path])
        if path == "cmr/device":
            for item in items:
                item.pop("alerts", None)  # computed: only on an explicit print
        if path == "cmr/layout/link":
            for item in items:
                item.pop("links", None)  # computed, and never returned over REST
        return items

    def _post(self, path: str, payload: dict[str, Any]) -> Any:
        if path == "cmr/device/print" and ".proplist" in payload:
            return [{".id": d[".id"], "alerts": d.get("alerts", "")} for d in self.devices]
        if path == "cmr/layout/link/print":
            return []  # the real controller returns nothing here
        if path == "log/print":
            return []
        if path == "cmr/device/wifi-logs":
            assert payload.get("numbers") and "time-start" in payload
            if self.wifi_logs is not None:
                return list(self.wifi_logs)
            return [
                {"source": source, "time": stamp(ago), "address": mac, "event": event, "bssid": bssid}
                for ago, source, mac, event, bssid in WIFI_ROWS
            ]
        if path == "execute":
            if not self.console_ok:
                raise CmrAuthError("POST execute: not enough permissions", "not enough permissions")
            if payload.get("script", "").startswith("/cmr/device/"):
                return {"ret": self.device_console_output()}
            return {"ret": self.link_console_output()}
        if path == "cmr/alert/unset":
            for rule in self.data["cmr/alert"]:
                if rule[".id"] == payload.get("numbers"):
                    rule.pop(payload.get("value-name"), None)
            return []
        if path == "cmr/device/pair":
            for d in self.devices:
                if d[".id"] == payload.get("numbers"):
                    d.pop("pending", None)  # approved: the device is managed from now on
            return [{"device": payload.get("numbers"), "status": "paired"}]
        if path in ("cmr/upgrade/version-check", "cmr/upgrade/trigger", "cmr/device/upgrade"):
            return []
        raise CmrNotFoundError(f"POST {path}: no such command", "no such command")

    def device_console_output(self) -> str:
        lines = []
        for d in self.devices:
            flags = ("L" if d.get("controller") == "true" else "") + ("C" if d.get("connected") == "true" else "")
            ids = d["ids"]
            lines.append(
                f" {d['.id']} {flags or ' '}  ids={ids[:40]}\n        {ids[40:]} peer={d['peer']} board=\"{d['board']}\""
                f" version=\"{d['version']}\"\n        labels={d['labels']}"
                + (f" alerts={d['alerts']}" if d.get("alerts") else "")  # unpaired devices have none yet
                + f" serial=\"{d['serial']}\""
                f"\n        identity=\"{d['identity']}\""
            )
        return "\n \n".join(lines) + "\n"

    def link_console_output(self) -> str:
        lines = []
        for link in self.data["cmr/layout/link"]:
            line = f" {link['.id']}   layout={link['layout']} node1={link['node1']} node2={link['node2']}"
            if link.get("links"):
                # Long values wrap onto indented continuation lines on the console.
                value = link["links"]
                line += f" links={value[:30]}\n          {value[30:]}"
            lines.append(line)
        return "\n".join(lines) + "\n"


@pytest.fixture(autouse=True)
def _custom_integrations(enable_custom_integrations: None) -> None:
    """Let Home Assistant load custom_components/."""


@pytest.fixture
def controller(monkeypatch: pytest.MonkeyPatch) -> FakeController:
    fake = FakeController()

    async def request(self: CmrApi, method: str, path: str, payload: dict[str, Any] | None = None) -> Any:
        return await fake.request(method, path.strip("/"), payload)

    monkeypatch.setattr(CmrApi, "_request", request)
    return fake


ENTRY_DATA = {
    CONF_HOST: "192.0.2.254",
    CONF_USERNAME: "homeassistant",
    CONF_PASSWORD: "secret-test-password",
    CONF_SSL: True,
    CONF_VERIFY_SSL: False,
    CONF_WEBHOOK_ID: "test-webhook-id",
}


@pytest.fixture
def make_entry(hass: HomeAssistant) -> Callable[..., MockConfigEntry]:
    def _make(**options: Any) -> MockConfigEntry:
        entry = MockConfigEntry(
            domain=DOMAIN,
            title="CMR Site-Core",
            unique_id="S0000000001",
            data=ENTRY_DATA,
            options=options,
        )
        entry.add_to_hass(hass)
        return entry

    return _make


@pytest.fixture
async def entry(hass: HomeAssistant, controller: FakeController, make_entry: Callable[..., MockConfigEntry]) -> MockConfigEntry:
    """A loaded config entry."""
    entry = make_entry()
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry
