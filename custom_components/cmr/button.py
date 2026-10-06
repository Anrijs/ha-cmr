"""Buttons: check for new RouterOS versions, run an upgrade rule now, reboot a device."""

from __future__ import annotations

from typing import Any

from homeassistant.components.button import ButtonDeviceClass, ButtonEntity, ButtonEntityDescription
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .api import CmrApiError
from .const import CONF_ALLOW_UPGRADES, DOMAIN
from .coordinator import CmrConfigEntry, CmrCoordinator
from .actions import async_reboot
from .entity import CmrDeviceEntity, CmrEntity, async_add_per_device

CHECK_VERSIONS = ButtonEntityDescription(
    key="check_versions",
    translation_key="check_versions",
    entity_category=EntityCategory.CONFIG,
)
RUN_RULE = ButtonEntityDescription(key="run_rule", translation_key="run_rule")
REBOOT = ButtonEntityDescription(
    key="reboot",
    translation_key="reboot",
    device_class=ButtonDeviceClass.RESTART,
    entity_category=EntityCategory.CONFIG,
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: CmrConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    controller_key = entry.unique_id or ""
    async_add_entities([CmrCheckVersionsButton(coordinator, controller_key, CHECK_VERSIONS)])
    if not entry.options.get(CONF_ALLOW_UPGRADES):
        return

    known: set[str] = set()

    @callback
    def add_rules() -> None:
        new = [
            rule_id
            for rule in coordinator.data.upgrade_rules
            if (rule_id := str(rule.get(".id", ""))) and rule_id not in known
        ]
        if new:
            known.update(new)
            async_add_entities(
                CmrRunRuleButton(coordinator, controller_key, rule_id) for rule_id in new
            )

    add_rules()
    entry.async_on_unload(coordinator.async_add_listener(add_rules))
    async_add_per_device(entry, async_add_entities, lambda key: [CmrRebootButton(coordinator, key, REBOOT)])


class CmrCheckVersionsButton(CmrEntity, ButtonEntity):
    """Ask the controller to check its upgrade channels now."""

    async def async_press(self) -> None:
        try:
            await self.coordinator.api.post("cmr/upgrade/version-check", {"duration": "5s"})
        except CmrApiError as err:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="command_failed",
                translation_placeholders={"detail": err.detail},
            ) from err
        await self.coordinator.async_request_refresh()


class CmrRunRuleButton(CmrEntity, ButtonEntity):
    """Start an upgrade rule's job now (`/cmr/upgrade/trigger`).

    Refuses while any covered device would be moved to an *older* version: the
    controller treats any different version as an upgrade.
    """

    def __init__(self, coordinator: CmrCoordinator, controller_key: str, rule_id: str) -> None:
        super().__init__(coordinator, controller_key, RUN_RULE, f"run_rule_{rule_id}")
        self._rule_id = rule_id

    @property
    def rule(self) -> dict[str, Any] | None:
        return next(
            (r for r in self.coordinator.data.upgrade_rules if str(r.get(".id")) == self._rule_id),
            None,
        )

    @property
    def available(self) -> bool:
        return super().available and self.rule is not None

    @property
    def name(self) -> str | None:
        rule = self.rule
        return f"Run upgrade rule {rule.get('name')}" if rule else None

    @property
    def icon(self) -> str:
        return "mdi:play-circle-outline"

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        rule = self.rule
        if rule is None:
            return None
        members = self._members(rule)
        return {
            "devices": [d.identity for d in members],
            "would_upgrade": [d.identity for d in members if d.update_available],
            "would_downgrade": [d.identity for d in self._downgrades(members)],
        }

    def _members(self, rule: dict[str, Any]) -> list:
        return [
            d for d in self.coordinator.data.devices.values() if d.upgrade_rule == rule.get("name")
        ]

    @staticmethod
    def _downgrades(members: list) -> list:
        return [d for d in members if d.would_downgrade]

    async def async_press(self) -> None:
        rule = self.rule
        if rule is None:
            raise HomeAssistantError(translation_domain=DOMAIN, translation_key="device_gone")
        members = self._members(rule)
        downgrades = self._downgrades(members)
        if downgrades:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="rule_would_downgrade",
                translation_placeholders={
                    "rule": str(rule.get("name")),
                    "devices": ", ".join(
                        f"{d.identity} ({d.version} → {d.available_version})" for d in downgrades
                    ),
                },
            )
        if not any(d.update_available for d in members):
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="rule_nothing_to_do",
                translation_placeholders={"rule": str(rule.get("name"))},
            )
        try:
            await self.coordinator.api.post("cmr/upgrade/trigger", {"numbers": self._rule_id})
        except CmrApiError as err:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="command_failed",
                translation_placeholders={"detail": err.detail},
            ) from err
        await self.coordinator.async_request_refresh()


class CmrRebootButton(CmrDeviceEntity, ButtonEntity):
    """Reboot one device through the controller (`/cmr/device/reboot`)."""

    @property
    def available(self) -> bool:
        device = self.device
        return super().available and device is not None and device.connected and not device.pending

    async def async_press(self) -> None:
        device = self.device
        if device is None:
            raise HomeAssistantError(translation_domain=DOMAIN, translation_key="device_gone")
        try:
            await async_reboot(self.coordinator.api, device.rest_id)
        except CmrApiError as err:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="reboot_failed",
                translation_placeholders={"device": device.identity, "detail": err.detail},
            ) from err
        await self.coordinator.async_request_refresh()
