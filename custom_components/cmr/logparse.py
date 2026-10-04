"""Classify router log lines into events.

Pure Python (no Home Assistant imports). Only standard router message
formats are recognised; anything else is kept as-is under its first topic, so
nothing here depends on one network's names or language.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta
import re
from typing import Any

# Severity order, lowest first.
SEVERITIES = ("info", "notice", "warning", "error")

_MAC = r"[0-9A-Fa-f]{2}(?::[0-9A-Fa-f]{2}){5}"

# 02:00:5E:10:00:01@2ghz-AP-2(IoT) disconnected, connection lost, signal strength -40, channel 2437/n
_WIFI = re.compile(
    rf"^(?P<mac>{_MAC})@(?P<iface>[^\s(,]+)(?:\((?P<ssid>[^)]*)\))?\s+"
    r"(?P<event>connected|disconnected|roamed(?: to \S+)?|rejected)(?:,\s*(?P<rest>.*))?$"
)
_SIGNAL = re.compile(r"signal strength (-?\d+)")
_CHANNEL = re.compile(r"channel (\S+)")
# ether6 link up (speed 1G, full duplex) / ether6 link down
_LINK = re.compile(r"^(?P<iface>\S+) link (?P<state>up|down)(?: \((?P<detail>[^)]*)\))?$")
# user admin logged in from 10.0.0.2 via ssh / user admin logged out via api
_LOGIN = re.compile(
    r"^user (?P<user>\S+) logged (?P<dir>in|out)(?: from (?P<addr>\S+))?(?: via (?P<service>\S+))?$"
)
# login failure for user admin from 10.0.0.2 via ssh
_LOGIN_FAIL = re.compile(
    r"^login failure for user (?P<user>\S+)(?: from (?P<addr>\S+))?(?: via (?P<service>\S+))?$"
)
# ip service changed by ssh-cmd:admin@10.0.0.2/action:136 (/ip service set ...)
_CONFIG = re.compile(
    r"^(?P<what>.+?) (?P<action>changed|added|removed|moved|enabled|disabled) by (?P<who>\S+)(?: \((?P<command>.*)\))?$"
)
# defconf assigned 192.168.88.10 for AA:BB:CC:DD:EE:FF phone / deassigned ... from ...
_DHCP = re.compile(
    rf"^(?P<server>\S+) (?P<action>assigned|deassigned) (?P<ip>\S+) (?:for|from|to) (?P<mac>{_MAC})(?: (?P<host>.+))?$"
)
# 4d2e0 publickey accepted for user: admin, fingerprint: SHA256:...
_SSH_AUTH = re.compile(
    r"^\S+ (?P<method>publickey|password|keyboard-interactive) (?P<result>accepted|failed) for user:? (?P<user>[^\s,]+)"
)

# Services used by tools rather than people; their logins are routine.
API_SERVICES = {"api", "api-ssl", "rest-api"}

_REBOOT = re.compile(r"\b(rebooted|system started|router was rebooted)\b", re.I)


@dataclass(frozen=True)
class LogEvent:
    """What a log line means."""

    category: str
    severity: str
    title: str
    data: dict[str, Any] = field(default_factory=dict)


def _topic_severity(topics: list[str]) -> str:
    lowered = {t.lower() for t in topics}
    if lowered & {"critical", "error"}:
        return "error"
    if "warning" in lowered:
        return "warning"
    return "info"


def classify(topics: list[str], message: str) -> LogEvent:
    """Turn one log entry into a categorised event."""
    message = message.strip()
    base = _topic_severity(topics)

    if m := _WIFI.match(message):
        rest = m["rest"] or ""
        signal = _SIGNAL.search(rest)
        channel = _CHANNEL.search(rest)
        reason = rest.split(", signal strength")[0].split(", channel")[0].strip(", ") or None
        if reason and reason.startswith("signal strength"):
            reason = None
        event = m["event"].split(" ")[0]
        mac = m["mac"].upper()
        where = m["ssid"] or m["iface"]
        title = {
            "connected": f"Wi-Fi client {mac} connected to {where}",
            "disconnected": f"Wi-Fi client {mac} disconnected from {where}"
            + (f" ({reason})" if reason else ""),
            "roamed": f"Wi-Fi client {mac} roamed on {where}",
            "rejected": f"Wi-Fi client {mac} rejected by {where}" + (f" ({reason})" if reason else ""),
        }[event]
        return LogEvent(
            "wifi",
            base,
            title,
            {
                "mac": mac,
                "interface": m["iface"],
                "ssid": m["ssid"],
                "event": event,
                "reason": reason,
                "signal": int(signal.group(1)) if signal else None,
                "channel": channel.group(1) if channel else None,
            },
        )

    if m := _LINK.match(message):
        up = m["state"] == "up"
        return LogEvent(
            "link",
            base if up else max(base, "notice", key=SEVERITIES.index),
            f"{m['iface']} link {m['state']}" + (f" ({m['detail']})" if m["detail"] else ""),
            {"interface": m["iface"], "state": m["state"], "detail": m["detail"]},
        )

    if m := _LOGIN_FAIL.match(message):
        return LogEvent(
            "security",
            max(base, "warning", key=SEVERITIES.index),
            f"Login failure for {m['user']}"
            + (f" from {m['addr']}" if m["addr"] else "")
            + (f" via {m['service']}" if m["service"] else ""),
            {"user": m["user"], "address": m["addr"], "service": m["service"], "event": "failure"},
        )

    if m := _SSH_AUTH.match(message):
        failed = m["result"] == "failed"
        return LogEvent(
            "security" if failed else "login",
            max(base, "warning", key=SEVERITIES.index) if failed else base,
            f"{m['user']} {'failed' if failed else 'authenticated'} SSH {m['method']} login",
            {"user": m["user"], "service": "ssh", "method": m["method"], "event": "failure" if failed else "auth"},
        )

    if m := _LOGIN.match(message):
        return LogEvent(
            "api" if (m["service"] or "").lower() in API_SERVICES else "login",
            base,
            f"{m['user']} logged {m['dir']}"
            + (f" from {m['addr']}" if m["addr"] else "")
            + (f" via {m['service']}" if m["service"] else ""),
            {"user": m["user"], "address": m["addr"], "service": m["service"], "event": m["dir"]},
        )

    if m := _DHCP.match(message):
        return LogEvent(
            "dhcp",
            base,
            f"{m['ip']} {m['action']} {'to' if m['action'] == 'assigned' else 'from'} {m['mac'].upper()}"
            + (f" ({m['host']})" if m["host"] else ""),
            {"server": m["server"], "ip": m["ip"], "mac": m["mac"].upper(), "host": m["host"], "event": m["action"]},
        )

    if m := _CONFIG.match(message):
        return LogEvent(
            "config",
            max(base, "notice", key=SEVERITIES.index),
            f"{m['what'][0].upper()}{m['what'][1:]} {m['action']} by {_who(m['who'])}",
            {"what": m["what"], "action": m["action"], "who": _who(m["who"]), "command": m["command"]},
        )

    if _REBOOT.search(message):
        return LogEvent("system", max(base, "notice", key=SEVERITIES.index), message, {"event": "reboot"})

    category = next((t.lower() for t in topics if t.lower() not in {"info", "warning", "error", "critical", "debug"}), "other")
    if category == "script":
        category = "system"
    return LogEvent(category, base, message, {})


def _who(text: str) -> str:
    """Drop the internal action counter: "ssh-cmd:admin@10.0.0.2/action:136"."""
    return re.sub(r"/action:\d+$", "", text)


def wifi_log_event(item: dict[str, Any]) -> LogEvent | None:
    """One row of `/cmr/device/wifi-logs`: a client (dis)connecting on any AP.

    Rows carry the source device (`identity@address`), the client MAC, the
    event (connected, disconnected, failed) and the BSSID; the controller
    collects them from every managed access point.
    """
    mac = str(item.get("address") or item.get("mac") or "").upper()
    event = str(item.get("event") or "").lower()
    if not re.fullmatch(_MAC, mac) or event not in ("connected", "disconnected", "failed"):
        return None
    source = str(item.get("source") or "")
    identity = source.split("@", 1)[0] or None
    bssid = str(item.get("bssid") or "").upper() or None
    where = identity or bssid or "Wi-Fi"
    title = {
        "connected": f"Wi-Fi client {mac} connected to {where}",
        "disconnected": f"Wi-Fi client {mac} disconnected from {where}",
        "failed": f"Wi-Fi client {mac} failed to connect to {where}",
    }[event]
    return LogEvent(
        "wifi",
        "notice" if event == "failed" else "info",
        title,
        {"mac": mac, "event": event, "bssid": bssid, "source": source, "identity": identity},
    )


def find_identity(text: str, identities: list[str]) -> str | None:
    """The longest managed identity that appears as a whole token in text.

    Wi-Fi interface names often embed the AP's identity (e.g. a wireless controller's
    "<band>-<identity>"); a token match avoids "hAP" matching "hAPax3".
    """
    best = None
    for identity in identities:
        if not identity:
            continue
        pattern = rf"(?<![A-Za-z0-9]){re.escape(identity)}(?![A-Za-z0-9])"
        if re.search(pattern, text) and (best is None or len(identity) > len(best)):
            best = identity
    return best


_MONTHS = {m: i for i, m in enumerate(
    ("jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"), start=1
)}


def parse_router_time(text: str, now_local: datetime) -> datetime | None:
    """Parse a log time in the router's local zone (naive datetime).

    Handles "2026-10-04 17:25:13", "17:25:13" (today) and "oct/03 17:25:13".
    """
    text = (text or "").strip()
    try:
        if re.fullmatch(r"\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}", text):
            return datetime.strptime(text, "%Y-%m-%d %H:%M:%S")
        if re.fullmatch(r"\d{2}:\d{2}:\d{2}", text):
            t = datetime.strptime(text, "%H:%M:%S")
            stamp = now_local.replace(hour=t.hour, minute=t.minute, second=t.second, microsecond=0)
            # Just after midnight, a time later than now belongs to yesterday.
            return stamp - timedelta(days=1) if stamp > now_local + timedelta(minutes=5) else stamp
        if m := re.fullmatch(r"([a-z]{3})/(\d{2}) (\d{2}):(\d{2}):(\d{2})", text.lower()):
            month = _MONTHS[m.group(1)]
            year = now_local.year - (1 if month > now_local.month else 0)
            return datetime(year, month, int(m.group(2)), int(m.group(3)), int(m.group(4)), int(m.group(5)))
    except (ValueError, KeyError):
        return None
    return None


def gmt_offset_seconds(value: Any) -> int:
    """The clock's gmt-offset: "+03:00", "-05:30" or seconds."""
    text = str(value or "0").strip()
    if m := re.fullmatch(r"([+-])(\d{1,2}):(\d{2})", text):
        seconds = int(m.group(2)) * 3600 + int(m.group(3)) * 60
        return -seconds if m.group(1) == "-" else seconds
    try:
        return int(text)
    except ValueError:
        return 0


def log_id_value(log_id: str | None) -> int:
    """Numeric value of an item id like "*12AD" (for ordering)."""
    try:
        return int(str(log_id).lstrip("*"), 16)
    except (TypeError, ValueError):
        return -1
