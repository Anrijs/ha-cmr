"""Websocket API feeding the bundled dashboard cards.

`cmr/subscribe` streams one structured snapshot per controller
(devices with their Home Assistant entity ids, alert rules, upgrade rules and
jobs, and the topology layouts) and resends it after every poll, so the cards
never need hard-coded entity ids. Layouts and nodes (the bulk on a big fleet)
go to each subscriber only when they changed; `topology_version` tells.
"""

from __future__ import annotations

from dataclasses import asdict
import hashlib
import json
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr, entity_registry as er

from .actions import async_cancel_job, async_job_devices, async_rebuild_links, async_run_next
from .api import CmrApiError, CmrNotFoundError
from .const import DOMAIN
from .coordinator import CmrConfigEntry, CmrCoordinator
from .models import parse_job_devices
from .pairing import async_pair
from .webhook import (
    alert_setup_script,
    async_apply_alert_webhooks,
    async_remove_alert_webhooks,
    entry_webhook_url,
    pushes_to_home_assistant,
)

_DEVICE_ENTITIES = {
    "connected": "binary_sensor",
    "update": "update",
    "uptime": "sensor",
    "version": "sensor",
    "active_alerts": "sensor",
    "alert": "event",
}
_FLEET_ENTITIES = {
    "devices": "sensor",
    "devices_online": "sensor",
    "updates_available": "sensor",
    "alerts_firing": "sensor",
    "last_upgrade_job": "sensor",
    "fleet_alert": "event",
    "network_issues": "sensor",
    "network_trouble": "binary_sensor",
}


@callback
def async_register_websocket(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_subscribe)
    websocket_api.async_register_command(hass, ws_events)
    websocket_api.async_register_command(hass, ws_alert_setup)
    websocket_api.async_register_command(hass, ws_alert_push)
    websocket_api.async_register_command(hass, ws_pair)
    websocket_api.async_register_command(hass, ws_rebuild_links)
    websocket_api.async_register_command(hass, ws_job_devices)
    websocket_api.async_register_command(hass, ws_job_action)
    websocket_api.async_register_command(hass, ws_alert_devices)
    websocket_api.async_register_command(hass, ws_issue_dismiss)


def _loaded_entries(hass: HomeAssistant, entry_id: str | None) -> list[CmrConfigEntry]:
    return [
        entry
        for entry in hass.config_entries.async_entries(DOMAIN)
        if entry.state is ConfigEntryState.LOADED
        and (entry_id is None or entry.entry_id == entry_id)
    ]


# Parts of the snapshot that change only when someone edits a layout. Links
# stay in every message: they carry live traffic counters and PoE state.
_STATIC_TOPOLOGY = ("layouts", "nodes")


def topology_version(topology: dict[str, Any]) -> str:
    """A short hash of the layouts and nodes, to send them only when they changed."""
    return hashlib.sha256(json.dumps(topology, sort_keys=True, default=str).encode()).hexdigest()[:16]


def _acting_coordinator(connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> CmrCoordinator | None:
    """The coordinator a card asks to act on, or None after sending the error."""
    entries = _loaded_entries(connection.hass, msg["entry_id"])
    if not entries:
        connection.send_error(msg["id"], "not_found", "Controller not loaded")
        return None
    coordinator = entries[0].runtime_data
    if not coordinator.allow_upgrades:
        connection.send_error(msg["id"], "not_allowed", "Actions on the controller are not allowed in the options")
        return None
    return coordinator


def serialize_entry(hass: HomeAssistant, entry: CmrConfigEntry) -> dict[str, Any]:
    """Everything the cards need about one controller."""
    coordinator = entry.runtime_data
    snapshot = coordinator.data
    entities = er.async_get(hass)
    devices = dr.async_get(hass)

    def entity_id(platform: str, unique_id: str) -> str | None:
        return entities.async_get_entity_id(platform, DOMAIN, unique_id)

    def device_id(key: str) -> str | None:
        device = devices.async_get_device_by_identifier((DOMAIN, key), entry.entry_id)
        return device.id if device else None

    catalog = coordinator.catalog
    # Each catalog product once per controller; devices name theirs by code.
    products: dict[str, dict[str, Any]] = {}

    matched: dict[str, dict[str, Any] | None] = {}
    for device in snapshot.devices.values():
        product = catalog.product_for(device) if catalog else None
        matched[device.key] = product
        if product:
            products.setdefault(product["code"], {k: v for k, v in product.items() if k != "ambiguous"})

    out_devices = [
        {
            "key": d.key,
            "identity": d.identity,
            "board": d.board,
            "model_code": d.model_code,
            "arch": d.arch,
            "version": d.version,
            "available_version": d.available_version,
            "update_available": d.update_available,
            "channel": d.channel,
            "upgrade_rule": d.upgrade_rule,
            "address": d.address,
            "labels": d.labels,
            "uptime": d.uptime,
            "connected_time": d.connected_time,
            # The controller's own timestamp (its local time), when disconnected.
            "disconnected_since": d.disconnected_since,
            "controller": d.controller,
            "connected": d.connected,
            "pending": d.pending,
            "remote_pending": d.remote_pending,
            "stale": d.stale,
            "alerts": asdict(d.alerts) if d.alerts else None,
            "device_id": device_id(d.key),
            "product": (matched[d.key] or {}).get("code"),
            # Several catalog variants fit: the photo is right, the name a guess.
            "product_ambiguous": bool((matched[d.key] or {}).get("ambiguous")),
            "entities": {
                name: entity_id(platform, f"{d.key}_{name}")
                for name, platform in _DEVICE_ENTITIES.items()
            },
        }
        for d in snapshot.devices.values()
    ]
    controller_key = entry.unique_id or ""
    out_alerts = [
        {
            "id": rule.rest_id,
            "name": rule.name,
            "comment": rule.comment,
            "severity": rule.severity,
            "categories": rule.categories,
            "labels": rule.labels,
            "devices": rule.devices,
            "devices_on": rule.devices_on,
            "fired": rule.fired,
            # state: stays active while it matches; event: fires per occurrence, never active.
            "kind": rule.kind,
            # system: about the controller as a whole (a finished upgrade job), not a device.
            "scope": rule.scope,
            "disabled": rule.disabled,
            "webhook": rule.webhook_url is not None,
            "webhook_ha": pushes_to_home_assistant(rule.webhook_url, entry.data["webhook_id"]),
            "entity_id": entity_id("binary_sensor", f"{controller_key}_alert_{rule.rest_id}"),
        }
        for rule in snapshot.alerts.values()
    ]
    nodes = []
    for node in snapshot.nodes:
        device = snapshot.device_by_identity(node.device_identity)
        nodes.append(
            {
                "id": node.rest_id,
                "name": node.name,
                "layout": node.layout,
                "x": node.x,
                "y": node.y,
                "target_layout": node.target_layout,
                "device_key": device.key if device else None,
            }
        )
    return {
        "entry_id": entry.entry_id,
        "title": entry.title,
        "controller_url": coordinator.api.base_url,
        "last_update": coordinator.last_poll.isoformat() if coordinator.last_poll else None,
        "available": coordinator.last_update_success,
        # Whether Home Assistant may act on the controller (pair, upgrade).
        "actions": coordinator.allow_upgrades,
        # Console commands work for the REST user (per-rule device lists need them).
        "console": coordinator.console_ok,
        "fleet_entities": {
            name: entity_id(platform, f"{controller_key}_{name}")
            for name, platform in _FLEET_ENTITIES.items()
        },
        "devices": out_devices,
        "products": products,
        "alerts": out_alerts,
        "upgrade_rules": [
            {k.replace("-", "_"): v for k, v in rule.items() if not k.startswith(".")}
            for rule in snapshot.upgrade_rules
        ],
        "upgrade_jobs": [
            {"id": job.get(".id"), **{k.replace("-", "_"): v for k, v in job.items() if not k.startswith(".")}}
            for job in snapshot.upgrade_jobs
        ],
        "layouts": [{"name": layout.name, "comment": layout.comment} for layout in snapshot.layouts],
        "nodes": nodes,
        "links": [
            {
                "id": link.rest_id,
                "layout": link.layout,
                "node1": link.node1,
                "node2": link.node2,
                "comment": link.comment,
                "ports": [asdict(port) for port in link.ports],
            }
            for link in snapshot.links
        ],
    }


@websocket_api.websocket_command(
    {vol.Required("type"): "cmr/subscribe", vol.Optional("entry_id"): str}
)
@callback
def ws_subscribe(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Send the snapshot now and after every poll."""
    entry_id = msg.get("entry_id")
    msg_id = msg["id"]
    # Topology version each controller's layouts and nodes were last sent at.
    sent: dict[str, str] = {}

    @callback
    def send() -> None:
        entries = []
        for entry in _loaded_entries(hass, entry_id):
            data = serialize_entry(hass, entry)
            topology = {key: data.pop(key) for key in _STATIC_TOPOLOGY}
            data["topology_version"] = version = topology_version(topology)
            if sent.get(entry.entry_id) != version:
                data.update(topology)
                sent[entry.entry_id] = version
            entries.append(data)
        connection.send_message(websocket_api.event_message(msg_id, {"entries": entries}))

    unsubscribers = [
        entry.runtime_data.async_add_listener(send)
        for entry in _loaded_entries(hass, entry_id)
    ]
    connection.subscriptions[msg_id] = lambda: [unsub() for unsub in unsubscribers]
    connection.send_result(msg_id)
    send()


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): "cmr/alert_setup", vol.Required("entry_id"): str}
)
@callback
def ws_alert_setup(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Webhook URL and the controller script that connects alert rules to it."""
    entries = _loaded_entries(hass, msg["entry_id"])
    if not entries:
        connection.send_error(msg["id"], "not_found", "Controller not loaded")
        return
    entry = entries[0]
    url = entry_webhook_url(hass, entry)
    base = url.rsplit("/api/webhook/", 1)[0]
    connection.send_result(
        msg["id"],
        {"url": url, "script": alert_setup_script(base, entry.data["webhook_id"])},
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): "cmr/alert_push", vol.Required("entry_id"): str, vol.Required("enable"): bool}
)
@websocket_api.async_response
async def ws_alert_push(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Make every alert rule push to Home Assistant's webhook, or stop them."""
    entries = _loaded_entries(hass, msg["entry_id"])
    if not entries:
        connection.send_error(msg["id"], "not_found", "Controller not loaded")
        return
    entry = entries[0]
    coordinator = entry.runtime_data
    if not coordinator.allow_upgrades:
        connection.send_error(msg["id"], "not_allowed", "Actions on the controller are not allowed in the options")
        return
    webhook_id = entry.data["webhook_id"]
    if msg["enable"]:
        url = entry_webhook_url(hass, entry)
        base = url.rsplit("/api/webhook/", 1)[0]
        done, failures = await async_apply_alert_webhooks(coordinator.api, coordinator.data, base, webhook_id)
    else:
        done, failures = await async_remove_alert_webhooks(coordinator.api, coordinator.data, webhook_id)
    await coordinator.async_request_refresh()
    connection.send_result(msg["id"], {"done": done, "failures": failures})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "cmr/pair",
        vol.Required("entry_id"): str,
        vol.Required("device_key"): str,
        vol.Optional("username"): str,
        vol.Optional("password"): str,
    }
)
@websocket_api.async_response
async def ws_pair(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Approve a device's pairing (the Approve button on the cards)."""
    entries = _loaded_entries(hass, msg["entry_id"])
    if not entries:
        connection.send_error(msg["id"], "not_found", "Controller not loaded")
        return
    coordinator = entries[0].runtime_data
    if not coordinator.allow_upgrades:
        connection.send_error(msg["id"], "not_allowed", "Actions on the controller are not allowed in the options")
        return
    device = coordinator.data.devices.get(msg["device_key"])
    if device is None or not device.pending:
        connection.send_error(msg["id"], "not_pending", "This device is not waiting for approval on the controller")
        return
    try:
        await async_pair(coordinator.api, device, msg.get("username"), msg.get("password"))
    except CmrApiError as err:
        connection.send_error(msg["id"], "pair_failed", err.detail)
        return
    connection.send_result(msg["id"], {"device_key": device.key})
    await coordinator.async_request_refresh()


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): "cmr/rebuild_links", vol.Required("entry_id"): str, vol.Required("layout"): str}
)
@websocket_api.async_response
async def ws_rebuild_links(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Generate a layout's links from detected ports (the map's Rebuild links button)."""
    coordinator = _acting_coordinator(connection, msg)
    if coordinator is None:
        return
    layout = next((item for item in coordinator.data.layouts if item.name == msg["layout"]), None)
    if layout is None:
        connection.send_error(msg["id"], "no_layout", f"No layout named {msg['layout']}")
        return
    try:
        await async_rebuild_links(coordinator.api, layout.rest_id)
    except CmrApiError as err:
        connection.send_error(msg["id"], "rebuild_failed", err.detail)
        return
    connection.send_result(msg["id"], {"layout": layout.name})
    await coordinator.async_request_refresh()


@websocket_api.websocket_command(
    {vol.Required("type"): "cmr/job_devices", vol.Required("entry_id"): str, vol.Required("job_id"): str}
)
@websocket_api.async_response
async def ws_job_devices(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """An upgrade job's devices with CMR's state and reason for each (read-only)."""
    entries = _loaded_entries(hass, msg["entry_id"])
    if not entries:
        connection.send_error(msg["id"], "not_found", "Controller not loaded")
        return
    coordinator = entries[0].runtime_data
    if not any(job.get(".id") == msg["job_id"] for job in coordinator.data.upgrade_jobs):
        connection.send_error(msg["id"], "no_job", "No such upgrade job")
        return
    try:
        rows = await async_job_devices(coordinator.api, msg["job_id"])
    except CmrApiError as err:
        # Builds without show-devices answer "no such command" or reject the argument.
        unsupported = isinstance(err, CmrNotFoundError) or "unknown parameter" in err.detail
        connection.send_error(msg["id"], "unsupported" if unsupported else "failed", err.detail)
        return
    connection.send_result(msg["id"], {"devices": [asdict(row) for row in parse_job_devices(rows, coordinator.data)]})


# Job states in which a job can still be cancelled (removed).
_CANCELLABLE = {"scheduled", "queued", "queued (busy)", "waiting devices", "version check", "processing"}


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "cmr/job_action",
        vol.Required("entry_id"): str,
        vol.Required("job_id"): str,
        vol.Required("action"): vol.In(["cancel", "run_next"]),
    }
)
@websocket_api.async_response
async def ws_job_action(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Cancel an upgrade job, or run a scheduled one now (the upgrades card)."""
    coordinator = _acting_coordinator(connection, msg)
    if coordinator is None:
        return
    job = next((job for job in coordinator.data.upgrade_jobs if job.get(".id") == msg["job_id"]), None)
    state = (job or {}).get("state") or "scheduled"
    allowed = state == "scheduled" if msg["action"] == "run_next" else state in _CANCELLABLE
    if job is None or not allowed:
        connection.send_error(msg["id"], "not_allowed_now", f"Not possible for a job that is {state}")
        return
    try:
        if msg["action"] == "cancel":
            await async_cancel_job(coordinator.api, msg["job_id"])
        else:
            await async_run_next(coordinator.api, msg["job_id"])
    except CmrApiError as err:
        connection.send_error(msg["id"], "job_action_failed", err.detail)
        return
    connection.send_result(msg["id"], {"job_id": msg["job_id"], "action": msg["action"]})
    await coordinator.async_request_refresh()


@websocket_api.websocket_command(
    {vol.Required("type"): "cmr/alert_devices", vol.Required("entry_id"): str, vol.Required("rule_id"): str}
)
@websocket_api.async_response
async def ws_alert_devices(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Keys of the devices an alert rule's state alert is active on (read-only; needs the console)."""
    entries = _loaded_entries(hass, msg["entry_id"])
    if not entries:
        connection.send_error(msg["id"], "not_found", "Controller not loaded")
        return
    coordinator = entries[0].runtime_data
    try:
        keys = await coordinator.async_alert_devices(msg["rule_id"])
    except ValueError as err:
        connection.send_error(msg["id"], "not_found", str(err))
        return
    except CmrApiError as err:
        connection.send_error(msg["id"], "failed", err.detail or str(err))
        return
    if keys is None:
        connection.send_error(msg["id"], "unsupported", "This user may not run console commands on the controller")
        return
    connection.send_result(msg["id"], {"devices": keys})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): "cmr/issue_dismiss", vol.Required("entry_id"): str, vol.Required("key"): str}
)
@callback
def ws_issue_dismiss(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Clear a detected issue by hand (it comes back only on new occurrences)."""
    entries = _loaded_entries(hass, msg["entry_id"])
    log = entries[0].runtime_data.eventlog if entries else None
    if log is None:
        connection.send_error(msg["id"], "not_found", "Controller not loaded")
        return
    if not log.dismiss_issue(msg["key"]):
        connection.send_error(msg["id"], "not_found", "No such active issue")
        return
    connection.send_result(msg["id"], {"key": msg["key"]})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "cmr/events/subscribe",
        vol.Optional("entry_id"): str,
        vol.Optional("limit", default=300): vol.All(int, vol.Range(min=1, max=1000)),
    }
)
@callback
def ws_events(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Recent timeline events and active issues, then new ones as they happen."""
    entries = _loaded_entries(hass, msg.get("entry_id"))
    msg_id = msg["id"]
    logs = [entry.runtime_data.eventlog for entry in entries if entry.runtime_data.eventlog]

    def issues() -> list[dict[str, Any]]:
        return [issue for log in logs for issue in log.insight_list()]

    @callback
    def push(events: list[dict[str, Any]]) -> None:
        connection.send_message(
            websocket_api.event_message(msg_id, {"events": events, "issues": issues()})
        )

    unsubscribers = [log.async_subscribe(push) for log in logs]
    connection.subscriptions[msg_id] = lambda: [unsub() for unsub in unsubscribers]
    connection.send_result(msg_id)
    recent = sorted(
        (event for log in logs for event in log.events), key=lambda event: event["time"]
    )[-msg["limit"]:]
    connection.send_message(
        websocket_api.event_message(msg_id, {"events": recent, "issues": issues(), "reset": True})
    )
