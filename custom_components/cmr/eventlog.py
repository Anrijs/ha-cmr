"""Event timeline and trouble detection for one controller.

Sources, all generic:
- the controller's log (`/log`), read incrementally and classified by the
  standard router message formats (logparse.py);
- changes between polls: devices going offline/online, reboots, upgrades,
  new or removed devices, alert rules firing, upgrade jobs;
- alerts the controller pushes to the webhook.

Patterns across events become insights (insights.py), shown as Repairs, a
sensor, and `cmr_issue` events. Notable events are also fired as
`cmr_event`, so they appear in Home Assistant's activity log.
"""

from __future__ import annotations

from collections import deque
from collections.abc import Callable
from datetime import UTC, datetime, timedelta
import itertools
import logging
from typing import TYPE_CHECKING, Any

from homeassistant.const import CONF_USERNAME
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr, issue_registry as ir
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .api import CmrApi, CmrApiError
from .changes import ALERT_SEVERITY, diff_snapshots
from .const import CONF_ACTIVITY_LOG, DOMAIN, EVENT_CMR, EVENT_ISSUE
from .insights import RULES, Insight, InsightEngine, describe
from .logparse import (
    SEVERITIES,
    classify,
    find_identity,
    gmt_offset_seconds,
    log_id_value,
    parse_router_time,
)
from .models import CmrSnapshot, split_list

if TYPE_CHECKING:
    from .coordinator import CmrConfigEntry

_LOGGER = logging.getLogger(__name__)

STORE_VERSION = 1
MAX_EVENTS = 1000
# Categories always worth a line in Home Assistant's activity log.
NOTABLE_CATEGORIES = {"device", "upgrade", "alert", "security", "config", "insight"}
CLOCK_REFRESH = timedelta(minutes=10)

type Listener = Callable[[list[dict[str, Any]]], None]


class CmrEventLog:
    """Timeline, insights and their side effects for one config entry."""

    def __init__(self, hass: HomeAssistant, entry: CmrConfigEntry) -> None:
        self.hass = hass
        self.entry = entry
        self._store: Store[dict[str, Any]] = Store(hass, STORE_VERSION, f"{DOMAIN}.{entry.entry_id}.events")
        self.events: deque[dict[str, Any]] = deque(maxlen=MAX_EVENTS)
        self.engine = InsightEngine()
        self.last_log_id: str | None = None
        self._mac_hosts: dict[str, str] = {}
        self._listeners: set[Listener] = set()
        self._seq = itertools.count()
        self._controller_uptime: int | None = None
        self._offline_since: dict[str, datetime] = {}
        self._gmt_offset: int | None = None
        self._clock_read: datetime | None = None
        # Whether the controller filters `/log` by id itself; None until checked.
        self._query_ok: bool | None = None
        # The snapshot being processed (the coordinator's is set only afterwards).
        self._snapshot: CmrSnapshot | None = None

    # ---------------------------------------------------------- lifecycle

    async def async_load(self) -> None:
        data = await self._store.async_load() or {}
        self.events.extend(data.get("events", []))
        self.engine = InsightEngine(data.get("engine"))
        self.last_log_id = data.get("last_log_id")
        self._mac_hosts = data.get("mac_hosts", {})
        # Repairs aren't kept across restarts; show the still-active ones again.
        for insight in self.engine.active.values():
            self._repair(insight, active=True)

    @callback
    def async_unload(self) -> None:
        for insight in self.engine.active.values():
            ir.async_delete_issue(self.hass, DOMAIN, self._issue_id(insight))

    def _save(self) -> None:
        self._store.async_delay_save(
            lambda: {
                "events": list(self.events),
                "engine": self.engine.as_dict(),
                "last_log_id": self.last_log_id,
                "mac_hosts": self._mac_hosts,
            },
            30,
        )

    @callback
    def async_subscribe(self, listener: Listener) -> Callable[[], None]:
        self._listeners.add(listener)
        return lambda: self._listeners.discard(listener)

    # ------------------------------------------------------------ polling

    async def async_process(
        self, api: CmrApi, previous: CmrSnapshot | None, snapshot: CmrSnapshot
    ) -> None:
        """Called by the coordinator after every successful poll."""
        now = dt_util.utcnow()
        self._snapshot = snapshot
        controller = snapshot.controller
        if (
            controller
            and controller.uptime is not None
            and self._controller_uptime is not None
            and controller.uptime < self._controller_uptime
        ):
            # The controller rebooted: its log ids start over.
            self.last_log_id = None
        self._controller_uptime = controller.uptime if controller else None

        replay = self.last_log_id is None and not self.events
        events = await self._read_log(api, snapshot, now)
        if previous is not None:
            events += diff_snapshots(previous, snapshot, now)
        self._ingest(events, snapshot, now, replay=replay)

    async def _read_log(self, api: CmrApi, snapshot: CmrSnapshot, now: datetime) -> list[dict[str, Any]]:
        try:
            if self._clock_read is None or now - self._clock_read > CLOCK_REFRESH:
                clock = await api.get("system/clock")
                self._gmt_offset = gmt_offset_seconds(clock.get("gmt-offset"))
                self._clock_read = now
            items = await self._fetch_log(api)
        except CmrApiError as err:
            _LOGGER.debug("Reading the controller log failed: %s", err)
            return []
        if not isinstance(items, list):
            return []
        items = sorted(
            (item for item in items if isinstance(item, dict)),
            key=lambda item: log_id_value(item.get(".id")),
        )
        if not items:
            return []
        self.last_log_id = items[-1].get(".id") or self.last_log_id

        offset = timedelta(seconds=self._gmt_offset or 0)
        now_local = (now + offset).replace(tzinfo=None)
        identities = [d.identity for d in snapshot.devices.values()]
        controller = snapshot.controller
        own_user = self.entry.data.get(CONF_USERNAME)
        events = []
        for item in items:
            topics = split_list(str(item.get("topics", "")).replace(";", ","))
            parsed = classify(topics, str(item.get("message", "")))
            if parsed.category in ("api", "login") and parsed.data.get("user") == own_user:
                # This integration's own polling; its failures are kept (security).
                continue
            local = parse_router_time(str(item.get("time", "")), now_local)
            when = (local - offset).replace(tzinfo=UTC) if local else now
            # Lines about another device's interface (e.g. centrally managed
            # radios named after the AP) belong to that device.
            owner = None
            if parsed.data.get("interface"):
                identity = find_identity(parsed.data["interface"], identities)
                owner = snapshot.device_by_identity(identity) if identity else None
            device = owner or controller
            if parsed.category == "dhcp" and parsed.data.get("host"):
                self._mac_hosts[parsed.data["mac"]] = parsed.data["host"]
            event = {
                "time": when,
                "source": "log",
                "category": parsed.category,
                "severity": parsed.severity,
                "title": parsed.title,
                "message": str(item.get("message", "")),
                "topics": topics,
                "data": parsed.data,
                "device_key": device.key if device else None,
                "device_name": device.identity if device else None,
            }
            if parsed.category == "wifi":
                name = self._client_name(parsed.data["mac"])
                if name:
                    event["subject_name"] = f"{name} ({parsed.data['mac']})"
                    event["title"] = parsed.title.replace(parsed.data["mac"], name, 1)
            events.append(event)
        return events

    async def _fetch_log(self, api: CmrApi) -> list[dict[str, Any]]:
        """Log lines newer than the last one seen.

        A server-side id filter saves transferring the whole log every poll,
        but an unsupported query silently returns nothing, so it is only used
        after it matched the full read once.
        """
        last = self.last_log_id
        if last is None:
            return await api.get("log")
        query = {".query": [f">.id={last}"]}
        if self._query_ok:
            return await api.post("log/print", query)
        full = await api.get("log")
        newer = [i for i in full if isinstance(i, dict) and log_id_value(i.get(".id")) > log_id_value(last)]
        if self._query_ok is None and newer:
            try:
                probe = await api.post("log/print", query)
            except CmrApiError:
                probe = None
            self._query_ok = isinstance(probe, list) and {p.get(".id") for p in probe} >= {
                i.get(".id") for i in newer
            }
            _LOGGER.debug("Controller-side log filtering %s", "works" if self._query_ok else "unavailable")
        return newer

    def _client_name(self, mac: str) -> str | None:
        """A Wi-Fi client's name from any integration that knows its MAC."""
        registry = dr.async_get(self.hass)
        for device in registry.async_get_devices(
            connections={(dr.CONNECTION_NETWORK_MAC, dr.format_mac(mac))}
        ):
            return device.name_by_user or device.name
        return self._mac_hosts.get(mac)

    # ------------------------------------------------------------- output

    def _ingest(
        self, events: list[dict[str, Any]], snapshot: CmrSnapshot, now: datetime, *, replay: bool
    ) -> None:
        added: list[dict[str, Any]] = []
        for event in sorted(events, key=lambda e: e["time"]):
            added.append(self._add(event, replay=replay))
            for change, insight in self.engine.observe(event):
                added += self._on_insight(change, insight, insight.updated, replay=replay)
        for change, insight in self.engine.check_devices(self._device_states(snapshot, now), now):
            added += self._on_insight(change, insight, now, replay=False)
        for insight in self.engine.sweep(now):
            # It ended when the quiet period after its last occurrence ran out.
            rule = RULES.get(insight.kind)
            ended = min(now, insight.updated + rule.quiet) if rule else now
            insight.resolved = ended
            added += self._on_insight("resolved", insight, ended, replay=replay)
        if replay:
            # History is in; show what is still going on.
            for insight in self.engine.active.values():
                self._repair(insight, active=True)
        added = [event for event in added if event]
        if added:
            self._save()
            for listener in list(self._listeners):
                listener(added)

    @callback
    def add_pushed_alert(self, alert: dict[str, Any]) -> None:
        """An alert the controller pushed to the webhook."""
        snapshot = self.entry.runtime_data.data
        device = snapshot.devices.get(alert.get("device_key") or "") if snapshot else None
        event = {
            "time": dt_util.utcnow(),
            "source": "push",
            "category": "alert",
            "severity": ALERT_SEVERITY.get(alert.get("severity") or "", "notice"),
            "title": f"Alert {alert.get('alert')}" + (f" on {alert['device']}" if alert.get("device") else ""),
            "message": alert.get("message") or "",
            "data": {**alert, "event": "pushed"},
            "device_key": device.key if device else None,
            "device_name": device.identity if device else alert.get("device"),
        }
        stored = self._add(event, replay=False)
        self._save()
        for listener in list(self._listeners):
            listener([stored])

    def _add(self, event: dict[str, Any], *, replay: bool) -> dict[str, Any]:
        stored = {
            **event,
            "id": f"{int(event['time'].timestamp())}-{next(self._seq)}",
            "time": event["time"].isoformat(),
            "device_id": self._device_id(event.get("device_key")),
        }
        self.events.append(stored)
        if not replay and self._notable(stored):
            self.hass.bus.async_fire(
                EVENT_CMR,
                {
                    "entry_id": self.entry.entry_id,
                    "device_id": stored["device_id"],
                    "device_name": stored.get("device_name"),
                    "category": stored["category"],
                    "severity": stored["severity"],
                    "title": stored["title"],
                    "message": stored.get("message"),
                    "data": stored.get("data"),
                },
            )
        return stored

    def _notable(self, event: dict[str, Any]) -> bool:
        mode = self.entry.options.get(CONF_ACTIVITY_LOG, "notable")
        if mode == "off":
            return False
        if mode == "all":
            return True
        return event["category"] in NOTABLE_CATEGORIES or SEVERITIES.index(event["severity"]) >= 2

    def _on_insight(
        self, change: str, insight: Insight, when: datetime, *, replay: bool
    ) -> list[dict[str, Any]]:
        if change == "updated":
            if not replay:
                self._repair(insight, active=True)
            return []
        title, detail = describe(insight)
        resolved = change == "resolved"
        event = self._add(
            {
                "time": when,
                "source": "insight",
                "category": "insight",
                "severity": "info" if resolved else insight.severity,
                "title": f"Resolved: {title}" if resolved else title,
                "message": detail,
                "data": {"kind": insight.kind, "key": insight.key, "event": change},
                "device_key": insight.device_key,
                "device_name": self._device_name(insight.device_key),
            },
            replay=replay,
        )
        if not replay:
            self._repair(insight, active=not resolved)
            self.hass.bus.async_fire(
                EVENT_ISSUE,
                {
                    "entry_id": self.entry.entry_id,
                    "action": change,
                    "kind": insight.kind,
                    "title": title,
                    "detail": detail,
                    "device_id": self._device_id(insight.device_key),
                },
            )
        return [event]

    def _repair(self, insight: Insight, *, active: bool) -> None:
        issue_id = self._issue_id(insight)
        if not active:
            ir.async_delete_issue(self.hass, DOMAIN, issue_id)
            return
        title, detail = describe(insight)
        ir.async_create_issue(
            self.hass,
            DOMAIN,
            issue_id,
            is_fixable=False,
            is_persistent=False,
            severity=ir.IssueSeverity.ERROR if insight.severity == "error" else ir.IssueSeverity.WARNING,
            translation_key="network_issue",
            translation_placeholders={"title": title, "detail": detail},
        )

    def _issue_id(self, insight: Insight) -> str:
        return f"{self.entry.entry_id}_{insight.key}"

    def _device_name(self, key: str | None) -> str | None:
        snapshot = self._snapshot or self.entry.runtime_data.data
        device = snapshot.devices.get(key) if snapshot and key else None
        return device.identity if device else None

    def _device_id(self, key: str | None) -> str | None:
        if not key:
            return None
        device = dr.async_get(self.hass).async_get_device_by_identifier((DOMAIN, key), self.entry.entry_id)
        return device.id if device else None

    def _device_states(self, snapshot: CmrSnapshot, now: datetime) -> list[dict[str, Any]]:
        states = []
        for key in set(self._offline_since) - set(snapshot.devices):
            del self._offline_since[key]
        for device in snapshot.devices.values():
            if device.connected:
                self._offline_since.pop(device.key, None)
                down_for = None
            else:
                since = self._offline_since.setdefault(device.key, now)
                down_for = (now - since).total_seconds()
            states.append(
                {
                    "key": device.key,
                    "name": device.identity,
                    "connected": device.connected,
                    "pending": device.pending,
                    "disconnected_for": down_for,
                }
            )
        return states

    # ------------------------------------------------------------ queries

    def insight_list(self) -> list[dict[str, Any]]:
        out = []
        for insight in sorted(self.engine.active.values(), key=lambda i: i.since):
            title, detail = describe(insight)
            out.append(
                {
                    "key": insight.key,
                    "kind": insight.kind,
                    "severity": insight.severity,
                    "title": title,
                    "detail": detail,
                    "since": insight.since.isoformat(),
                    "updated": insight.updated.isoformat(),
                    "count": insight.count,
                    "device_key": insight.device_key,
                    "device_id": self._device_id(insight.device_key),
                }
            )
        return out
