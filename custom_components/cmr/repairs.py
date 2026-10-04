"""Repair flows: approve a device's pairing from the Repairs page."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant import data_entry_flow
from homeassistant.components.repairs import RepairsFlow
from homeassistant.config_entries import ConfigEntryState
from homeassistant.const import CONF_PASSWORD, CONF_USERNAME
from homeassistant.core import HomeAssistant
from homeassistant.helpers import selector

from .api import CmrApiError
from .pairing import async_pair

_CREDENTIALS = vol.Schema(
    {
        vol.Optional(CONF_USERNAME): str,
        vol.Optional(CONF_PASSWORD): selector.TextSelector(
            selector.TextSelectorConfig(type=selector.TextSelectorType.PASSWORD)
        ),
    }
)


class PairingFixFlow(RepairsFlow):
    """Confirm, optionally with the device's credentials, then pair."""

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> data_entry_flow.FlowResult:
        return await self.async_step_confirm()

    async def async_step_confirm(self, user_input: dict[str, Any] | None = None) -> data_entry_flow.FlowResult:
        data = self.data or {}
        entry = self.hass.config_entries.async_get_entry(str(data.get("entry_id")))
        if entry is None or entry.state is not ConfigEntryState.LOADED:
            return self.async_abort(reason="not_pending")
        coordinator = entry.runtime_data
        device = coordinator.data.devices.get(str(data.get("device_key")))
        if device is None or not device.pending:
            return self.async_abort(reason="not_pending")

        errors: dict[str, str] = {}
        placeholders = {"identity": device.identity, "board": device.board or "unknown model", "detail": ""}
        if user_input is not None:
            try:
                await async_pair(coordinator.api, device, user_input.get(CONF_USERNAME), user_input.get(CONF_PASSWORD))
            except CmrApiError as err:
                errors["base"] = "pair_failed"
                placeholders["detail"] = err.detail
            else:
                await coordinator.async_request_refresh()
                return self.async_create_entry(data={})
        return self.async_show_form(
            step_id="confirm", data_schema=_CREDENTIALS, errors=errors, description_placeholders=placeholders
        )


async def async_create_fix_flow(hass: HomeAssistant, issue_id: str, data: dict[str, Any] | None) -> RepairsFlow:
    return PairingFixFlow()
