"""Serves the bundled dashboard cards and strategy, loaded on every page."""

from __future__ import annotations

from pathlib import Path

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import DOMAIN, FRONTEND_SCRIPT, FRONTEND_URL

_FRONTEND_DIR = Path(__file__).parent / "www"


async def async_register_frontend(hass: HomeAssistant) -> None:
    """Expose www/ and load the cards as an extra module."""
    if hass.data.get(f"{DOMAIN}_frontend"):
        return
    hass.data[f"{DOMAIN}_frontend"] = True
    await hass.http.async_register_static_paths(
        # Cacheable: the script URL carries the file's mtime, so a new build gets a new URL.
        [StaticPathConfig(FRONTEND_URL, str(_FRONTEND_DIR), cache_headers=True)]
    )
    script = _FRONTEND_DIR / FRONTEND_SCRIPT
    # The file's mtime busts browser caches after an update.
    version = await hass.async_add_executor_job(lambda: int(script.stat().st_mtime))
    add_extra_js_url(hass, f"{FRONTEND_URL}/{FRONTEND_SCRIPT}?v={version}")
