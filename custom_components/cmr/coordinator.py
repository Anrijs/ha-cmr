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
