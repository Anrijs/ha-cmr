"""Product catalog: photos, names and port counts for managed devices.

MikroTik's public product API returns JSON shaped `{"data": [{"product_code",
"product_name", "product_status", "url", "images": {"small": [...],
"large": [...]}, "parameters": [...]}, ...]}`. The list is fetched at most once
a day and shared by all controllers.
"""

from __future__ import annotations

from datetime import timedelta
import logging
from typing import Any

import aiohttp

from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import DOMAIN
from .models import CmrDevice, compact_product, match_product

_LOGGER = logging.getLogger(__name__)

# Read-only product specs; the API key is public and carries no rights.
# Without `is_history`/`is_active` the list has only current products, so
# discontinued devices (status "Archived") would get no photo or name.
CATALOG_URL = (
    "https://api.mikrotik.com/parameters"
    "?apiKey=03e64c40-2f1a-44bd-b03f-f2bcf8530d53-976715c0-9518-4e4e-906e-5ad78bfa8fbc"
    "&is_history&is_active"
)
REFRESH = timedelta(days=1)
STORE_VERSION = 1
# Bumped when compact_product() keeps more fields, so an older cache is
# refetched at once (its photos still serve until the fetch succeeds; the
# same goes for a cache from another URL).
CACHE_FORMAT = 2


class CatalogError(Exception):
    """The catalog could not be fetched or decoded."""


async def async_fetch_products(session: aiohttp.ClientSession, url: str) -> list[dict[str, Any]]:
    """Download a catalog and keep the products that have a photo."""
    try:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=30)) as resp:
            resp.raise_for_status()
            body = await resp.json(content_type=None)
    except (aiohttp.ClientError, TimeoutError, ValueError) as err:
        raise CatalogError(str(err) or type(err).__name__) from err
    items = body.get("data") if isinstance(body, dict) else body
    return [p for p in (compact_product(i) for i in items or [] if isinstance(i, dict)) if p]


class ProductCatalog:
    """Fetches and caches the catalog; one instance per Home Assistant."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, STORE_VERSION, f"{DOMAIN}.catalog")
        self.products: list[dict[str, Any]] = []
        self._fetched = None
        self._loaded = False

    async def async_refresh(self) -> None:
        """Load the cache, and refetch when a day passed (or it came from another URL)."""
        url = CATALOG_URL
        if not self._loaded:
            self._loaded = True
            cached = await self._store.async_load() or {}
            self.products = cached.get("products", [])
            fetched = cached.get("fetched")
            fresh = fetched and cached.get("format") == CACHE_FORMAT and cached.get("url") == url
            self._fetched = dt_util.parse_datetime(fetched) if fresh else None
        now = dt_util.utcnow()
        if self._fetched and now - self._fetched < REFRESH:
            return
        try:
            products = await async_fetch_products(async_get_clientsession(self.hass), url)
        except CatalogError as err:
            _LOGGER.warning("Product catalog unavailable, keeping %d cached products: %s", len(self.products), err)
            self._fetched = now  # don't retry every poll
            return
        if not products:
            _LOGGER.warning("Product catalog returned no products")
            self._fetched = now
            return
        self.products, self._fetched = products, now
        _LOGGER.debug("Product catalog: %d products", len(products))
        self._store.async_delay_save(
            lambda: {"url": url, "fetched": now.isoformat(), "format": CACHE_FORMAT, "products": products}, 5
        )

    def product_for(self, device: CmrDevice) -> dict[str, Any] | None:
        if not self.products:
            return None
        return match_product(self.products, device.board, device.model_code)
