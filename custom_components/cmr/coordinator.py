"""Polls the CMR controller and keeps the latest snapshot."""

from __future__ import annotations

import asyncio
from datetime import datetime, timedelta
import logging
from typing import TYPE_CHECKING, Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_SCAN_INTERVAL
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

from .api import CmrApi, CmrApiError, CmrAuthError, CmrNotFoundError
from .const import CONF_ALLOW_UPGRADES, CONF_CATALOG_URL, DEFAULT_SCAN_INTERVAL, DOMAIN
from .models import CmrSnapshot, parse_device_alerts, parse_link_details, parse_snapshot

if TYPE_CHECKING:
    from .catalog import ProductCatalog
    from .eventlog import CmrEventLog

_LOGGER = logging.getLogger(__name__)

# Menus read every poll. The first two are required; the rest are optional so
# an older controller without layouts or upgrade rules still works.
REQUIRED_PATHS = ("cmr", "cmr/device")
OPTIONAL_PATHS = (
    "cmr/alert",
    "cmr/upgrade",
    "cmr/upgrade/job",
    "cmr/layout",
    "cmr/layout/node",
    "cmr/layout/link",
)

# Fields the controller computes on print and leaves out of REST responses
# (also when asked for by name). They are read from the console output of
# these commands; the REST API can run a console command and return its text.
LINK_DETAIL_SCRIPT = "/cmr/layout/link/print detail show-ids without-paging"
DEVICE_DETAIL_SCRIPT = "/cmr/device/print detail show-ids without-paging"
# `show-devices` lists the devices on which a state alert is active right now
# (event alerts never are). It prints a table (identities may hold spaces); as
# a value it yields records, so the script prints one device id per line.
ALERT_DEVICES_SCRIPT = ':foreach d in=[/cmr/alert/show-devices {rule} on-only=yes as-value] do={{:put ($d->".id")}}'

type CmrConfigEntry = ConfigEntry[CmrCoordinator]


class CmrCoordinator(DataUpdateCoordinator[CmrSnapshot]):
    """Fetches all CMR menus in parallel on every update."""

    config_entry: CmrConfigEntry

    def __init__(self, hass: HomeAssistant, entry: CmrConfigEntry, api: CmrApi) -> None:
        super().__init__(
            hass,
            _LOGGER,
            config_entry=entry,
            name=DOMAIN,
            update_interval=timedelta(
                seconds=entry.options.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL)
            ),
        )
        self.api = api
        # The upgrade controls are entities, so this option only takes effect
        # on a reload; remembered to tell that change from the live ones.
        self.allow_upgrades = bool(entry.options.get(CONF_ALLOW_UPGRADES))
        # Repair issue ids currently open for devices waiting to be paired.
        self.pairing_issues: set[str] = set()
        # Last raw responses, kept for diagnostics and as a fallback when an
        # optional menu fails transiently.
        self.raw: dict[str, Any] = {}
        self.last_poll: datetime | None = None
        # The router platform's vendor name, as the controller reports it.
        self.platform: str | None = None
        self._platform_read = False
        self.eventlog: CmrEventLog | None = None
        self.catalog: ProductCatalog | None = None
        self._missing: set[str] = set()
        # None until tried; False if the user may not run console commands.
        self._console_ok: bool | None = None
        # Rule id -> (when read, device keys it is active on); see async_alert_devices.
        self._alert_devices: dict[str, tuple[datetime, list[str]]] = {}

    @property
    def console_ok(self) -> bool:
        """Console commands work for this user (assumed until one is refused)."""
        return self._console_ok is not False

    async def async_alert_devices(self, rule_id: str) -> list[str] | None:
        """Keys of the devices on which a state alert is active right now.

        An event alert is never active anywhere, so it needs no lookup. The
        lookup runs on the console through `/execute`, which gives device ids
        (REST rows carry identities only). Cached for one poll interval: a
        card opening several rules shouldn't hit the controller for each
        click. None when console commands are refused for this user.
        """
        if self._console_ok is False or self.data is None:
            return None
        rule = next((r for r in self.data.alerts.values() if r.rest_id == rule_id), None)
        if rule is None:
            raise ValueError(f"No alert rule {rule_id}")
        if rule.kind == "event":
            return []
        cached = self._alert_devices.get(rule_id)
        if cached and dt_util.utcnow() - cached[0] < (self.update_interval or timedelta(seconds=DEFAULT_SCAN_INTERVAL)):
            return cached[1]
        try:
            result = await self.api.post("execute", {"script": ALERT_DEVICES_SCRIPT.format(rule=rule_id), "as-string": ""})
        except CmrAuthError as err:
            _LOGGER.info("Can't run console commands as this user (%s); alert device lists stay empty", err.detail)
            self._console_ok = False
            return None
        text = result.get("ret", "") if isinstance(result, dict) else ""
        by_rest_id = {device.rest_id: device.key for device in self.data.devices.values()}
        keys = [by_rest_id[line.strip()] for line in text.splitlines() if line.strip() in by_rest_id]
        self._alert_devices[rule_id] = (dt_util.utcnow(), keys)
        return keys

    async def _async_update_data(self) -> CmrSnapshot:
        paths = REQUIRED_PATHS + OPTIONAL_PATHS
        results = await asyncio.gather(
            *(self.api.get(path) for path in paths), return_exceptions=True
        )
        raw: dict[str, Any] = {}
        for path, result in zip(paths, results, strict=True):
            if isinstance(result, CmrAuthError):
                raise ConfigEntryAuthFailed(str(result)) from result
            if isinstance(result, BaseException):
                if path in REQUIRED_PATHS:
                    raise UpdateFailed(f"Reading /{path} failed: {result}") from result
                if isinstance(result, CmrNotFoundError):
                    if path not in self._missing:
                        _LOGGER.info("Controller has no /%s menu; skipping it", path)
                        self._missing.add(path)
                    raw[path] = []
                elif isinstance(result, CmrApiError):
                    _LOGGER.debug("Reading /%s failed, keeping last data: %s", path, result)
                    raw[path] = self.raw.get(path, [])
                else:
                    raise result
                continue
            raw[path] = result
        await self._merge_console_fields(raw)
        if not self._platform_read:
            try:
                resource = await self.api.get("system/resource")
            except CmrApiError as err:
                _LOGGER.debug("Reading /system/resource failed, will retry: %s", err)
            else:
                self._platform_read = True
                self.platform = resource.get("platform") if isinstance(resource, dict) else None
        self.raw = raw
        self.last_poll = dt_util.utcnow()
        snapshot = parse_snapshot(raw)
        if self.catalog is not None:
            # A no-op unless the catalog is a day old or its URL changed.
            await self.catalog.async_refresh(self.config_entry.options.get(CONF_CATALOG_URL))
        if self.eventlog is not None:
            try:
                await self.eventlog.async_process(self.api, self.data, snapshot)
            except Exception:
                # The timeline is a bonus; never fail the poll because of it.
                _LOGGER.exception("Processing controller events failed")
        return snapshot

    async def _merge_console_fields(self, raw: dict[str, Any]) -> None:
        """Fill in the per-device alert counters and the links' detected ports.

        Both are computed on print and missing from REST responses, so they
        are parsed from the console's `print detail` output. A user without
        the policy to run console commands simply goes without them.
        """
        for path, script, parse, field in (
            ("cmr/device", DEVICE_DETAIL_SCRIPT, parse_device_alerts, "alerts"),
            ("cmr/layout/link", LINK_DETAIL_SCRIPT, parse_link_details, "links"),
        ):
            items = raw.get(path)
            if not isinstance(items, list) or not items or self._console_ok is False:
                continue
            try:
                result = await self.api.post("execute", {"script": script, "as-string": ""})
            except CmrApiError as err:
                _LOGGER.info(
                    "Can't run console commands as this user (%s); per-device alert counters "
                    "and cable port details stay empty",
                    err.detail,
                )
                self._console_ok = False
                return
            self._console_ok = True
            values = parse(result.get("ret", "") if isinstance(result, dict) else "")
            for item in items:
                if item.get(".id") in values:
                    item[field] = values[item[".id"]]
