"""Optional product catalog: photos and names for managed devices.

The catalog URL is an integration option (off when empty). It must return
JSON shaped `{"data": [{"product_code", "product_name", "product_status",
"url", "images": {"small": [...], "large": [...]}}, ...]}`. The list is
fetched at most once a day and shared by all controllers.
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

REFRESH = timedelta(days=1)
STORE_VERSION = 1


class ProductCatalog:
    """Fetches and caches the catalog; one instance per Home Assistant."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, STORE_VERSION, f"{DOMAIN}.catalog")
        self.products: list[dict[str, Any]] = []
        self._url: str | None = None
        self._fetched = None
        self._loaded = False

    async def async_refresh(self, url: str | None) -> None:
        """Load the cache, and refetch when the URL changed or a day passed."""
        if not url:
            return
        if not self._loaded:
            self._loaded = True
            cached = await self._store.async_load() or {}
            if cached.get("url") == url:
                self.products = cached.get("products", [])
                self._url = url
                fetched = cached.get("fetched")
                self._fetched = dt_util.parse_datetime(fetched) if fetched else None
        now = dt_util.utcnow()
        if self._url == url and self._fetched and now - self._fetched < REFRESH:
            return
        try:
            session = async_get_clientsession(self.hass)
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=30)) as resp:
                resp.raise_for_status()
                body = await resp.json(content_type=None)
        except (aiohttp.ClientError, TimeoutError, ValueError) as err:
            _LOGGER.warning("Product catalog unavailable, keeping %d cached products: %s", len(self.products), err)
            self._fetched = now  # don't retry every poll
            return
        items = body.get("data") if isinstance(body, dict) else body
        products = [p for p in (compact_product(i) for i in items or [] if isinstance(i, dict)) if p]
        if not products:
            _LOGGER.warning("Product catalog at %s returned no products", url)
            self._fetched = now
            return
        self.products, self._url, self._fetched = products, url, now
        _LOGGER.debug("Product catalog: %d products", len(products))
        self._store.async_delay_save(
            lambda: {"url": url, "fetched": now.isoformat(), "products": products}, 5
        )

    def product_for(self, device: CmrDevice) -> dict[str, Any] | None:
        if not self.products:
            return None
        return match_product(self.products, device.board, device.model_code)
