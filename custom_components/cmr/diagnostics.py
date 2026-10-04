"""Diagnostics download: raw controller responses, credentials redacted."""

from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.const import CONF_PASSWORD, CONF_USERNAME
from homeassistant.core import HomeAssistant

from .const import CONF_WEBHOOK_ID
from .coordinator import CmrConfigEntry

TO_REDACT = {CONF_PASSWORD, CONF_USERNAME, CONF_WEBHOOK_ID, "ids"}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: CmrConfigEntry
) -> dict[str, Any]:
    coordinator = entry.runtime_data
    return {
        "entry": async_redact_data(entry.as_dict(), TO_REDACT),
        "raw": async_redact_data(coordinator.raw, TO_REDACT),
    }
