"""Home Assistant setup tests against a fake controller.

Needs `pytest-homeassistant-custom-component` (see README, Development); the
directory is skipped when it isn't installed.
"""

from __future__ import annotations

from collections.abc import Callable
import copy
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

LOG_LINES = [
    {".id": "*1", "time": "2026-10-04 11:58:02", "topics": "interface,info", "message": "ether6 link down"},
    {".id": "*2", "time": "2026-10-04 11:58:09", "topics": "interface,info",
     "message": "ether6 link up (speed 1G, full duplex)"},
    {".id": "*3", "time": "2026-10-04 11:59:30", "topics": "wireless,info",
     "message": "02:00:5E:10:00:01@wifi1-Site-AP1(Home) disconnected, connection lost, signal strength -71"},
    {".id": "*4", "time": "2026-10-04 12:00:00", "topics": "system,error,critical",
     "message": "login failure for user admin from 203.0.113.9 via ssh"},
]


class FakeController:
    """Answers the REST calls the integration makes, from the fixture."""

    def __init__(self) -> None:
        self.data: dict[str, Any] = copy.deepcopy(CONTROLLER)
        self.calls: list[tuple[str, str, dict[str, Any] | None]] = []
        self.auth_ok = True
        self.has_cmr = True
        self.console_ok = True
        self.log = list(LOG_LINES)

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
        return self._post(path, payload or {})

    def _get(self, path: str) -> Any:
        if path == "system/resource":
            return {"platform": "ExampleVendor", "board-name": "RB-TEST"}
        if path == "system/clock":
            return {"gmt-offset": "+00:00", "time": "12:00:00", "date": "2026-10-04"}
        if path == "log":
            return list(self.log)
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
        if path == "execute":
            if not self.console_ok:
                raise CmrAuthError("POST execute: not enough permissions", "not enough permissions")
            if payload.get("script", "").startswith("/cmr/device/"):
                return {"ret": self.device_console_output()}
            return {"ret": self.link_console_output()}
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
                f" version=\"{d['version']}\"\n        labels={d['labels']} alerts={d['alerts']} serial=\"{d['serial']}\""
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
