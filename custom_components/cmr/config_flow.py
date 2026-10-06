"""Config, reauth, reconfigure and options flows for CMR."""

from __future__ import annotations

from collections.abc import Mapping
import logging
from typing import Any

import aiohttp
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
from homeassistant.data_entry_flow import section
from homeassistant.helpers import selector
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.util.ssl import client_context, client_context_no_verify

from .api import CmrApi, CmrApiError, CmrAuthError, CmrConnectionError, CmrNotFoundError
from .const import (
    CONF_ACTIVITY_LOG,
    CONF_ALLOW_UPGRADES,
    CONF_DETECTION,
    CONF_OFFLINE_MINUTES,
    CONF_WEBHOOK_BASE_URL,
    CONF_WEBHOOK_ID,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
    MAX_SCAN_INTERVAL,
    MIN_SCAN_INTERVAL,
)
from .coordinator import CmrConfigEntry
from .insights import DEFAULT_THRESHOLDS, OFFLINE_AFTER
from .models import CmrDevice
from .webhook import default_base_url

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


def build_api(hass: HomeAssistant, data: Mapping[str, Any], *, dedicated: bool = False) -> CmrApi:
    """Create an API client from config entry data.

    A loaded entry gets its own HTTP session (`dedicated`): the router keeps
    the rights a REST session logged in with, so after the user's group
    changes, reloading the integration must really close the connections
    and log in again. Home Assistant's shared session would keep them alive.
    """
    verify_ssl = data.get(CONF_VERIFY_SSL, False)
    if dedicated:
        # Our own session, not one from Home Assistant's helpers: those patch
        # `close()` to warn, and this one is closed on unload on purpose.
        context = client_context() if verify_ssl else client_context_no_verify()
        session = aiohttp.ClientSession(connector=aiohttp.TCPConnector(ssl=context))
    else:
        session = async_get_clientsession(hass, verify_ssl=verify_ssl)
    return CmrApi(
        session,
        data[CONF_HOST],
        data[CONF_USERNAME],
        data[CONF_PASSWORD],
        ssl=data.get(CONF_SSL, True),
        owns_session=dedicated,
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
    # 1.2: per-device diagnostic sensors are disabled by default (migrated in __init__).
    MINOR_VERSION = 2

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
                        # A user with `write` is the expected setup: upgrades,
                        # reboots and pairing from Home Assistant. A read-only
                        # user turns this off in the options.
                        options={CONF_ALLOW_UPGRADES: True},
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

    async def async_step_reconfigure(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Change the address, user or HTTPS settings of the same controller."""
        entry = self._get_reconfigure_entry()
        errors: dict[str, str] = {}
        placeholders = {"detail": ""}
        if user_input is not None:
            changes = {k: v for k, v in user_input.items() if k != CONF_PASSWORD or v}
            data = {**entry.data, **changes}
            try:
                controller = await validate_input(self.hass, data)
            except CmrApiError as err:
                placeholders["detail"] = err.detail
                errors["base"] = _error_key(err)
            except Exception:
                _LOGGER.exception("Unexpected error validating the controller")
                errors["base"] = "unknown"
            else:
                if controller is None:
                    errors["base"] = "not_controller"
                else:
                    # The entry stays bound to its controller; another one is a new entry.
                    await self.async_set_unique_id(controller.key)
                    self._abort_if_unique_id_mismatch(reason="wrong_controller")
                    return self.async_update_reload_and_abort(entry, data_updates=changes)
        current = entry.data
        schema = vol.Schema(
            {
                vol.Required(CONF_HOST, default=current[CONF_HOST]): str,
                vol.Required(CONF_USERNAME, default=current[CONF_USERNAME]): str,
                vol.Optional(CONF_PASSWORD): _PASSWORD,
                vol.Required(CONF_SSL, default=current.get(CONF_SSL, True)): bool,
                vol.Required(CONF_VERIFY_SSL, default=current.get(CONF_VERIFY_SSL, False)): bool,
            }
        )
        return self.async_show_form(
            step_id="reconfigure",
            data_schema=self.add_suggested_values_to_schema(schema, user_input),
            errors=errors,
            description_placeholders=placeholders,
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: CmrConfigEntry) -> OptionsFlow:
        return CmrOptionsFlow()


_COUNT = selector.NumberSelector(selector.NumberSelectorConfig(min=0, max=100, mode=selector.NumberSelectorMode.BOX))


class CmrOptionsFlow(OptionsFlow):
    """Polling, upgrades, the alert webhook, the activity log and issue detection."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(data=user_input)
        options = self.config_entry.options
        base_url = options.get(CONF_WEBHOOK_BASE_URL) or default_base_url(self.hass)

        detection = options.get(CONF_DETECTION) or {}
        schema = vol.Schema(
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
                vol.Required(CONF_DETECTION): section(
                    vol.Schema(
                        {
                            **{
                                vol.Required(kind, default=detection.get(kind, default)): _COUNT
                                for kind, default in DEFAULT_THRESHOLDS.items()
                            },
                            vol.Required(
                                CONF_OFFLINE_MINUTES,
                                default=detection.get(CONF_OFFLINE_MINUTES, int(OFFLINE_AFTER.total_seconds() // 60)),
                            ): selector.NumberSelector(
                                selector.NumberSelectorConfig(
                                    min=1, max=1440, unit_of_measurement="min", mode=selector.NumberSelectorMode.BOX
                                )
                            ),
                        }
                    ),
                    {"collapsed": True},
                ),
            }
        )
        return self.async_show_form(step_id="init", data_schema=schema)
