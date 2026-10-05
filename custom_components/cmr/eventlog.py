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
from collections.abc import Callable, Mapping
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
from .const import CONF_ACTIVITY_LOG, CONF_DETECTION, CONF_OFFLINE_MINUTES, DOMAIN, EVENT_CMR, EVENT_ISSUE
from .insights import DEFAULT_THRESHOLDS, OFFLINE_AFTER, Insight, InsightEngine, describe
from .logparse import (
    SEVERITIES,
    classify,
    find_identity,
    gmt_offset_seconds,
    log_id_value,
    parse_router_time,
    wifi_log_event,
)
from .models import CmrSnapshot, split_list

if TYPE_CHECKING:
    from .coordinator import CmrConfigEntry

_LOGGER = logging.getLogger(__name__)

STORE_VERSION = 1
MAX_EVENTS = 1000
# Fleet-wide Wi-Fi events from `/cmr/device/wifi-logs`. Off: current
# controllers return the whole history on every call (time-start is
# ignored) with empty rows over REST, which on a large fleet runs past the
# request timeout and upsets the web service. Re-enable once it filters.
WIFI_LOGS_ENABLED = False
# Categories always worth a line in Home Assistant's activity log.
NOTABLE_CATEGORIES = {"device", "upgrade", "alert", "security", "config", "insight"}
CLOCK_REFRESH = timedelta(minutes=10)

type Listener = Callable[[list[dict[str, Any]]], None]


def detection_settings(options: Mapping[str, Any]) -> tuple[dict[str, int], timedelta]:
    """Issue-detection thresholds and the offline delay from the entry options."""
    section = options.get(CONF_DETECTION) or {}
    thresholds = {kind: int(section.get(kind, default)) for kind, default in DEFAULT_THRESHOLDS.items()}
    minutes = section.get(CONF_OFFLINE_MINUTES)
    return thresholds, timedelta(minutes=int(minutes)) if minutes else OFFLINE_AFTER


def is_notable(event: Mapping[str, Any]) -> bool:
    """Worth a line in the activity log: a category people act on, or a warning."""
    return event["category"] in NOTABLE_CATEGORIES or SEVERITIES.index(event["severity"]) >= 2


class CmrEventLog:
    """Timeline, insights and their side effects for one config entry."""

    def __init__(self, hass: HomeAssistant, entry: CmrConfigEntry) -> None:
        self.hass = hass
        self.entry = entry
        self._store: Store[dict[str, Any]] = Store(hass, STORE_VERSION, f"{DOMAIN}.{entry.entry_id}.events")
        self.events: deque[dict[str, Any]] = deque(maxlen=MAX_EVENTS)
        self.engine = InsightEngine(None, *detection_settings(entry.options))
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
        # Fleet-wide Wi-Fi client events from `/cmr/device/wifi-logs`: None
        # until tried, False when the controller doesn't serve them over REST.
        self._wifi_logs_ok: bool | None = None
        self._wifi_last: datetime | None = None
        # (time, mac, event, source) of recently ingested Wi-Fi events, so the
        # same event seen in `/log` and in `wifi-logs` is kept once.
        self._wifi_seen: dict[tuple[str, str, str], datetime] = {}
        # The snapshot being processed (the coordinator's is set only afterwards).
        self._snapshot: CmrSnapshot | None = None

    # ---------------------------------------------------------- lifecycle

    async def async_load(self) -> None:
        data = await self._store.async_load() or {}
        self.events.extend(data.get("events", []))
        self.engine = InsightEngine(data.get("engine"), *detection_settings(self.entry.options))
        self.last_log_id = data.get("last_log_id")
        self._mac_hosts = data.get("mac_hosts", {})
        # Repairs aren't kept across restarts; show the still-active ones again.
        for insight in self.engine.active.values():
            self._repair(insight, active=True)

    @callback
    def async_unload(self) -> None:
        for insight in self.engine.active.values():
            ir.async_delete_issue(self.hass, DOMAIN, self._issue_id(insight))

    @callback
    def configure(self) -> None:
        """Apply changed detection options without a reload."""
        self.engine.configure(*detection_settings(self.entry.options))

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
        events += await self._read_wifi_logs(api, snapshot, now, replay=replay)
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
                self._name_wifi_client(event, parsed.data["mac"])
                self._wifi_seen[(parsed.data["mac"], parsed.data["event"], device.identity if device else "")] = when
            events.append(event)
        return events

    def _name_wifi_client(self, event: dict[str, Any], mac: str) -> None:
        name = self._client_name(mac)
        if name:
            event["subject_name"] = f"{name} ({mac})"
            event["title"] = event["title"].replace(mac, name, 1)

    async def _read_wifi_logs(
        self, api: CmrApi, snapshot: CmrSnapshot, now: datetime, *, replay: bool
    ) -> list[dict[str, Any]]:
        """Client events from every access point, via `/cmr/device/wifi-logs`.

        The controller's own log only has the events of radios it manages
        itself; this command collects them from the whole fleet. For now it
        ignores the device selection, so one call returns everything.
        """
        if not WIFI_LOGS_ENABLED or self._wifi_logs_ok is False or snapshot.controller is None:
            return []
        offset = timedelta(seconds=self._gmt_offset or 0)
        start = self._wifi_last or (now - timedelta(hours=1 if replay else 0, minutes=0 if replay else 5))
        start_local = (start + offset).replace(tzinfo=None)
        payload = {
            "numbers": snapshot.controller.rest_id,
            "once": "",
            "time-start": start_local.strftime("%Y-%m-%d %H:%M:%S"),
        }
        try:
            items = await api.post("cmr/device/wifi-logs", payload)
        except CmrApiError as err:
            if self._wifi_logs_ok is None:
                _LOGGER.info("Wi-Fi client events aren't available over REST on this controller (%s)", err.detail)
            self._wifi_logs_ok = False
            return []
        if not isinstance(items, list):
            _LOGGER.debug("Unexpected wifi-logs response: %r", items)
            self._wifi_logs_ok = False
            return []
        rows = [(item, wifi_log_event(item)) for item in items if isinstance(item, dict)]
        if self._wifi_logs_ok is None:
            # A controller that serves the rows without their fields is not
            # asked again: the answer is large and carries nothing.
            self._wifi_logs_ok = not rows or any(parsed for _, parsed in rows)
            _LOGGER.info(
                "Wi-Fi client events over REST: %s (%d rows, first %r)",
                "available" if self._wifi_logs_ok else "rows carry no data; not using them",
                len(rows), items[0] if items else None,
            )
            if not self._wifi_logs_ok:
                return []

        now_local = (now + offset).replace(tzinfo=None)
        events: list[dict[str, Any]] = []
        for item, parsed in rows:
            if parsed is None:
                continue
            local = parse_router_time(str(item.get("time", "")), now_local)
            when = (local - offset).replace(tzinfo=UTC) if local else now
            if when < start:
                continue  # the controller may ignore time-start and send everything
            device = snapshot.device_by_identity(parsed.data["identity"])
            key = (parsed.data["mac"], parsed.data["event"], device.identity if device else "")
            seen = self._wifi_seen.get(key)
            if seen is not None and abs((seen - when).total_seconds()) < 3:
                continue  # the controller's own log already reported it
            self._wifi_seen[key] = when
            event = {
                "time": when,
                "source": "wifi",
                "category": "wifi",
                "severity": parsed.severity,
                "title": parsed.title,
                "message": "",
                "data": parsed.data,
                "device_key": device.key if device else None,
                "device_name": device.identity if device else parsed.data["identity"],
            }
            self._name_wifi_client(event, parsed.data["mac"])
            events.append(event)
            if self._wifi_last is None or when > self._wifi_last:
                self._wifi_last = when
        if self._wifi_last is None:
            self._wifi_last = now
        # Forget dedup keys older than a few minutes.
        cutoff = now - timedelta(minutes=5)
        self._wifi_seen = {k: t for k, t in self._wifi_seen.items() if t >= cutoff}
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
            rule = self.engine.rules.get(insight.kind)
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
            "notable": is_notable(event),
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
        return is_notable(event)

    def _on_insight(
        self, change: str, insight: Insight, when: datetime, *, replay: bool
    ) -> list[dict[str, Any]]:
        if change == "updated":
            if not replay:
                self._repair(insight, active=True)
            return []
        title, detail = describe(insight, self.engine.offline_after)
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
        title, detail = describe(insight, self.engine.offline_after)
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
        offset = timedelta(seconds=self._gmt_offset or 0)
        now_local = (now + offset).replace(tzinfo=None)
        for device in snapshot.devices.values():
            if device.connected:
                self._offline_since.pop(device.key, None)
                down_for = None
            else:
                # The controller remembers when the device dropped; our own
                # timer only covers controllers that don't report it.
                local = parse_router_time(device.disconnected_since or "", now_local)
                since = (local - offset).replace(tzinfo=UTC) if local else self._offline_since.setdefault(device.key, now)
                down_for = max(0.0, (now - since).total_seconds())
            states.append(
                {
                    "key": device.key,
                    "name": device.identity,
                    "connected": device.connected,
                    "pending": device.unpaired,
                    "disconnected_for": down_for,
                }
            )
        return states

    # ------------------------------------------------------------ queries

    def insight_list(self) -> list[dict[str, Any]]:
        out = []
        for insight in sorted(self.engine.active.values(), key=lambda i: i.since):
            title, detail = describe(insight, self.engine.offline_after)
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
                    "device_name": self._device_name(insight.device_key),
                    "device_id": self._device_id(insight.device_key),
                }
            )
        return out
