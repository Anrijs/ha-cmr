"""Describe CMR events for Home Assistant's activity log."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from homeassistant.components.logbook import (
    LOGBOOK_ENTRY_MESSAGE,
    LOGBOOK_ENTRY_NAME,
)
from homeassistant.core import Event, HomeAssistant, callback

from .const import DOMAIN, EVENT_CMR, EVENT_ISSUE


@callback
def async_describe_events(
    hass: HomeAssistant,
    async_describe_event: Callable[[str, str, Callable[[Event], dict[str, Any]]], None],
) -> None:
    @callback
    def describe_event(event: Event) -> dict[str, Any]:
        data = event.data
        title = str(data.get("title") or "")
        return {
            LOGBOOK_ENTRY_NAME: data.get("device_name") or "CMR",
            # The logbook prefixes the name; keep the message lower-case-first.
            LOGBOOK_ENTRY_MESSAGE: title[:1].lower() + title[1:] if title else data.get("category", ""),
        }

    @callback
    def describe_issue(event: Event) -> dict[str, Any]:
        data = event.data
        verb = "detected" if data.get("action") == "raised" else "resolved"
        return {
            LOGBOOK_ENTRY_NAME: "Network issue",
            LOGBOOK_ENTRY_MESSAGE: f"{verb}: {data.get('title')}",
        }

    async_describe_event(DOMAIN, EVENT_CMR, describe_event)
    async_describe_event(DOMAIN, EVENT_ISSUE, describe_issue)
