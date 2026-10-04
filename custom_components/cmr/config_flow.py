"""Config flow for CMR."""

from __future__ import annotations

from collections.abc import Mapping
import logging
from typing import Any

import voluptuous as vol

from homeassistant.components import webhook
from homeassistant.config_entries import ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.const import (
    CONF_HOST,
    CONF_PASSWORD,
    CONF_SCAN_INTERVAL,
    CONF_SSL,
    CONF_USERNAME,
    CONF_VERIFY_SSL,
)
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import selector
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .api import CmrApi, CmrApiError, CmrAuthError, CmrConnectionError, CmrNotFoundError
from .const import (
    CONF_ACTIVITY_LOG,
    CONF_CATALOG_URL,
    CONF_ALLOW_UPGRADES,
    CONF_WEBHOOK_BASE_URL,
    CONF_WEBHOOK_ID,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
    MAX_SCAN_INTERVAL,
    MIN_SCAN_INTERVAL,
)
from .coordinator import CmrConfigEntry
from .models import CmrDevice
from .webhook import alert_setup_script, default_base_url

_LOGGER = logging.getLogger(__name__)

_PASSWORD = selector.TextSelector(
    selector.TextSelectorConfig(type=selector.TextSelectorType.PASSWORD)
)

USER_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_HOST): str,
        vol.Required(CONF_USERNAME, default="homeassistant"): str,
        vol.Required(CONF_PASSWORD): _PASSWORD,
        vol.Required(CONF_SSL, default=True): bool,
        vol.Required(CONF_VERIFY_SSL, default=False): bool,
    }
)


def build_api(hass: HomeAssistant, data: Mapping[str, Any]) -> CmrApi:
    """Create an API client from config entry data."""
    return CmrApi(
        async_get_clientsession(hass, verify_ssl=data.get(CONF_VERIFY_SSL, False)),
        data[CONF_HOST],
        data[CONF_USERNAME],
        data[CONF_PASSWORD],
        ssl=data.get(CONF_SSL, True),
    )


def _error_key(err: CmrApiError) -> str:
    """Form error for an API failure."""
    if isinstance(err, CmrAuthError):
        return "invalid_auth"
    if isinstance(err, CmrNotFoundError):
        return "no_cmr"
    if isinstance(err, CmrConnectionError):
        return "cannot_connect"
    return "router_error"


async def validate_input(hass: HomeAssistant, data: Mapping[str, Any]) -> CmrDevice | None:
    """Check access to the CMR menus and return the controller's own entry."""
    api = build_api(hass, data)
    await api.get("cmr")
    devices = [CmrDevice.from_rest(item) for item in await api.get("cmr/device")]
    return next((device for device in devices if device.controller), None)


class CmrConfigFlow(ConfigFlow, domain=DOMAIN):
    """Set up a CMR controller."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        placeholders = {"detail": ""}
        if user_input is not None:
            try:
                controller = await validate_input(self.hass, user_input)
            except CmrApiError as err:
                _LOGGER.warning("Controller %s refused setup: %s", user_input[CONF_HOST], err)
                placeholders["detail"] = err.detail
                errors["base"] = _error_key(err)
            except Exception:
                _LOGGER.exception("Unexpected error validating the controller")
                errors["base"] = "unknown"
            else:
                if controller is None:
                    errors["base"] = "not_controller"
                else:
                    await self.async_set_unique_id(controller.key)
                    self._abort_if_unique_id_configured(
                        updates={CONF_HOST: user_input[CONF_HOST]}
                    )
                    return self.async_create_entry(
                        title=f"CMR {controller.identity}",
                        data={**user_input, CONF_WEBHOOK_ID: webhook.async_generate_id()},
                    )
        return self.async_show_form(
            step_id="user",
            data_schema=self.add_suggested_values_to_schema(USER_SCHEMA, user_input),
            errors=errors,
            description_placeholders=placeholders,
        )

    async def async_step_reauth(
        self, entry_data: Mapping[str, Any]
    ) -> ConfigFlowResult:
        return await self.async_step_reauth_confirm()

    async def async_step_reauth_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        entry = self._get_reauth_entry()
        errors: dict[str, str] = {}
        placeholders = {"host": entry.data[CONF_HOST], "detail": ""}
        if user_input is not None:
            data = {**entry.data, **user_input}
            try:
                await validate_input(self.hass, data)
            except CmrApiError as err:
                placeholders["detail"] = err.detail
                errors["base"] = _error_key(err)
            else:
                return self.async_update_reload_and_abort(entry, data=data)
        return self.async_show_form(
            step_id="reauth_confirm",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_USERNAME, default=entry.data[CONF_USERNAME]): str,
                    vol.Required(CONF_PASSWORD): _PASSWORD,
                }
            ),
            description_placeholders=placeholders,
            errors=errors,
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: CmrConfigEntry) -> OptionsFlow:
        return CmrOptionsFlow()


class CmrOptionsFlow(OptionsFlow):
    """Polling interval and the alert webhook address."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(data=user_input)

        options = self.config_entry.options
        base_url = options.get(CONF_WEBHOOK_BASE_URL) or default_base_url(self.hass)
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        CONF_SCAN_INTERVAL,
                        default=options.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL),
                    ): selector.NumberSelector(
                        selector.NumberSelectorConfig(
                            min=MIN_SCAN_INTERVAL,
                            max=MAX_SCAN_INTERVAL,
                            unit_of_measurement="s",
                            mode=selector.NumberSelectorMode.BOX,
                        )
                    ),
                    vol.Optional(CONF_WEBHOOK_BASE_URL, default=base_url or ""): str,
                    vol.Required(
                        CONF_ALLOW_UPGRADES,
                        default=options.get(CONF_ALLOW_UPGRADES, False),
                    ): bool,
                    vol.Optional(
                        CONF_CATALOG_URL,
                        description={"suggested_value": options.get(CONF_CATALOG_URL, "")},
                    ): selector.TextSelector(selector.TextSelectorConfig(type=selector.TextSelectorType.URL)),
                    vol.Required(
                        CONF_ACTIVITY_LOG,
                        default=options.get(CONF_ACTIVITY_LOG, "notable"),
                    ): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=["notable", "all", "off"],
                            translation_key="activity_log",
                            mode=selector.SelectSelectorMode.DROPDOWN,
                        )
                    ),
                }
            ),
            description_placeholders={
                "script": alert_setup_script(
                    base_url, self.config_entry.data[CONF_WEBHOOK_ID]
                )
            },
        )
