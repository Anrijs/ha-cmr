"""Trouble detection: patterns across events that no single event shows.

Pure Python (no Home Assistant imports); time is passed in so the rules can
be tested. Each rule counts matching events per subject in a sliding window,
raises an insight past a threshold, and resolves it after a quiet period.
"""

from __future__ import annotations

from collections import Counter
from collections.abc import Mapping
from dataclasses import asdict, dataclass, field, replace
from datetime import datetime, timedelta
from typing import Any


@dataclass(frozen=True)
class Rule:
    kind: str
    window: timedelta
    threshold: int
    quiet: timedelta
    severity: str


RULES: dict[str, Rule] = {
    rule.kind: rule
    for rule in (
        # A Wi-Fi client that keeps dropping.
        Rule("wifi_flapping", timedelta(minutes=15), 5, timedelta(minutes=30), "warning"),
        # A port going down and up.
        Rule("link_flapping", timedelta(minutes=30), 3, timedelta(minutes=30), "warning"),
        # A CMR device losing its controller connection repeatedly.
        Rule("device_flapping", timedelta(hours=1), 3, timedelta(hours=1), "warning"),
        # A device rebooting more than once a day.
        Rule("device_reboots", timedelta(hours=24), 2, timedelta(hours=24), "warning"),
        # Password guessing from one source.
        Rule("login_failures", timedelta(minutes=10), 5, timedelta(hours=1), "error"),
        # An alert action (e.g. a webhook) that keeps failing.
        Rule("alert_action_failing", timedelta(hours=1), 1, timedelta(hours=1), "warning"),
    )
}

# A managed device disconnected for longer than this is an issue on its own.
OFFLINE_AFTER = timedelta(minutes=15)

# The thresholds users may change (0 turns a rule off); the windows are fixed.
DEFAULT_THRESHOLDS: dict[str, int] = {rule.kind: rule.threshold for rule in RULES.values()}


@dataclass
class Insight:
    key: str
    kind: str
    subject: str
    device_key: str | None
    severity: str
    since: datetime
    updated: datetime
    count: int
    data: dict[str, Any] = field(default_factory=dict)
    resolved: datetime | None = None

    def as_dict(self) -> dict[str, Any]:
        out = asdict(self)
        for key in ("since", "updated", "resolved"):
            out[key] = out[key].isoformat() if out[key] else None
        return out

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Insight:
        values = dict(data)
        for key in ("since", "updated", "resolved"):
            values[key] = datetime.fromisoformat(values[key]) if values.get(key) else None
        return cls(**values)


def describe(insight: Insight, offline_after: timedelta = OFFLINE_AFTER) -> tuple[str, str]:
    """Title and explanation for an insight, from its data only."""
    d = insight.data
    name = d.get("name") or insight.subject
    rule = RULES.get(insight.kind)
    window = _human(rule.window) if rule else ""
    if insight.kind == "wifi_flapping":
        where = d.get("where") or "Wi-Fi"
        signal = d.get("signal")
        if signal is None:
            hint = "Check the client's power saving and firmware."
        elif signal >= -67:
            hint = (
                f"Signal is strong (about {signal} dBm), so the client itself is likely at fault: "
                "power saving, firmware, or roaming back and forth."
            )
        elif signal <= -75:
            hint = f"Signal is weak (about {signal} dBm): the client is at the edge of coverage."
        else:
            hint = f"Signal is moderate (about {signal} dBm); check for interference or roaming between APs."
        reasons = d.get("reasons") or {}
        top = max(reasons, key=reasons.get) if reasons else None
        return (
            f"Wi-Fi client {name} keeps dropping",
            f"Disconnected {insight.count} times within {window} on {where}"
            + (f", mostly \"{top}\"" if top else "")
            + f". {hint}",
        )
    if insight.kind == "link_flapping":
        return (
            f"{name} keeps going down",
            f"Link went down {insight.count} times within {window}. "
            "Check the cable, the connectors and the device at the other end.",
        )
    if insight.kind == "device_flapping":
        return (
            f"{name} keeps losing the controller",
            f"Disconnected from the CMR controller {insight.count} times within {window}. "
            "Check its uplink and power.",
        )
    if insight.kind == "device_reboots":
        return (
            f"{name} rebooted {insight.count} times",
            f"Rebooted {insight.count} times within {window}. Check power (PoE budget, PSU) "
            "and the log for crashes or watchdog resets.",
        )
    if insight.kind == "login_failures":
        return (
            f"Repeated login failures from {name}",
            f"{insight.count} failed logins within {window}"
            + (f" for {', '.join(sorted(d.get('users', [])))}" if d.get("users") else "")
            + ". If this isn't you, restrict the services' allowed addresses.",
        )
    if insight.kind == "alert_action_failing":
        return (
            f"Alert \"{name}\" can't run its action",
            f"The rule's action failed {insight.count} time(s), for example an unreachable webhook. "
            "Check the action settings on the controller.",
        )
    if insight.kind == "device_offline":
        return (
            f"{name} is offline",
            "Disconnected from the CMR controller for more than "
            f"{_human(offline_after)}.",
        )
    return (insight.kind, "")


def _human(delta: timedelta) -> str:
    minutes = int(delta.total_seconds() // 60)
    if minutes % 1440 == 0:
        days = minutes // 1440
        return f"{days} day{'s' if days > 1 else ''}" if days > 1 else "24 hours"
    if minutes % 60 == 0:
        hours = minutes // 60
        return f"{hours} hour{'s' if hours > 1 else ''}"
    return f"{minutes} minutes"


class InsightEngine:
    """Tracks recent occurrences per subject and the insights they raise."""

    def __init__(
        self,
        state: dict[str, Any] | None = None,
        thresholds: Mapping[str, int] | None = None,
        offline_after: timedelta | None = None,
    ) -> None:
        state = state or {}
        self.rules: dict[str, Rule] = dict(RULES)
        self.offline_after = OFFLINE_AFTER
        self.configure(thresholds, offline_after)
        # key -> list of [iso time, extra] occurrences inside the window
        self._seen: dict[str, list[tuple[datetime, dict[str, Any]]]] = {
            key: [(datetime.fromisoformat(t), extra) for t, extra in items]
            for key, items in state.get("seen", {}).items()
        }
        self.active: dict[str, Insight] = {
            key: Insight.from_dict(item) for key, item in state.get("active", {}).items()
        }
        # Offline insights dismissed by hand: not raised again while the device stays down.
        self._dismissed: set[str] = set(state.get("dismissed", []))

    def configure(self, thresholds: Mapping[str, int] | None = None, offline_after: timedelta | None = None) -> None:
        """Apply per-rule thresholds (0 turns a rule off) and the offline delay."""
        given = thresholds or {}
        self.rules = {
            kind: replace(rule, threshold=max(0, int(given.get(kind, rule.threshold)))) for kind, rule in RULES.items()
        }
        self.offline_after = offline_after or OFFLINE_AFTER

    def as_dict(self) -> dict[str, Any]:
        return {
            "seen": {
                key: [(t.isoformat(), extra) for t, extra in items] for key, items in self._seen.items()
            },
            "active": {key: insight.as_dict() for key, insight in self.active.items()},
            "dismissed": sorted(self._dismissed),
        }

    # ------------------------------------------------------------- input

    def observe(self, event: dict[str, Any]) -> list[tuple[str, Insight]]:
        """Feed one event; returns ("raised" | "updated", insight) changes."""
        match = _match(event)
        if match is None:
            return []
        kind, subject, extra = match
        return self._count(kind, subject, event["time"], event.get("device_key"), extra)

    def check_devices(self, devices: list[dict[str, Any]], now: datetime) -> list[tuple[str, Insight]]:
        """Offline-too-long and recovered devices, from the latest snapshot.

        Each item: key, name, connected, pending, disconnected_for (seconds or None).
        """
        changes: list[tuple[str, Insight]] = []
        for device in devices:
            key = f"device_offline:{device['key']}"
            down_for = device.get("disconnected_for")
            offline = not device["connected"] and not device.get("pending")
            if offline and down_for is not None and down_for >= self.offline_after.total_seconds():
                if key not in self.active and key not in self._dismissed:
                    since = now - timedelta(seconds=down_for)
                    insight = Insight(
                        key, "device_offline", device["name"], device["key"], "error",
                        since, now, 1, {"name": device["name"]},
                    )
                    self.active[key] = insight
                    changes.append(("raised", insight))
            elif not offline:
                self._dismissed.discard(key)
                if key in self.active:
                    insight = self.active.pop(key)
                    insight.resolved = now
                    changes.append(("resolved", insight))
        # A device removed from the controller is no longer "offline".
        present = {f"device_offline:{device['key']}" for device in devices}
        for key in [k for k in self.active if k.startswith("device_offline:") and k not in present]:
            insight = self.active.pop(key)
            insight.resolved = now
            changes.append(("resolved", insight))
        return changes

    def dismiss(self, key: str, now: datetime) -> Insight | None:
        """Resolve an insight by hand.

        Its counted occurrences are forgotten so only new ones can raise it
        again; a dismissed offline insight stays quiet until the device has
        been back online once.
        """
        insight = self.active.pop(key, None)
        if insight is None:
            return None
        insight.resolved = now
        self._seen.pop(key, None)
        if insight.kind == "device_offline":
            self._dismissed.add(key)
        return insight

    def sweep(self, now: datetime) -> list[Insight]:
        """Resolve insights that have been quiet long enough; drop old counts."""
        resolved = []
        for key, insight in list(self.active.items()):
            rule = self.rules.get(insight.kind)
            if rule and now - insight.updated >= rule.quiet:
                insight.resolved = now
                resolved.append(self.active.pop(key))
        for key, items in list(self._seen.items()):
            kind = key.split(":", 1)[0]
            rule = self.rules.get(kind)
            keep = [(t, x) for t, x in items if rule and now - t < rule.window]
            if keep:
                self._seen[key] = keep
            else:
                del self._seen[key]
        return resolved

    # ---------------------------------------------------------- counting

    def _count(
        self, kind: str, subject: str, when: datetime, device_key: str | None, extra: dict[str, Any]
    ) -> list[tuple[str, Insight]]:
        rule = self.rules[kind]
        if rule.threshold <= 0:
            return []  # turned off in the options; anything active resolves on the next sweep
        key = f"{kind}:{subject}"
        items = [(t, x) for t, x in self._seen.get(key, []) if when - t < rule.window]
        items.append((when, extra))
        self._seen[key] = items
        active = self.active.get(key)
        data = _summarise(kind, items, extra)
        if active:
            active.updated = max(active.updated, when)
            active.count += 1
            active.data.update(data)
            return [("updated", active)]
        if len(items) >= rule.threshold:
            insight = Insight(
                key, kind, subject, device_key, rule.severity, items[0][0], when, len(items), data
            )
            self.active[key] = insight
            return [("raised", insight)]
        return []


def _match(event: dict[str, Any]) -> tuple[str, str, dict[str, Any]] | None:
    """Which rule an event counts towards, its subject and data to keep."""
    category = event.get("category")
    data = event.get("data") or {}
    if category == "wifi" and data.get("event") == "disconnected" and data.get("mac"):
        return (
            "wifi_flapping",
            data["mac"],
            {
                "signal": data.get("signal"),
                "reason": data.get("reason"),
                "where": event.get("device_name") or data.get("ssid") or data.get("interface"),
                "name": event.get("subject_name") or data["mac"],
            },
        )
    if category == "link" and data.get("state") == "down" and data.get("interface"):
        owner = event.get("device_name") or "?"
        return (
            "link_flapping",
            f"{event.get('device_key') or owner}/{data['interface']}",
            {"name": f"{owner} {data['interface']}"},
        )
    if category == "device" and data.get("event") == "disconnected":
        return ("device_flapping", event["device_key"], {"name": event.get("device_name")})
    if category == "device" and data.get("event") == "rebooted":
        return ("device_reboots", event["device_key"], {"name": event.get("device_name")})
    if category == "security" and data.get("event") == "failure":
        source = data.get("address") or data.get("service") or "unknown"
        return ("login_failures", source, {"name": source, "user": data.get("user")})
    if category == "alert" and data.get("event") == "action_failed":
        return ("alert_action_failing", data["rule_id"], {"name": data.get("rule")})
    return None


def _summarise(kind: str, items: list[tuple[datetime, dict[str, Any]]], latest: dict[str, Any]) -> dict[str, Any]:
    if kind == "wifi_flapping":
        signals = [x["signal"] for _, x in items if x.get("signal") is not None]
        reasons = Counter(x["reason"] for _, x in items if x.get("reason"))
        return {
            "name": latest.get("name"),
            "where": latest.get("where"),
            "signal": round(sum(signals) / len(signals)) if signals else None,
            "reasons": dict(reasons),
        }
    if kind == "login_failures":
        return {"name": latest.get("name"), "users": sorted({x["user"] for _, x in items if x.get("user")})}
    return {"name": latest.get("name")}
