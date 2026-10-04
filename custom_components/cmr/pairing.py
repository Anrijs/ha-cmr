"""Pairing: the step every new device waits for.

With the controller's default `pairing-requirement=confirm`, a device that
connects is listed with the P flag until `/cmr/device/pair` is run on the
controller. Each such device becomes a Repair issue; when actions are
allowed, the issue is fixable and approves the pairing from Home Assistant.
A device whose own side still has to agree (p flag) gets a plain reminder.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import issue_registry as ir

from .api import CmrApi
from .const import DOMAIN
from .coordinator import CmrConfigEntry
from .models import CmrDevice


def pairing_issue_id(entry: CmrConfigEntry, device: CmrDevice) -> str:
    return f"pairing_{entry.entry_id}_{device.key}"


async def async_pair(api: CmrApi, device: CmrDevice, username: str | None = None, password: str | None = None) -> Any:
    """Approve the pairing of one device on the controller.

    Credentials are only needed when the device's own requirement is
    `password`: they are those of a user on the device.
    """
    payload: dict[str, Any] = {"numbers": device.rest_id}
    if username:
        payload["username"] = username
    if password:
        payload["password"] = password
    return await api.post("cmr/device/pair", payload)


@callback
def async_sync_pairing_issues(hass: HomeAssistant, entry: CmrConfigEntry) -> None:
    """One Repair issue per device waiting to be paired; gone once it is."""
    coordinator = entry.runtime_data
    wanted = {
        pairing_issue_id(entry, device): device
        for device in coordinator.data.devices.values()
        if device.unpaired
    }
    for issue_id in coordinator.pairing_issues - set(wanted):
        ir.async_delete_issue(hass, DOMAIN, issue_id)
    for issue_id, device in wanted.items():
        ir.async_create_issue(
            hass,
            DOMAIN,
            issue_id,
            is_fixable=device.pending and coordinator.allow_upgrades,
            is_persistent=False,
            severity=ir.IssueSeverity.WARNING,
            translation_key="pairing_pending" if device.pending else "pairing_remote",
            translation_placeholders={"identity": device.identity, "board": device.board or "unknown model"},
            data={"entry_id": entry.entry_id, "device_key": device.key},
        )
    coordinator.pairing_issues = set(wanted)


@callback
def async_clear_pairing_issues(hass: HomeAssistant, entry: CmrConfigEntry) -> None:
    for issue_id in entry.runtime_data.pairing_issues:
        ir.async_delete_issue(hass, DOMAIN, issue_id)
    entry.runtime_data.pairing_issues = set()
