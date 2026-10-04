"""Binary sensors: device connectivity and firing alert rules."""

from __future__ import annotations

from typing import Any

from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
    BinarySensorEntityDescription,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .coordinator import CmrConfigEntry
from .entity import (
    CmrAlertEntity,
    CmrDeviceEntity,
    CmrEntity,
    async_add_per_alert,
    async_add_per_device,
)

CONNECTED = BinarySensorEntityDescription(
    key="connected",
    translation_key="connected",
    device_class=BinarySensorDeviceClass.CONNECTIVITY,
)
NETWORK_TROUBLE = BinarySensorEntityDescription(
    key="network_trouble",
    translation_key="network_trouble",
    device_class=BinarySensorDeviceClass.PROBLEM,
)
ALERT_RULE = BinarySensorEntityDescription(
    key="alert_rule",
    device_class=BinarySensorDeviceClass.PROBLEM,
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: CmrConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    async_add_per_device(
        entry, async_add_entities, lambda key: [CmrConnectedSensor(coordinator, key, CONNECTED)]
    )
    controller_key = entry.unique_id or ""
    async_add_entities([CmrTroubleSensor(coordinator, controller_key, NETWORK_TROUBLE)])
    async_add_per_alert(
        entry,
        async_add_entities,
        lambda rule_id: [
            CmrAlertRuleSensor(coordinator, controller_key, rule_id, ALERT_RULE)
        ],
    )


class CmrConnectedSensor(CmrDeviceEntity, BinarySensorEntity):
    """Whether the device's CMR client is connected to the controller."""

    @property
    def is_on(self) -> bool | None:
        device = self.device
        return device.connected if device else None

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        device = self.device
        if device is None:
            return None
        return {
            "role": device.role,
            "labels": device.labels,
            "controller": device.controller,
            "pairing_pending": device.pending,
            "disconnected_since": device.disconnected_since,
        }


class CmrAlertRuleSensor(CmrAlertEntity, BinarySensorEntity):
    """On while the rule is fired on at least one device."""

    @property
    def name(self) -> str | None:
        rule = self.rule
        return f"Alert {rule.name}" if rule else None

    @property
    def is_on(self) -> bool | None:
        rule = self.rule
        return rule.devices_on > 0 if rule else None

    @property
    def icon(self) -> str:
        rule = self.rule
        if rule is None or rule.disabled:
            return "mdi:bell-off-outline"
        return "mdi:bell-alert" if rule.devices_on else "mdi:bell-check-outline"

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        rule = self.rule
        if rule is None:
            return None
        return {
            "severity": rule.severity,
            "categories": rule.categories,
            "labels": rule.labels,
            "comment": rule.comment,
            "devices": rule.devices,
            "devices_on": rule.devices_on,
            "fired": rule.fired,
            "action_failures": rule.action_failures,
            "disabled": rule.disabled,
            "webhook": rule.webhook_url is not None,
        }


class CmrTroubleSensor(CmrEntity, BinarySensorEntity):
    """On while any issue is detected across the network."""

    @property
    def is_on(self) -> bool:
        eventlog = self.coordinator.eventlog
        return bool(eventlog and eventlog.engine.active)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        eventlog = self.coordinator.eventlog
        return {"issues": [issue["title"] for issue in eventlog.insight_list()] if eventlog else []}
