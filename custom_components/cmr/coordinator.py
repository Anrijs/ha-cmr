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
from .const import CONF_CATALOG_URL, DEFAULT_SCAN_INTERVAL, DOMAIN
from .models import CmrSnapshot, parse_link_details, parse_snapshot

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

# Console command whose output carries each layout link's detected ports.
LINK_DETAIL_SCRIPT = "/cmr/layout/link/print detail show-ids without-paging"

# (menu, field) pairs that are only returned when requested explicitly.
COMPUTED_FIELDS = (("cmr/device", "alerts"), ("cmr/layout/link", "links"))

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
        # Computed fields the controller turned out not to return over REST.
        self._no_computed: set[tuple[str, str]] = set()
        # None until tried; False if the user may not run console commands.
        self._console_links: bool | None = None

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
        await self._merge_computed(raw)
        await self._merge_link_ports(raw)
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

    async def _merge_link_ports(self, raw: dict[str, Any]) -> None:
        """Fill layout links' detected ports, PoE and traffic from the console.

        The REST API leaves out `links`, but the console prints it; the REST
        API can run a console command and return its text output.
        """
        links = raw.get("cmr/layout/link")
        if (
            not isinstance(links, list)
            or not links
            or all(item.get("links") for item in links)
            or self._console_links is False
        ):
            return
        try:
            result = await self.api.post(
                "execute",
                {"script": LINK_DETAIL_SCRIPT, "as-string": ""},
            )
        except CmrApiError as err:
            _LOGGER.info("Can't read link ports from the console (%s); cables show no port details", err.detail)
            self._console_links = False
            return
        text = result.get("ret", "") if isinstance(result, dict) else ""
        details = parse_link_details(text)
        self._console_links = True
        for item in links:
            if not item.get("links") and item.get(".id") in details:
                item["links"] = details[item[".id"]]

    async def _merge_computed(self, raw: dict[str, Any]) -> None:
        """Add fields REST only returns when asked for by name.

        Per-device alert counters and the detected ports of layout links are
        computed on print, so a plain GET leaves them out.
        """
        for path, field in COMPUTED_FIELDS:
            items = raw.get(path)
            if (
                not isinstance(items, list)
                or not items
                or path in self._missing
                or (path, field) in self._no_computed
            ):
                continue
            try:
                extra = await self.api.post(f"{path}/print", {".proplist": f".id,{field}"})
            except CmrApiError as err:
                _LOGGER.debug("No computed %s for /%s: %s", field, path, err)
                continue
            values = {
                item.get(".id"): item.get(field)
                for item in extra
                if isinstance(item, dict) and item.get(field) not in (None, "")
            }
            if not values:
                _LOGGER.debug("Controller returns no %s for /%s over REST", field, path)
                self._no_computed.add((path, field))
                continue
            for item in items:
                if item.get(".id") in values:
                    item[field] = values[item[".id"]]
