"""Product catalog cache: a cache saved by an older version is refetched."""

from __future__ import annotations

from typing import Any

import pytest

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.cmr import catalog
from custom_components.cmr.catalog import CACHE_FORMAT, CATALOG_URL, ProductCatalog

OLD = {"code": "RB5009UPr+S+IN", "name": "RB5009", "image": "s.png", "image_large": "l.png"}


def _cache(**extra: Any) -> dict[str, Any]:
    data = {"url": CATALOG_URL, "fetched": dt_util.utcnow().isoformat(), "products": [OLD], **extra}
    return {"version": 1, "minor_version": 1, "key": "cmr.catalog", "data": data}


@pytest.mark.parametrize(("cached", "fetches"), [(_cache(), 1), (_cache(format=CACHE_FORMAT), 0)])
async def test_cache_format(
    hass: HomeAssistant, hass_storage: dict[str, Any], monkeypatch: pytest.MonkeyPatch, cached, fetches
) -> None:
    hass_storage["cmr.catalog"] = cached
    calls: list[str] = []

    async def fetch(_session, url: str) -> list[dict[str, Any]]:
        calls.append(url)
        return [{**OLD, "ports": {"ether": [["1G", 7]], "mgmt": 0, "cages": [], "poe_out": []}}]

    monkeypatch.setattr(catalog, "async_fetch_products", fetch)
    products = ProductCatalog(hass)
    await products.async_refresh()
    assert len(calls) == fetches
    # A cache in the current format and less than a day old is used as it is.
    assert ("ports" in products.products[0]) == bool(fetches)


async def test_cache_from_another_url_serves_until_refetched(
    hass: HomeAssistant, hass_storage: dict[str, Any], monkeypatch: pytest.MonkeyPatch
) -> None:
    """A new catalog URL (e.g. one that adds discontinued products) refetches at
    once, and the old photos keep serving if that fetch fails."""
    hass_storage["cmr.catalog"] = _cache(url="https://api.example.invalid/old", format=CACHE_FORMAT)
    calls: list[str] = []

    async def failing(_session, url: str) -> list[dict[str, Any]]:
        calls.append(url)
        raise catalog.CatalogError("offline")

    monkeypatch.setattr(catalog, "async_fetch_products", failing)
    products = ProductCatalog(hass)
    await products.async_refresh()
    assert calls == [CATALOG_URL]
    assert products.products == [OLD]
