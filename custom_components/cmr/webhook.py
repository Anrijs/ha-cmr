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
from .logparse import find_device
from .models import CmrAlertRule, CmrSnapshot, to_int

_LOGGER = logging.getLogger(__name__)

# JSON fields the generated alert script sends; values are the controller's alert
# placeholders, substituted per device by the controller (verified on 7.26beta1,
# 2026-10-06). One that doesn't apply to the rule arrives as `unknown`, one
# without a value as `(empty)`. The body also carries the rule's `.id`, baked in
# when the action is set: a renamed rule still maps, and the alert's Test, which
# sends `[placeholder]` for every value, can still name its rule.
_BODY_FIELDS = {
    "alert": "[alert-name]",
    "severity": "[severity]",
    "category": "[category]",
    "device": "[identity]",
    "serial": "[serial]",
    "address": "[address]",
    "version": "[version]",
    "available_version": "[available-version]",
    "upgrade_version": "[upgrade-version]",
    "upgrade_state": "[upgrade-state]",
    "upgrade_error": "[upgrade-error]",
    "iface": "[iface-name]",
    "iface_change": "[iface-change]",
    "job_devices": "[job-device-count]",
    "job_upgraded": "[job-success-count]",
    "job_run_time": "[job-run-time]",
    "message": "[message]",
}
# What the controller's alert Test sends in place of every placeholder.
TEST_VALUE = "[placeholder]"
_IFACE_CHANGES = {"running": "link up", "not-running": "link down", "added": "added", "removed": "removed"}
# Body fields passed through as they are (None when they don't apply).
_EVENT_FIELDS = (
    "available_version", "upgrade_version", "upgrade_state", "upgrade_error",
    "iface", "iface_change", "job_devices", "job_upgraded", "job_run_time",
)
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

    Each body carries the rule's own `.id` (see `_BODY_FIELDS`).
    """
    fields = "".join(
        f',\\"{key}\\":\\"{placeholder}\\"' for key, placeholder in _BODY_FIELDS.items()
    )
    body = f'("{{\\"rule_id\\":\\"" . $a . "\\"{fields}}}")'
    return (
        ":foreach a in=[/cmr/alert find] do={\n"
        f'  /cmr/alert set $a action.http-url="{webhook_url(base_url, webhook_id)}" '
        'action.http-method=post action.http-headers="Content-Type: application/json" '
        f"action.http-body={body}\n"
        "}"
    )


_HTTP_FIELDS = ("action.http-url", "action.http-method", "action.http-headers", "action.http-body")


def alert_http_action(base_url: str | None, webhook_id: str, rule_id: str) -> dict[str, str]:
    """The HTTP action fields that make one alert rule push to Home Assistant.

    Same payload as the console script, built here as plain REST values.
    """
    body = {"rule_id": rule_id, **_BODY_FIELDS}
    return {
        "action.http-url": webhook_url(base_url, webhook_id),
        "action.http-method": "post",
        "action.http-headers": "Content-Type: application/json",
        "action.http-body": json.dumps(body, separators=(",", ":")),
    }


def pushes_to_home_assistant(http_url: str | None, webhook_id: str) -> bool:
    return bool(http_url) and webhook_id in str(http_url)


async def async_apply_alert_webhooks(
    api: Any, snapshot: Any, base_url: str | None, webhook_id: str
) -> tuple[int, list[str]]:
    """Point every alert rule's HTTP action at this webhook. Returns (set, failures)."""
    done = 0
    failures: list[str] = []
    for rule in snapshot.alerts.values():
        try:
            await api.patch(f"cmr/alert/{rule.rest_id}", alert_http_action(base_url, webhook_id, rule.rest_id))
        except Exception as err:  # noqa: BLE001 - reported per rule, the rest continue
            failures.append(f"{rule.name}: {getattr(err, 'detail', err)}")
        else:
            done += 1
    return done, failures


async def async_remove_alert_webhooks(api: Any, snapshot: Any, webhook_id: str) -> tuple[int, list[str]]:
    """Clear the HTTP action of the rules that push to this webhook; other webhooks stay."""
    done = 0
    failures: list[str] = []
    for rule in snapshot.alerts.values():
        if not pushes_to_home_assistant(rule.webhook_url, webhook_id):
            continue
        try:
            for field in _HTTP_FIELDS:
                await api.post("cmr/alert/unset", {"numbers": rule.rest_id, "value-name": field})
        except Exception as err:  # noqa: BLE001
            failures.append(f"{rule.name}: {getattr(err, 'detail', err)}")
        else:
            done += 1
    return done, failures


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


def pushed_rule(snapshot: CmrSnapshot, alert: dict[str, Any]) -> CmrAlertRule | None:
    """The rule an alert came from: by the `.id` in its body, else by name."""
    rules = snapshot.alerts.values()
    return next((r for r in rules if alert.get("rule_id") and r.rest_id == alert["rule_id"]), None) or next(
        (r for r in rules if r.name == alert.get("alert")), None
    )


def alert_summary(alert: dict[str, Any]) -> str | None:
    """A line for alerts that carry no log message: upgrades, jobs, interfaces."""
    if alert.get("upgrade_error"):
        return f"Upgrade failed: {alert['upgrade_error']}"
    if alert.get("upgrade_state") == "done":
        return f"Upgraded to {alert['upgrade_version']}" if alert.get("upgrade_version") else "Upgrade done"
    if alert.get("job_devices"):
        text = f"{alert.get('job_upgraded') or 0} of {alert['job_devices']} devices upgraded"
        seconds = to_int(alert.get("job_run_time"))
        if seconds is not None:
            minutes, seconds = divmod(seconds, 60)
            text += f" in {minutes} min {seconds} s" if minutes else f" in {seconds} s"
        return text
    if alert.get("iface") and alert.get("iface_change"):
        return f"{alert['iface']} {_IFACE_CHANGES.get(alert['iface_change'], alert['iface_change'])}"
    return None


def normalize_alert(payload: dict[str, Any]) -> dict[str, Any]:
    """Map a pushed alert to the event schema; inapplicable values become None.

    `test` marks the alert's Test action, which sends `[placeholder]` instead of
    every value. `rule`/`rule_severity` are read from bodies set before 0.12.
    """

    def value(key: str) -> str | None:
        raw = payload.get(key)
        if raw in (None, "", "unknown", "(empty)"):
            return None
        text = str(raw)
        # A controller that doesn't know a placeholder sends it back verbatim.
        return None if text.startswith("[") and text.endswith("]") else text

    severity = (value("severity") or value("rule_severity") or "medium").lower()
    category = value("category")
    alert: dict[str, Any] = {
        "alert": value("alert") or value("rule") or "alert",
        "rule_id": value("rule_id"),
        "severity": severity if severity in SEVERITIES else "medium",
        "category": category.split(",")[0].strip() if category else None,
        "device": value("device") or value("identity"),
        "serial": value("serial"),
        "address": value("address"),
        "version": value("version"),
        **{key: value(key) for key in _EVENT_FIELDS},
        "message": value("message"),
        "test": any(str(v) == TEST_VALUE for v in payload.values()),
    }
    alert["message"] = alert["message"] or alert_summary(alert)
    return alert


@callback
def async_register_webhook(hass: HomeAssistant, entry: CmrConfigEntry) -> None:
    """Register the entry's webhook; unregistered again on unload."""
    webhook_id = entry.data[CONF_WEBHOOK_ID]

    async def handle(hass: HomeAssistant, _id: str, request: web.Request) -> web.Response:
        payload = parse_payload(await request.text()) or dict(request.query)
        alert = normalize_alert(payload)
        coordinator = entry.runtime_data
        device = None
        rule = pushed_rule(coordinator.data, alert) if coordinator.data else None
        if rule is not None and alert["alert"] == "alert":
            alert["alert"] = rule.name  # the name placeholder didn't come through
        if alert["test"]:
            # The alert's Test: proof that the controller reaches us, not an alert.
            _LOGGER.debug("Test push from alert rule %s", alert["alert"])
            if coordinator.eventlog is not None:
                coordinator.eventlog.add_test_push(alert)
            return web.Response(status=200, text="ok")
        del alert["test"]
        if coordinator.data:
            snapshot = coordinator.data
            device = snapshot.devices.get(alert["serial"] or "") or snapshot.device_by_identity(
                alert["device"]
            )
            if device is None and not (rule and rule.scope == "system"):
                # No usable placeholders: the device may still be named in the text.
                text = " ".join(alert.get(k) or "" for k in ("device", "address", "message"))
                device = snapshot.devices.get(find_device(text, snapshot.named_devices()) or "")
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
