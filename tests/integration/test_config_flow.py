"""Config and options flows against the fake controller."""

from __future__ import annotations

from homeassistant import config_entries
from homeassistant.const import CONF_HOST, CONF_PASSWORD, CONF_SCAN_INTERVAL, CONF_SSL, CONF_USERNAME, CONF_VERIFY_SSL
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType

from custom_components.cmr.const import CONF_ALLOW_UPGRADES, CONF_WEBHOOK_ID, DOMAIN

from .conftest import FakeController

USER_INPUT = {
    CONF_HOST: "192.0.2.254",
    CONF_USERNAME: "homeassistant",
    CONF_PASSWORD: "secret-test-password",
    CONF_SSL: True,
    CONF_VERIFY_SSL: False,
}


async def test_user_flow_creates_entry(hass: HomeAssistant, controller: FakeController) -> None:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    assert result["type"] is FlowResultType.FORM and result["errors"] == {}

    result = await hass.config_entries.flow.async_configure(result["flow_id"], USER_INPUT)
    await hass.async_block_till_done()
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "CMR Site-Core"
    entry = result["result"]
    assert entry.unique_id == "S0000000001"  # the controller's serial
    assert entry.data[CONF_WEBHOOK_ID]
    assert entry.state is config_entries.ConfigEntryState.LOADED


async def test_user_flow_errors(hass: HomeAssistant, controller: FakeController) -> None:
    controller.auth_ok = False
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], USER_INPUT)
    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == {"base": "invalid_auth"}

    controller.auth_ok = True
    controller.has_cmr = False
    result = await hass.config_entries.flow.async_configure(result["flow_id"], USER_INPUT)
    assert result["errors"] == {"base": "no_cmr"}
    assert result["description_placeholders"]["detail"] == "no such command"

    controller.has_cmr = True
    controller.device("Site-Core")["controller"] = "false"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], USER_INPUT)
    assert result["errors"] == {"base": "not_controller"}


async def test_duplicate_controller_aborts(hass: HomeAssistant, entry) -> None:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], USER_INPUT)
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"


async def test_options_enable_upgrades(hass: HomeAssistant, entry, controller: FakeController) -> None:
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] is FlowResultType.FORM
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {CONF_SCAN_INTERVAL: 60, CONF_ALLOW_UPGRADES: True, "activity_log": "notable"}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert entry.options[CONF_ALLOW_UPGRADES] is True
    # One "run rule" button per upgrade rule appears once upgrades are allowed.
    buttons = [s for s in hass.states.async_all("button") if s.entity_id.endswith(("_fleet", "_controller", "_default"))]
    assert len(buttons) == len(controller.data["cmr/upgrade"])
