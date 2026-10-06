"""RouterOS update entities, one per managed device (RouterBOOT firmware is not covered)."""

from __future__ import annotations

from datetime import timedelta
from typing import Any

from homeassistant.components.update import (
    UpdateDeviceClass,
    UpdateEntity,
    UpdateEntityDescription,
    UpdateEntityFeature,
)
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from .api import CmrApiError
from .const import CONF_ALLOW_UPGRADES, DOMAIN
from .coordinator import CmrConfigEntry
from .entity import CmrDeviceEntity, async_add_per_device
from .models import CmrDevice, is_newer

FIRMWARE = UpdateEntityDescription(
    key="update",
    translation_key="firmware",
    device_class=UpdateDeviceClass.FIRMWARE,
)

# Upgrade job states in which devices are being, or are about to be, upgraded.
# A `scheduled` job waits for its schedule-time, possibly for days.
_RUNNING = {"queued", "queued (busy)", "waiting devices", "version check", "processing"}
# Stop showing an install as running if the version never changes (failed job).
_INSTALL_TIMEOUT = timedelta(minutes=20)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: CmrConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    async_add_per_device(
        entry, async_add_entities, lambda key: [CmrFirmwareUpdate(coordinator, key, FIRMWARE)]
    )


class CmrFirmwareUpdate(CmrDeviceEntity, UpdateEntity):
    """Installed RouterOS version against what the device's channel offers.

    The controller flags any *different* version as an upgrade; an older
    available version (an internal build ahead of its channel) is reported as
    up to date and never installed by default. Installing the version the
    channel offers goes through the device's channel, like the controller's
    own Upgrade button: the controller downloads what it needs. Only another
    version, asked for explicitly, is pinned, and the controller installs a
    pinned version only from packages it already has (ARCHITECTURE W18).
    """

    _installing_to: str | None = None
    _installing_since = dt_util.utc_from_timestamp(0)
    # Job ids that existed before our install, to tell its own job apart.
    _jobs_before: frozenset[str] = frozenset()

    @property
    def supported_features(self) -> UpdateEntityFeature:
        if not self.coordinator.config_entry.options.get(CONF_ALLOW_UPGRADES):
            return UpdateEntityFeature(0)
        return (
            UpdateEntityFeature.INSTALL
            | UpdateEntityFeature.SPECIFIC_VERSION
            | UpdateEntityFeature.PROGRESS
        )

    @property
    def entity_picture(self) -> str | None:
        """The product photo, when the catalog has the device (no brand icon exists)."""
        device = self.device
        catalog = self.coordinator.catalog
        product = catalog.product_for(device) if catalog and device else None
        return product["image"] if product else None

    @property
    def installed_version(self) -> str | None:
        device = self.device
        return device.version if device else None

    @property
    def release_url(self) -> str | None:
        """MikroTik's changelog for the device's release channel."""
        device = self.device
        tree = {
            "stable": "stable-release-tree",
            "testing": "testing-release-tree",
            "long-term": "long-term-release-tree",
            "development": "development-release-tree",
        }.get(device.channel or "" if device else "")
        return f"https://mikrotik.com/download/changelogs/{tree}" if tree else "https://mikrotik.com/download/changelogs"

    @property
    def latest_version(self) -> str | None:
        """The newer version the channel offers, else the installed one (= up to date).

        The controller leaves `available-version` empty for a device that is
        already on its channel's newest version; without this the entity
        would read "unknown" exactly for the devices that are fine.
        """
        device = self.device
        if device is None or not device.version:
            return None
        if self._install_running(device):
            # A rebooting device has no available-version; keep showing the target.
            return self._installing_to
        return device.available_version if device.update_available else device.version

    @property
    def in_progress(self) -> bool:
        device = self.device
        if device is None:
            return False
        if self._install_running(device):
            return True
        return any(
            str(job.get("state", "")) in _RUNNING and device.matches_labels(job.get("labels"))
            for job in self.coordinator.data.upgrade_jobs
        )

    def _install_running(self, device: CmrDevice) -> bool:
        """Our own install is still under way.

        It ends when the device runs the target version, when the job it
        created has finished (a failed job, e.g. "no upgrade available",
        leaves the version unchanged), or after a timeout as a last resort.
        """
        if not self._installing_to:
            return False
        if (
            device.version == self._installing_to
            or dt_util.utcnow() - self._installing_since >= _INSTALL_TIMEOUT
            or any(
                str(job.get("state", "")) in ("done", "cancelled")
                for job in self._own_jobs()
            )
        ):
            self._installing_to = None
            return False
        return True

    def _own_jobs(self) -> list[dict[str, Any]]:
        """Jobs that appeared after our install and could be its job.

        `/cmr/device/upgrade` jobs carry no label selector (rule jobs do) and
        name only a pinned version as their channel.
        """
        return [
            job
            for job in self.coordinator.data.upgrade_jobs
            if str(job.get(".id")) not in self._jobs_before
            and not job.get("labels")
            and job.get("channel") in (None, "", self._installing_to)
        ]

    @property
    def release_summary(self) -> str | None:
        device = self.device
        if device is None:
            return None
        parts = []
        if device.channel:
            parts.append(f"Channel: {device.channel}")
        if device.upgrade_rule:
            parts.append(f"Upgrade rule: {device.upgrade_rule}")
        if device.available_version and not device.update_available:
            parts.append(f"Channel offers {device.available_version}")
        return " · ".join(parts) or None

    async def async_install(self, version: str | None, backup: bool, **kwargs: Any) -> None:
        device = self.device
        if device is None:
            raise HomeAssistantError(translation_domain=DOMAIN, translation_key="device_gone")
        target = version or (device.available_version if device.update_available else None)
        if target is None:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="no_newer_version",
                translation_placeholders={"device": device.identity, "version": device.version or "?"},
            )
        if version is None and not is_newer(target, device.version):
            # Never let a default install downgrade; an explicit version is the user's call.
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="no_newer_version",
                translation_placeholders={"device": device.identity, "version": device.version or "?"},
            )
        # `duration` ends the command's progress output, not the upgrade job,
        # which keeps running on the controller.
        payload = {"numbers": device.rest_id, "duration": "2s"}
        if target != device.available_version:
            # Only an explicitly requested other version is pinned: a pinned
            # version must already be on the controller, it isn't downloaded.
            payload["channel"] = target
        jobs_before = frozenset(str(job.get(".id")) for job in self.coordinator.data.upgrade_jobs)
        try:
            await self.coordinator.api.post("cmr/device/upgrade", payload)
        except CmrApiError as err:
            refused = "permission" in (err.detail or "").lower()
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="upgrade_refused_permissions" if refused else "upgrade_failed",
                translation_placeholders={"device": device.identity, "detail": err.detail},
            ) from err
        self._installing_to = target
        self._installing_since = dt_util.utcnow()
        self._jobs_before = jobs_before
        self.async_write_ha_state()
        await self.coordinator.async_request_refresh()
