"""Event entities for alerts pushed by the controller's alert webhooks."""

from __future__ import annotations

from typing import Any

from homeassistant.components.event import EventEntity, EventEntityDescription
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import SEVERITIES, SIGNAL_ALERT
from .coordinator import CmrConfigEntry
from .entity import CmrDeviceEntity, CmrEntity, async_add_per_device

FLEET_ALERT = EventEntityDescription(
    key="fleet_alert",
    translation_key="fleet_alert",
    event_types=list(SEVERITIES),
)
DEVICE_ALERT = EventEntityDescription(
    key="alert",
    translation_key="alert",
    event_types=list(SEVERITIES),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: CmrConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    async_add_entities([CmrFleetAlertEvent(coordinator, entry.unique_id or "", FLEET_ALERT)])
    async_add_per_device(
        entry, async_add_entities, lambda key: [CmrDeviceAlertEvent(coordinator, key, DEVICE_ALERT)]
    )


class _AlertEventMixin(EventEntity):
    """Listens for pushed alerts and records the matching ones."""

    def _matches(self, alert: dict[str, Any]) -> bool:
        raise NotImplementedError

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass,
                SIGNAL_ALERT.format(self.coordinator.config_entry.entry_id),
                self._handle_alert,
            )
        )

    @callback
    def _handle_alert(self, alert: dict[str, Any]) -> None:
        if not self._matches(alert):
            return
        attributes = {k: v for k, v in alert.items() if k != "severity" and v is not None}
        self._trigger_event(alert["severity"], attributes)
        self.async_write_ha_state()


class CmrFleetAlertEvent(_AlertEventMixin, CmrEntity):
    """Every alert from any device, on the controller."""

    def _matches(self, alert: dict[str, Any]) -> bool:
        return True


class CmrDeviceAlertEvent(_AlertEventMixin, CmrDeviceEntity):
    """Alerts about one device."""

    def _matches(self, alert: dict[str, Any]) -> bool:
        return alert.get("device_key") == self._device_key
