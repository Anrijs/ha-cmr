"""CMR integration."""

from __future__ import annotations

from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import config_validation as cv, device_registry as dr
from homeassistant.helpers.typing import ConfigType

from .config_flow import build_api
from .const import DOMAIN
from .coordinator import CmrConfigEntry, CmrCoordinator
from .entity import registry_device_info
from .eventlog import CmrEventLog
from .frontend import async_register_frontend
from .webhook import async_register_webhook
from .websocket import async_register_websocket

PLATFORMS = [
    Platform.BINARY_SENSOR,
    Platform.BUTTON,
    Platform.EVENT,
    Platform.SENSOR,
    Platform.UPDATE,
]

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the websocket API and the bundled dashboard cards once."""
    async_register_websocket(hass)
    await async_register_frontend(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: CmrConfigEntry) -> bool:
    coordinator = CmrCoordinator(hass, entry, build_api(hass, entry.data))
    entry.runtime_data = coordinator
    coordinator.eventlog = CmrEventLog(hass, entry)
    await coordinator.eventlog.async_load()
    entry.async_on_unload(coordinator.eventlog.async_unload)
    await coordinator.async_config_entry_first_refresh()

    _sync_device_registry(hass, entry)
    entry.async_on_unload(
        coordinator.async_add_listener(lambda: _sync_device_registry(hass, entry))
    )
    async_register_webhook(hass, entry)

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(_async_options_updated))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: CmrConfigEntry) -> bool:
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)


async def _async_options_updated(hass: HomeAssistant, entry: CmrConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)


async def async_remove_config_entry_device(
    hass: HomeAssistant, entry: CmrConfigEntry, device_entry: dr.DeviceEntry
) -> bool:
    """Allow deleting devices the controller no longer manages."""
    keys = {ident for domain, ident in device_entry.identifiers if domain == DOMAIN}
    return not keys & set(entry.runtime_data.data.devices)


@callback
def _sync_device_registry(hass: HomeAssistant, entry: CmrConfigEntry) -> None:
    """Create or refresh a registry device for every managed device.

    Runs on every poll so versions, models and addresses follow upgrades and
    newly paired devices appear without waiting for their entities. The
    controller goes first so the others can point at it with via_device.
    """
    coordinator = entry.runtime_data
    snapshot = coordinator.data
    registry = dr.async_get(hass)
    for device in sorted(snapshot.devices.values(), key=lambda d: not d.controller):
        info = dict(
            registry_device_info(snapshot, device, coordinator.api.base_url, coordinator.platform)
        )
        via = info.pop("via_device", None)
        parent = registry.async_get_device_by_identifier(via, entry.entry_id) if via else None
        registry.async_get_or_create(
            config_entry_id=entry.entry_id,
            via_device_id=parent.id if parent else None,
            **info,
        )
