"""Receives alerts the CMR controller pushes through `action.http-url`."""

from __future__ import annotations

import json
import logging
import re
from typing import Any

from aiohttp import web

from homeassistant.components import webhook
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.network import NoURLAvailableError, get_url

from .const import (
    CONF_WEBHOOK_BASE_URL,
    CONF_WEBHOOK_ID,
    DOMAIN,
    EVENT_ALERT,
    SEVERITIES,
    SIGNAL_ALERT,
)
from .coordinator import CmrConfigEntry

_LOGGER = logging.getLogger(__name__)

# JSON fields the generated alert script sends; values are the controller's alert
# placeholders, substituted per device by the controller.
_BODY_FIELDS = {
    "device": "[identity]",
    "serial": "[serial]",
    "address": "[address]",
    "version": "[version]",
    "upgrade_version": "[upgrade-version]",
    "message": "[message]",
}
_PAIR = re.compile(r'"([\w-]+)"\s*:\s*"((?:[^"\\]|\\.)*)"')


def default_base_url(hass: HomeAssistant) -> str | None:
    """Home Assistant's local URL, as the controller should call it."""
    try:
        return get_url(hass, allow_external=False, allow_cloud=False)
    except NoURLAvailableError:
        return None


def webhook_url(base_url: str | None, webhook_id: str) -> str:
    base = (base_url or "http://homeassistant.local:8123").rstrip("/")
    return f"{base}/api/webhook/{webhook_id}"


def alert_setup_script(base_url: str | None, webhook_id: str) -> str:
    """Controller script that points every CMR alert rule at this webhook.

    The rule's own name and severity are baked into each body, since the
    controller has no placeholder for them.
    """
    fields = "".join(
        f',\\"{key}\\":\\"{placeholder}\\"' for key, placeholder in _BODY_FIELDS.items()
    )
    body = (
        '("{\\"alert\\":\\"" . $n . "\\",\\"severity\\":\\"" . $s . "\\"'
        f'{fields}}}")'
    )
    return (
        ":foreach a in=[/cmr/alert find] do={\n"
        "  :local n [/cmr/alert get $a name]\n"
        "  :local s [/cmr/alert get $a severity]\n"
        f'  /cmr/alert set $a action.http-url="{webhook_url(base_url, webhook_id)}" '
        'action.http-method=post action.http-headers="Content-Type: application/json" '
        f"action.http-body={body}\n"
        "}"
    )


def parse_payload(text: str) -> dict[str, Any]:
    """Decode an alert body, tolerating JSON broken by unescaped quotes."""
    text = text.strip()
    if not text:
        return {}
    try:
        decoded = json.loads(text)
    except ValueError:
        pairs = dict(_PAIR.findall(text))
        return pairs or {"message": text}
    return decoded if isinstance(decoded, dict) else {"message": decoded}


def normalize_alert(payload: dict[str, Any]) -> dict[str, Any]:
    """Map a pushed alert to the event schema; inapplicable values become None."""

    def value(key: str) -> str | None:
        raw = payload.get(key)
        if raw in (None, "", "unknown"):
            return None
        return str(raw)

    severity = (value("severity") or "medium").lower()
    return {
        "alert": value("alert") or "alert",
        "severity": severity if severity in SEVERITIES else "medium",
        "device": value("device") or value("identity"),
        "serial": value("serial"),
        "address": value("address"),
        "version": value("version"),
        "upgrade_version": value("upgrade_version"),
        "message": value("message"),
    }


@callback
def async_register_webhook(hass: HomeAssistant, entry: CmrConfigEntry) -> None:
    """Register the entry's webhook; unregistered again on unload."""
    webhook_id = entry.data[CONF_WEBHOOK_ID]

    async def handle(hass: HomeAssistant, _id: str, request: web.Request) -> web.Response:
        payload = parse_payload(await request.text()) or dict(request.query)
        alert = normalize_alert(payload)
        coordinator = entry.runtime_data
        device = None
        if coordinator.data:
            snapshot = coordinator.data
            device = snapshot.devices.get(alert["serial"] or "") or snapshot.device_by_identity(
                alert["device"]
            )
        alert["device_key"] = device.key if device else None
        _LOGGER.debug("Alert from controller: %s", alert)
        hass.bus.async_fire(EVENT_ALERT, {**alert, "entry_id": entry.entry_id})
        if coordinator.eventlog is not None:
            coordinator.eventlog.add_pushed_alert(alert)
        async_dispatcher_send(hass, SIGNAL_ALERT.format(entry.entry_id), alert)
        await coordinator.async_request_refresh()
        return web.Response(status=200, text="ok")

    webhook.async_register(
        hass,
        DOMAIN,
        f"CMR alerts ({entry.title})",
        webhook_id,
        handle,
        allowed_methods=("POST", "PUT", "GET"),
        local_only=True,
    )
    entry.async_on_unload(lambda: webhook.async_unregister(hass, webhook_id))


def entry_webhook_url(hass: HomeAssistant, entry: CmrConfigEntry) -> str:
    base = entry.options.get(CONF_WEBHOOK_BASE_URL) or default_base_url(hass)
    return webhook_url(base, entry.data[CONF_WEBHOOK_ID])
