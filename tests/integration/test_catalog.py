"""Product catalog cache: a cache saved by an older version is refetched."""

from __future__ import annotations

import asyncio
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


async def test_matches_are_cached_until_the_catalog_changes(hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch) -> None:
    from custom_components.cmr.models import CmrDevice

    calls = []
    real = catalog.match_product

    def counting(*args: Any) -> dict[str, Any] | None:
        calls.append(args[1:])
        return real(*args)

    monkeypatch.setattr(catalog, "match_product", counting)
    products = ProductCatalog(hass)
    products.products = [OLD]
    devices = [CmrDevice.from_rest({".id": f"*{n}", "identity": f"r{n}", "board": "RB5009"}) for n in range(3)]
    assert all(products.product_for(d)["code"] == OLD["code"] for d in devices)
    assert len(calls) == 1  # one board, matched once
    products.products = [{**OLD, "code": "RB5009UPr+S+OUT", "name": "RB5009 OUT"}]
    assert products.product_for(devices[0])["code"] == "RB5009UPr+S+OUT"
    assert len(calls) == 2


async def test_polls_never_wait_for_the_catalog(
    hass: HomeAssistant, controller, make_entry, monkeypatch: pytest.MonkeyPatch
) -> None:
    """A slow catalog API doesn't hold up setup or polling, and two polls
    (or two controllers) don't fetch it twice."""
    release = asyncio.Event()
    calls: list[str] = []

    async def slow(_session, url: str) -> list[dict[str, Any]]:
        calls.append(url)
        await release.wait()
        return [OLD]

    monkeypatch.setattr(catalog, "async_fetch_products", slow)
    entry = make_entry()
    assert await hass.config_entries.async_setup(entry.entry_id)
    coordinator = entry.runtime_data
    await coordinator.async_refresh()
    assert coordinator.last_update_success
    assert calls == [CATALOG_URL] and coordinator.catalog.products == []
    release.set()
    await hass.async_block_till_done(wait_background_tasks=True)
    assert coordinator.catalog.products == [OLD]
