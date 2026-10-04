"""Repair hints about controller settings that limit what the map can show."""

from __future__ import annotations

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import issue_registry as ir

from .const import DOMAIN
from .coordinator import CmrConfigEntry
from .models import to_bool


def _topology_issue_id(entry: CmrConfigEntry) -> str:
    return f"topology_tracking_{entry.entry_id}"


@callback
def async_sync_setting_hints(hass: HomeAssistant, entry: CmrConfigEntry) -> None:
    """`track-topology=no` means links never get ports; say so once per entry."""
    snapshot = entry.runtime_data.data
    value = snapshot.settings.get("track-topology")
    tracking_off = value is not None and not to_bool(value)
    if tracking_off and snapshot.links:
        ir.async_create_issue(
            hass,
            DOMAIN,
            _topology_issue_id(entry),
            is_fixable=False,
            is_persistent=False,
            severity=ir.IssueSeverity.WARNING,
            translation_key="topology_tracking_off",
        )
    else:
        ir.async_delete_issue(hass, DOMAIN, _topology_issue_id(entry))


@callback
def async_clear_setting_hints(hass: HomeAssistant, entry: CmrConfigEntry) -> None:
    ir.async_delete_issue(hass, DOMAIN, _topology_issue_id(entry))
