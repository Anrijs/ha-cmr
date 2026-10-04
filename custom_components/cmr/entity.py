"""Shared entity helpers for CMR."""

from __future__ import annotations

from collections.abc import Callable, Iterable

from homeassistant.core import callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import Entity, EntityDescription
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import CmrConfigEntry, CmrCoordinator
from .models import CmrAlertRule, CmrDevice, CmrSnapshot


def registry_device_info(
    snapshot: CmrSnapshot,
    device: CmrDevice,
    controller_url: str,
    manufacturer: str | None = None,
) -> DeviceInfo:
    """Full device registry entry for a managed device."""
    controller = snapshot.controller
    info = DeviceInfo(
        identifiers={(DOMAIN, device.key)},
        manufacturer=manufacturer,
        name=device.identity,
        model=device.board,
        model_id=device.model_code,
        sw_version=device.version,
        serial_number=device.serial,
    )
    if device.controller:
        info["configuration_url"] = controller_url
    elif device.address:
        info["configuration_url"] = f"http://{device.address}"
    if controller and not device.controller:
        info["via_device"] = (DOMAIN, controller.key)
    return info


class CmrEntity(CoordinatorEntity[CmrCoordinator]):
    """Base for all entities: attached to one registry device by key."""

    _attr_has_entity_name = True

    def __init__(
        self,
        coordinator: CmrCoordinator,
        device_key: str,
        description: EntityDescription,
        unique_suffix: str | None = None,
    ) -> None:
        super().__init__(coordinator)
        self.entity_description = description
        self._device_key = device_key
        self._attr_unique_id = f"{device_key}_{unique_suffix or description.key}"
        self._attr_device_info = DeviceInfo(identifiers={(DOMAIN, device_key)})


class CmrDeviceEntity(CmrEntity):
    """An entity describing one managed device."""

    @property
    def device(self) -> CmrDevice | None:
        return self.coordinator.data.devices.get(self._device_key)

    @property
    def available(self) -> bool:
        return super().available and self.device is not None


class CmrAlertEntity(CmrEntity):
    """An entity for one alert rule, attached to the controller device."""

    def __init__(
        self,
        coordinator: CmrCoordinator,
        controller_key: str,
        rule_id: str,
        description: EntityDescription,
    ) -> None:
        super().__init__(coordinator, controller_key, description, f"alert_{rule_id}")
        self._rule_id = rule_id

    @property
    def rule(self) -> CmrAlertRule | None:
        return self.coordinator.data.alerts.get(self._rule_id)

    @property
    def available(self) -> bool:
        return super().available and self.rule is not None


@callback
def async_add_per_device(
    entry: CmrConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
    factory: Callable[[str], Iterable[Entity]],
) -> None:
    """Add entities for every device now, and for devices paired later."""
    coordinator = entry.runtime_data
    known: set[str] = set()

    @callback
    def add_new() -> None:
        new = [key for key in coordinator.data.devices if key not in known]
        if new:
            known.update(new)
            async_add_entities([entity for key in new for entity in factory(key)])

    add_new()
    entry.async_on_unload(coordinator.async_add_listener(add_new))


@callback
def async_add_per_alert(
    entry: CmrConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
    factory: Callable[[str], Iterable[Entity]],
) -> None:
    """Add entities for every alert rule now, and for rules added later."""
    coordinator = entry.runtime_data
    known: set[str] = set()

    @callback
    def add_new() -> None:
        new = [rule_id for rule_id in coordinator.data.alerts if rule_id not in known]
        if new:
            known.update(new)
            async_add_entities([entity for rid in new for entity in factory(rid)])

    add_new()
    entry.async_on_unload(coordinator.async_add_listener(add_new))
