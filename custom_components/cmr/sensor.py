"""Sensors for managed devices and fleet-wide counters."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from .coordinator import CmrConfigEntry, CmrCoordinator
from .entity import CmrDeviceEntity, CmrEntity, async_add_per_device
from .models import CmrDevice, CmrSnapshot

# A boot or connect timestamp computed from a duration jitters by the poll
# delay; ignore changes smaller than this so the state doesn't churn.
_TIMESTAMP_TOLERANCE = timedelta(seconds=90)


@dataclass(frozen=True, kw_only=True)
class CmrDeviceSensorDescription(SensorEntityDescription):
    value_fn: Callable[[CmrDevice], Any]
    attrs_fn: Callable[[CmrDevice], dict[str, Any]] | None = None
    # Value is a duration in seconds to be shown as "since" timestamp.
    since: bool = False
    # Only create the sensor when the controller provides the data.
    exists_fn: Callable[[CmrDevice], bool] = lambda _: True


@dataclass(frozen=True, kw_only=True)
class CmrFleetSensorDescription(SensorEntityDescription):
    value_fn: Callable[[CmrSnapshot], Any]
    attrs_fn: Callable[[CmrSnapshot], dict[str, Any]] | None = None


DEVICE_SENSORS: tuple[CmrDeviceSensorDescription, ...] = (
    CmrDeviceSensorDescription(
        key="uptime",
        translation_key="uptime",
        device_class=SensorDeviceClass.TIMESTAMP,
        value_fn=lambda d: d.uptime,
        since=True,
    ),
    CmrDeviceSensorDescription(
        key="version",
        translation_key="version",
        value_fn=lambda d: d.version,
        attrs_fn=lambda d: {
            "channel": d.channel,
            "upgrade_rule": d.upgrade_rule,
            "available_version": d.available_version,
            "update_available": d.update_available,
        },
    ),
    CmrDeviceSensorDescription(
        key="active_alerts",
        translation_key="active_alerts",
        state_class=SensorStateClass.MEASUREMENT,
        exists_fn=lambda d: d.alerts is not None,
        value_fn=lambda d: d.alerts.on if d.alerts else None,
        attrs_fn=lambda d: (
            {"matching_rules": d.alerts.total}
            | {f"{sev}_rules": getattr(d.alerts, sev) for sev in ("critical", "high", "medium", "low")}
            if d.alerts
            else {}
        ),
    ),
    CmrDeviceSensorDescription(
        key="connected_since",
        translation_key="connected_since",
        device_class=SensorDeviceClass.TIMESTAMP,
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=lambda d: d.connected_time,
        since=True,
    ),
    CmrDeviceSensorDescription(
        key="available_version",
        translation_key="available_version",
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=lambda d: d.available_version,
    ),
    CmrDeviceSensorDescription(
        key="channel",
        translation_key="channel",
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=lambda d: d.channel,
    ),
    CmrDeviceSensorDescription(
        key="upgrade_rule",
        translation_key="upgrade_rule",
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=lambda d: d.upgrade_rule,
    ),
    CmrDeviceSensorDescription(
        key="address",
        translation_key="address",
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=lambda d: d.address,
    ),
    CmrDeviceSensorDescription(
        key="packages",
        translation_key="packages",
        entity_category=EntityCategory.DIAGNOSTIC,
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda d: len(d.packages),
        attrs_fn=lambda d: {"packages": d.packages},
    ),
    CmrDeviceSensorDescription(
        key="labels",
        translation_key="labels",
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=lambda d: ", ".join(d.labels) or None,
        attrs_fn=lambda d: {"labels": d.labels, "auto_labels": d.auto_labels},
    ),
)


def _latest_job(snapshot: CmrSnapshot) -> dict[str, Any] | None:
    jobs = snapshot.upgrade_jobs
    return max(jobs, key=lambda job: str(job.get("schedule-time", ""))) if jobs else None


FLEET_SENSORS: tuple[CmrFleetSensorDescription, ...] = (
    CmrFleetSensorDescription(
        key="devices",
        translation_key="devices",
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda s: len(s.devices),
        attrs_fn=lambda s: {"devices": sorted(d.identity for d in s.devices.values())},
    ),
    CmrFleetSensorDescription(
        key="devices_online",
        translation_key="devices_online",
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda s: sum(d.connected for d in s.devices.values()),
        attrs_fn=lambda s: {
            "offline": sorted(d.identity for d in s.devices.values() if not d.connected),
            "pending": sorted(d.identity for d in s.devices.values() if d.pending),
        },
    ),
    CmrFleetSensorDescription(
        key="updates_available",
        translation_key="updates_available",
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda s: sum(d.update_available for d in s.devices.values()),
        attrs_fn=lambda s: {
            "devices": sorted(d.identity for d in s.devices.values() if d.update_available),
            "versions": sorted({d.version for d in s.devices.values() if d.version}),
        },
    ),
    CmrFleetSensorDescription(
        key="alerts_firing",
        translation_key="alerts_firing",
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda s: sum(rule.devices_on > 0 for rule in s.alerts.values()),
        attrs_fn=lambda s: {
            "rules": sorted(rule.name for rule in s.alerts.values() if rule.devices_on),
            "rules_total": len(s.alerts),
        },
    ),
    CmrFleetSensorDescription(
        key="last_upgrade_job",
        translation_key="last_upgrade_job",
        value_fn=lambda s: (_latest_job(s) or {}).get("state"),
        attrs_fn=lambda s: {
            key.replace("-", "_"): value
            for key, value in (_latest_job(s) or {}).items()
            if not key.startswith(".")
        },
    ),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: CmrConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    async_add_per_device(
        entry,
        async_add_entities,
        lambda key: [
            CmrDeviceSensor(coordinator, key, desc)
            for desc in DEVICE_SENSORS
            if desc.exists_fn(coordinator.data.devices[key])
        ],
    )
    controller_key = entry.unique_id or ""
    async_add_entities(
        CmrFleetSensor(coordinator, controller_key, desc) for desc in FLEET_SENSORS
    )
    async_add_entities([CmrIssuesSensor(coordinator, controller_key, NETWORK_ISSUES)])


class CmrDeviceSensor(CmrDeviceEntity, SensorEntity):
    entity_description: CmrDeviceSensorDescription

    def __init__(
        self,
        coordinator: CmrCoordinator,
        device_key: str,
        description: CmrDeviceSensorDescription,
    ) -> None:
        super().__init__(coordinator, device_key, description)
        self._since: datetime | None = None

    @property
    def native_value(self) -> Any:
        device = self.device
        if device is None:
            return None
        value = self.entity_description.value_fn(device)
        if not self.entity_description.since:
            return value
        if value is None:
            self._since = None
            return None
        since = dt_util.utcnow().replace(microsecond=0) - timedelta(seconds=value)
        if self._since is None or abs(since - self._since) > _TIMESTAMP_TOLERANCE:
            self._since = since
        return self._since

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        device = self.device
        if device is None or self.entity_description.attrs_fn is None:
            return None
        return self.entity_description.attrs_fn(device)


class CmrFleetSensor(CmrEntity, SensorEntity):
    entity_description: CmrFleetSensorDescription

    @property
    def native_value(self) -> Any:
        return self.entity_description.value_fn(self.coordinator.data)

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        if self.entity_description.attrs_fn is None:
            return None
        return self.entity_description.attrs_fn(self.coordinator.data)


NETWORK_ISSUES = SensorEntityDescription(
    key="network_issues",
    translation_key="network_issues",
    state_class=SensorStateClass.MEASUREMENT,
)


class CmrIssuesSensor(CmrEntity, SensorEntity):
    """Number of active detected issues, with the list as attributes."""

    @property
    def native_value(self) -> int:
        eventlog = self.coordinator.eventlog
        return len(eventlog.engine.active) if eventlog else 0

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        eventlog = self.coordinator.eventlog
        issues = eventlog.insight_list() if eventlog else []
        return {
            "issues": [
                {k: issue[k] for k in ("title", "detail", "severity", "since", "count", "kind")}
                for issue in issues
            ]
        }
