"""Config and options flows against the fake controller."""

from __future__ import annotations

from datetime import timedelta

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
    assert entry.options[CONF_ALLOW_UPGRADES] is True  # write users are the expected setup
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


DETECTION = {
    "wifi_flapping": 5, "link_flapping": 3, "device_flapping": 3, "device_reboots": 2,
    "login_failures": 5, "alert_action_failing": 1, "offline_minutes": 15,
}
OPTIONS = {CONF_SCAN_INTERVAL: 60, CONF_ALLOW_UPGRADES: False, "activity_log": "notable", "detection": DETECTION}


async def test_options_enable_upgrades_reloads(hass: HomeAssistant, entry, controller: FakeController) -> None:
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] is FlowResultType.FORM
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {**OPTIONS, CONF_ALLOW_UPGRADES: True}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert entry.options[CONF_ALLOW_UPGRADES] is True
    # One "run rule" button per upgrade rule appears once upgrades are allowed.
    buttons = [s for s in hass.states.async_all("button") if s.entity_id.endswith(("_fleet", "_controller", "_default"))]
    assert len(buttons) == len(controller.data["cmr/upgrade"])


async def test_other_options_apply_without_reload(hass: HomeAssistant, entry) -> None:
    coordinator = entry.runtime_data
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {**OPTIONS, CONF_SCAN_INTERVAL: 120, "detection": {**DETECTION, "wifi_flapping": 2, "offline_minutes": 5}},
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert entry.runtime_data is coordinator  # same objects: no reload happened
    assert coordinator.update_interval == timedelta(seconds=120)
    assert coordinator.eventlog.engine.rules["wifi_flapping"].threshold == 2
    assert coordinator.eventlog.engine.offline_after == timedelta(minutes=5)


async def test_reconfigure_same_controller(hass: HomeAssistant, entry, controller: FakeController) -> None:
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_RECONFIGURE, "entry_id": entry.entry_id}
    )
    assert result["type"] is FlowResultType.FORM and result["step_id"] == "reconfigure"
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {CONF_HOST: "cmr.example.test:8443", CONF_USERNAME: "homeassistant", CONF_SSL: True, CONF_VERIFY_SSL: True}
    )
    await hass.async_block_till_done()
    assert result["type"] is FlowResultType.ABORT and result["reason"] == "reconfigure_successful"
    assert entry.data[CONF_HOST] == "cmr.example.test:8443"
    assert entry.data[CONF_VERIFY_SSL] is True
    assert entry.data[CONF_PASSWORD] == "secret-test-password"  # kept when left empty
    assert entry.state is config_entries.ConfigEntryState.LOADED


async def test_reconfigure_refuses_another_controller(hass: HomeAssistant, entry, controller: FakeController) -> None:
    controller.device("Site-Core")["serial"] = "S9999999999"
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_RECONFIGURE, "entry_id": entry.entry_id}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {CONF_HOST: "192.0.2.99", CONF_USERNAME: "homeassistant", CONF_SSL: True, CONF_VERIFY_SSL: False}
    )
    assert result["type"] is FlowResultType.ABORT and result["reason"] == "wrong_controller"
    assert entry.data[CONF_HOST] == "192.0.2.254"
