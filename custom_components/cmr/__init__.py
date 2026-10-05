"""CMR integration."""

from __future__ import annotations

from datetime import timedelta

from homeassistant.const import CONF_SCAN_INTERVAL, Platform
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import config_validation as cv, device_registry as dr, entity_registry as er
from homeassistant.helpers.typing import ConfigType

from .catalog import ProductCatalog
from .config_flow import build_api
from .const import CONF_ALLOW_UPGRADES, DEFAULT_SCAN_INTERVAL, DOMAIN
from .coordinator import CmrConfigEntry, CmrCoordinator
from .entity import registry_device_info
from .eventlog import CmrEventLog
from .frontend import async_register_frontend
from .hints import async_clear_setting_hints, async_sync_setting_hints
from .pairing import async_clear_pairing_issues, async_sync_pairing_issues
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
    hass.data[f"{DOMAIN}_catalog"] = ProductCatalog(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: CmrConfigEntry) -> bool:
    coordinator = CmrCoordinator(hass, entry, build_api(hass, entry.data))
    entry.runtime_data = coordinator
    coordinator.catalog = hass.data[f"{DOMAIN}_catalog"]
    coordinator.eventlog = CmrEventLog(hass, entry)
    await coordinator.eventlog.async_load()
    entry.async_on_unload(coordinator.eventlog.async_unload)
    await coordinator.async_config_entry_first_refresh()

    @callback
    def _after_poll() -> None:
        _sync_device_registry(hass, entry)
        async_sync_pairing_issues(hass, entry)
        async_sync_setting_hints(hass, entry)

    _after_poll()
    entry.async_on_unload(coordinator.async_add_listener(_after_poll))
    entry.async_on_unload(lambda: async_clear_pairing_issues(hass, entry))
    entry.async_on_unload(lambda: async_clear_setting_hints(hass, entry))
    async_register_webhook(hass, entry)

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(_async_options_updated))
    return True


async def async_migrate_entry(hass: HomeAssistant, entry: CmrConfigEntry) -> bool:
    """1.1 → 1.2: turn off the per-device diagnostic sensors, as new installs do.

    With hundreds of devices they made thousands of entities, more than a
    browser can take in when Home Assistant starts. Users can enable any of
    them again; this runs once.
    """
    if entry.version > 1:
        return False
    if entry.minor_version < 2:
        from .sensor import DEVICE_SENSORS  # noqa: PLC0415 - platform module, only needed here

        off = tuple(f"_{d.key}" for d in DEVICE_SENSORS if d.entity_registry_enabled_default is False)
        registry = er.async_get(hass)
        for item in er.async_entries_for_config_entry(registry, entry.entry_id):
            if item.domain == "sensor" and item.disabled_by is None and item.unique_id.endswith(off):
                registry.async_update_entity(item.entity_id, disabled_by=er.RegistryEntryDisabler.INTEGRATION)
        hass.config_entries.async_update_entry(entry, minor_version=2)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: CmrConfigEntry) -> bool:
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)


async def _async_options_updated(hass: HomeAssistant, entry: CmrConfigEntry) -> None:
    """Apply changed options in place; only the upgrade controls need a reload."""
    coordinator = entry.runtime_data
    if bool(entry.options.get(CONF_ALLOW_UPGRADES)) != coordinator.allow_upgrades:
        await hass.config_entries.async_reload(entry.entry_id)
        return
    coordinator.update_interval = timedelta(seconds=entry.options.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL))
    if coordinator.eventlog is not None:
        coordinator.eventlog.configure()
    # The webhook address, catalog URL and activity-log mode are read from the
    # options whenever they are used.


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
