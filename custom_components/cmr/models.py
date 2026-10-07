"""Typed models for data read from the CMR controller's REST API.

Pure Python with no Home Assistant imports, so the parsing can be unit-tested
on its own. The router returns every value as a string; the helpers here turn
them into numbers, lists and booleans and smooth over known controller quirks.
"""

from __future__ import annotations

from dataclasses import dataclass, field
import re
from typing import Any

# ---------------------------------------------------------------------------
# Scalar helpers
# ---------------------------------------------------------------------------

_TRUE = {"true", "yes", "1"}


def to_bool(value: Any) -> bool:
    """Interpret a router boolean ("true"/"yes"/True)."""
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in _TRUE if value is not None else False


def to_int(value: Any) -> int | None:
    """Parse an integer, or None when unset or not numeric."""
    if value in (None, ""):
        return None
    try:
        return int(str(value).strip())
    except ValueError:
        return None


def split_list(value: Any) -> list[str]:
    """Split a comma-separated list ("a,b,c") into items."""
    if value in (None, ""):
        return []
    if isinstance(value, list):
        return [str(v) for v in value if str(v)]
    return [part.strip() for part in str(value).split(",") if part.strip()]


def signed32(value: Any) -> int | None:
    """Undo unsigned 32-bit rendering of negative coordinates.

    Layout nodes dragged above or left of the origin come back as e.g.
    4294967294 instead of -2.
    """
    number = to_int(value)
    if number is None:
        return None
    return number - 2**32 if number >= 2**31 else number


_DURATION_PART = re.compile(r"(\d+(?:\.\d+)?)(w|d|h|ms|us|ns|m|s)")
_DURATION_UNITS = {
    "w": 604800,
    "d": 86400,
    "h": 3600,
    "m": 60,
    "s": 1,
    "ms": 0.001,
    "us": 0.000001,
    "ns": 0.000000001,
}
_CLOCK = re.compile(r"(?:(\d+)d\s*)?(\d+):(\d{2}):(\d{2})(?:\.\d+)?$")


def parse_duration(value: Any) -> int | None:
    """Parse a router duration into whole seconds.

    Accepts "2d19h18m28s", "1w2d", "23h47m1s", "00:10:05" and "1d 02:03:04".
    """
    if value in (None, ""):
        return None
    text = str(value).strip()
    clock = _CLOCK.fullmatch(text)
    if clock:
        days, hours, minutes, seconds = (int(g) if g else 0 for g in clock.groups())
        return days * 86400 + hours * 3600 + minutes * 60 + seconds
    parts = _DURATION_PART.findall(text)
    if not parts or "".join(n + u for n, u in parts) != text.replace(" ", ""):
        return None
    return int(sum(float(n) * _DURATION_UNITS[u] for n, u in parts))


# ---------------------------------------------------------------------------
# RouterOS versions
# ---------------------------------------------------------------------------

# Internal builds ("7.40_ab12") sort before beta, beta before rc, rc
# before the release itself.
_STAGE_RANK = {"_ab": 0, "alpha": 1, "beta": 2, "rc": 3, None: 4}
_VERSION = re.compile(r"^(\d+)\.(\d+)(?:\.(\d+))?(?:(_ab|alpha|beta|rc)(\d+))?")


def version_key(version: Any) -> tuple[int, int, int, int, int] | None:
    """Sortable key for a RouterOS version string, or None if unparsable."""
    if not version:
        return None
    match = _VERSION.match(str(version).strip())
    if not match:
        return None
    major, minor, patch, stage, stage_num = match.groups()
    return (
        int(major),
        int(minor),
        int(patch or 0),
        _STAGE_RANK[stage],
        int(stage_num or 0),
    )


def is_newer(candidate: Any, installed: Any) -> bool:
    """True when candidate is a strictly newer RouterOS version.

    The controller flags any *different* version as an upgrade, including
    older ones; this comparison is what decides whether to offer an update.
    """
    new, old = version_key(candidate), version_key(installed)
    return new is not None and old is not None and new > old


def is_prerelease(version: Any) -> bool:
    """True for development, alpha, beta and rc builds."""
    key = version_key(version)
    return key is not None and key[3] < _STAGE_RANK[None]


# ---------------------------------------------------------------------------
# Label selectors
# ---------------------------------------------------------------------------


def selector_matches(selector: Any, labels: set[str]) -> bool:
    """Whether a CMR label selector covers a device with these labels.

    A selector is a comma-separated list: plain labels are combined with OR,
    `+label` must also match (AND), `-label` excludes (AND NOT), and `all`
    covers every device. `-core` alone means everyone except `core`.
    """
    items = split_list(selector)
    if not items:
        return False
    plain = {item for item in items if item[0] not in "+-"}
    required = {item[1:] for item in items if item.startswith("+")}
    excluded = {item[1:] for item in items if item.startswith("-")}
    if excluded & labels or required - labels:
        return False
    if not plain:
        return True
    return "all" in plain or bool(plain & labels)


# ---------------------------------------------------------------------------
# Alert counters and link details
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class AlertSummary:
    """A device's `alerts` field: "<on>/<all> <critical>/<high>/<medium>/<low>"."""

    on: int
    total: int
    critical: int
    high: int
    medium: int
    low: int


def parse_alert_summary(value: Any) -> AlertSummary | None:
    """Parse e.g. "0/11 1/7/3/0" (0 of 11 matching rules active; event alerts never are)."""
    numbers = [int(n) for n in re.findall(r"\d+", str(value or ""))]
    if len(numbers) != 6:
        return None
    return AlertSummary(*numbers)


@dataclass(frozen=True)
class PortEnd:
    """One end of a physical link between two layout nodes."""

    interface: str
    detected: bool
    poe: str | None = None
    tx: str | None = None
    rx: str | None = None


@dataclass(frozen=True)
class PortLink:
    """A detected interface pair, e.g. ether2 -- ether1."""

    a: PortEnd
    b: PortEnd


_PORT_PAIR = re.compile(
    r"(\*?)([^\s(),*]+)\(([^)]*)\)\s*--\s*(\*?)([^\s(),*]+)\(([^)]*)\)"
)


def _port_end(star: str, name: str, attrs: str) -> PortEnd:
    values = dict(
        item.split("=", 1) for item in attrs.split(",") if "=" in item
    )
    return PortEnd(
        interface=name,
        detected=bool(star),
        poe=values.get("poe") or None,
        tx=values.get("tx") or None,
        rx=values.get("rx") or None,
    )


_RECORD_START = re.compile(r"^\s*(\*[0-9A-Fa-f]+)\s", re.M)
# "alerts=0/12 0/9/3/0", tolerating a line break at the space.
_ALERTS_FIELD = re.compile(r"alerts=(\d+/\d+)\s*(\d+/\d+/\d+/\d+)")


def _console_records(text: str) -> dict[str, str]:
    """Split `print detail show-ids` output into records keyed by id.

    Long values wrap onto indented continuation lines; the line breaks and
    indentation are dropped so wrapped values read as one token again.
    """
    starts = list(_RECORD_START.finditer(text))
    return {
        match.group(1): re.sub(r"\s*\r?\n\s*", "", text[match.end() : (starts[i + 1].start() if i + 1 < len(starts) else len(text))])
        for i, match in enumerate(starts)
    }


def parse_link_details(text: str) -> dict[str, str]:
    """Map link ids to their `links` value from console `print detail show-ids`.

    REST omits this computed field, so it is read from the console output.
    `links` is the record's last field and holds no spaces, so the joined
    record restores it exactly.
    """
    out: dict[str, str] = {}
    for link_id, record in _console_records(text).items():
        pos = record.rfind("links=")
        if pos != -1 and record[pos + 6 :].strip():
            out[link_id] = record[pos + 6 :].strip()
    return out


def parse_device_alerts(text: str) -> dict[str, str]:
    """Map device ids to their `alerts` counters from console `print detail show-ids`.

    Like `links`, the per-device alert summary is computed on print and never
    returned over REST, not even as a requested property.
    """
    out: dict[str, str] = {}
    for device_id, record in _console_records(text).items():
        if match := _ALERTS_FIELD.search(record):
            out[device_id] = f"{match.group(1)} {match.group(2)}"
    return out


def parse_links(value: Any) -> list[PortLink]:
    """Parse a link's `links` field.

    Example: "*ether2(poe=powered-on,tx=215.9KiB,rx=7.5MiB)--*ether1(,tx=7.2MiB,rx=126.9KiB)"
    """
    return [
        PortLink(_port_end(*m[0:3]), _port_end(*m[3:6]))
        for m in _PORT_PAIR.findall(str(value or ""))
    ]


# ---------------------------------------------------------------------------
# Product catalog (photos, names and port counts)
# ---------------------------------------------------------------------------


def _product_key(text: str | None) -> str:
    """Compare names loosely: case, punctuation and ^2/³-style superscripts."""
    text = (text or "").lower().replace("^", "").replace("³", "3").replace("²", "2")
    return re.sub(r"[^a-z0-9+]", "", text)


# Catalog port counts by parameter name, fastest Ethernet first: RouterOS
# numbers the multi-gigabit ports before the gigabit ones (ether1 is the
# 2.5G port of an RB5009 or a hAP ax³). The "... with PoE-out" and
# "... with Reverse PoE" counts describe some of these same ports.
_ETHER_PARAMS = (
    (re.compile(r"^number of 1g/2\.5g/5g/10g ethernet ports$"), "10G"),
    (re.compile(r"^number of 2\.5g ethernet ports$"), "2.5G"),
    (re.compile(r"^10/100/1000 ethernet ports$"), "1G"),
    (re.compile(r"^10/100 ethernet ports$"), "100M"),
)
# Cages in the order they sit on a front panel, left to right.
_CAGE_PARAMS = (
    (re.compile(r"^sfp ports$"), "sfp"),
    (re.compile(r"^sfp\+ ports$"), "sfp+"),
    (re.compile(r"combo"), "combo"),
    (re.compile(r"\bsfp28 ports$"), "sfp28"),
    (re.compile(r"\bsfp56 ports$"), "sfp56"),
    (re.compile(r"\bqsfp\+ ports$"), "qsfp+"),
    (re.compile(r"\bqsfp28 ports$"), "qsfp28"),
    (re.compile(r"\bqsfp56 ports$"), "qsfp56"),
    (re.compile(r"\bqsfp56-dd ports$"), "qsfp56-dd"),
)
_POE_RANGE = re.compile(r"ether\s*(\d+)(?:\s*-\s*(?:ether\s*)?(\d+))?", re.IGNORECASE)


def _leading_int(value: Any) -> int:
    match = re.match(r"\s*(\d+)", str(value or ""))
    return int(match.group(1)) if match else 0


def port_spec(parameters: Any) -> dict[str, Any] | None:
    """The front-panel ports a catalog entry lists, for drawing the device.

    `ether` is `[speed, count]` groups in ether-number order, `mgmt` a lone
    10/100 management port numbered after them (`ether49` on a CRS354, `ether1`
    on an all-fiber switch), `cages` the SFP/QSFP groups and `poe_out` the
    ether numbers that can power a device, as `[first, last]` ranges.
    """
    ether: dict[str, int] = {}
    cages: dict[str, int] = {}
    poe_out: list[list[int]] = []
    for param in parameters if isinstance(parameters, list) else []:
        if not isinstance(param, dict):
            continue
        name = str(param.get("name") or "").strip().lower()
        data = param.get("data")
        if name == "poe-out ports":
            for first, last in _POE_RANGE.findall(str(data or "")):
                poe_out.append([int(first), int(last or first)])
            continue
        if "poe" in name:
            continue
        for pattern, speed in _ETHER_PARAMS:
            if pattern.search(name) and (count := _leading_int(data)):
                ether[speed] = ether.get(speed, 0) + count
                break
        else:
            for pattern, kind in _CAGE_PARAMS:
                if pattern.search(name) and (count := _leading_int(data)):
                    cages[kind] = cages.get(kind, 0) + count
                    break
    groups = [[speed, ether[speed]] for _, speed in _ETHER_PARAMS if speed in ether]
    mgmt = 0
    # One 10/100 port next to many faster ones is the management port.
    if ether.get("100M") == 1 and sum(ether.values()) - 1 + sum(cages.values()) >= 4:
        groups = [g for g in groups if g[0] != "100M"]
        mgmt = 1
    if not groups and not cages and not mgmt:
        return None
    return {
        "ether": groups,
        "mgmt": mgmt,
        "cages": [[kind, cages[kind]] for _, kind in _CAGE_PARAMS if kind in cages],
        "poe_out": sorted(poe_out),
    }


def compact_product(item: dict[str, Any]) -> dict[str, Any] | None:
    images = item.get("images") or {}
    small = [u for u in images.get("small") or [] if isinstance(u, str)]
    large = [u for u in images.get("large") or [] if isinstance(u, str)]
    code = item.get("product_code")
    if not code or not (small or large):
        return None
    return {
        "code": str(code),
        "name": str(item.get("product_name") or code),
        "status": item.get("product_status"),
        "url": item.get("url"),
        "image": (small or large)[0],
        "image_large": (large or small)[0],
        "ports": port_spec(item.get("parameters")),
    }


def match_product(products: list[dict[str, Any]], board: str | None, model_code: str | None) -> dict[str, Any] | None:
    """The catalog entry for a device: its product code, else its board name.

    Board names are often the code without a variant suffix
    ("RB5009UPr+S+" for "RB5009UPr+S+IN"), so they match as a prefix; the
    shortest such code wins. The catalog also lists discontinued products
    (status "Archived"); a board name only falls back to them when no current
    product fits, so an old model never takes over a current one's match.
    """
    if model_code:
        exact = [p for p in products if p["code"] == model_code]
        if exact:
            return exact[0]
    key = _product_key(board)
    if not key:
        return None
    current = [p for p in products if str(p.get("status") or "").lower() != "archived"]
    archived = [p for p in products if str(p.get("status") or "").lower() == "archived"]
    return _match_board(current, key) or _match_board(archived, key)


def _match_board(products: list[dict[str, Any]], key: str) -> dict[str, Any] | None:
    """A product whose name is the board name, else whose code starts with it."""
    by_name = [p for p in products if _product_key(p["name"]) == key]
    if by_name:
        return by_name[0]
    prefixed = [p for p in products if _product_key(p["code"]).startswith(key)]
    if not prefixed:
        return None
    best = min(prefixed, key=lambda p: len(p["code"]))
    # Several variants (e.g. kits with different modems) share the board name:
    # the photo fits, but the exact product name and code would be a guess.
    return {**best, "ambiguous": True} if len(prefixed) > 1 else best


# ---------------------------------------------------------------------------
# Records
# ---------------------------------------------------------------------------

_ARCHES = {"arm", "arm64", "mipsbe", "mmips", "smips", "tile", "ppc", "x86", "x86_64"}


def _flag(raw: dict[str, Any], *names: str) -> bool:
    return any(to_bool(raw.get(name)) for name in names)


@dataclass
class CmrDevice:
    """One device managed by the controller (`/cmr/device`)."""

    rest_id: str
    identity: str
    serial: str | None
    board: str | None
    version: str | None
    available_version: str | None
    minimum_version: str | None
    channel: str | None
    upgrade_rule: str | None
    address: str | None
    state: str | None
    labels: list[str]
    auto_labels: list[str]
    packages: list[str]
    uptime: int | None
    connected_time: int | None
    disconnected_since: str | None
    controller: bool
    connected: bool
    upgrade_flag: bool
    # P: the controller must approve the pairing; p: the device must.
    pending: bool
    remote_pending: bool
    inactive: bool
    stale: bool
    alerts: AlertSummary | None
    raw: dict[str, Any] = field(repr=False)

    @classmethod
    def from_rest(cls, raw: dict[str, Any]) -> CmrDevice:
        """Build from one `/rest/cmr/device` item."""
        controller = _flag(raw, "controller", "L")
        return cls(
            rest_id=str(raw.get(".id", "")),
            identity=str(raw.get("identity") or raw.get("peer") or raw.get(".id")),
            serial=raw.get("serial") or None,
            board=raw.get("board") or None,
            version=raw.get("version") or None,
            available_version=raw.get("available-version") or None,
            minimum_version=raw.get("minimum-version") or None,
            channel=raw.get("channel") or None,
            upgrade_rule=raw.get("upgrade-rule") or None,
            address=raw.get("address") or None,
            state=raw.get("state") or None,
            labels=split_list(raw.get("labels")),
            auto_labels=split_list(raw.get("auto-labels")),
            packages=split_list(raw.get("packages")),
            uptime=parse_duration(raw.get("uptime")),
            connected_time=parse_duration(raw.get("connected-time")),
            disconnected_since=raw.get("disconnected-since") or None,
            # The controller is always reachable even though it isn't flagged C.
            controller=controller,
            connected=controller or _flag(raw, "connected", "C"),
            upgrade_flag=_flag(raw, "upgrade-available", "U"),
            pending=_flag(raw, "pending", "P"),
            remote_pending=_flag(raw, "remote-pending", "p"),
            inactive=_flag(raw, "inactive", "I"),
            stale=_flag(raw, "stale", "S"),
            alerts=parse_alert_summary(raw.get("alerts")),
            raw=raw,
        )

    @property
    def key(self) -> str:
        """Stable identifier: the serial, or the identity before pairing."""
        return self.serial or f"identity:{self.identity}"

    @property
    def arch(self) -> str | None:
        return next((label for label in self.auto_labels if label in _ARCHES), None)

    @property
    def model_code(self) -> str | None:
        """Product code from auto-labels, e.g. C53UiG+5HPaxD2HPaxD."""
        known = {self.identity, self.board, self.address, self.arch}
        return next((label for label in self.auto_labels if label not in known), None)

    @property
    def unpaired(self) -> bool:
        """Not yet managed: someone still has to approve the pairing."""
        return self.pending or self.remote_pending

    def matches_labels(self, selector: Any) -> bool:
        """Whether a rule's or job's `labels` selector covers this device.

        User labels, auto-labels and the identity (a single-device job's
        selector) all count, with the controller's `+`/`-`/`all` grammar.
        """
        return selector_matches(selector, {self.identity, *self.labels, *self.auto_labels} - {None})

    @property
    def update_available(self) -> bool:
        return is_newer(self.available_version, self.version)

    @property
    def would_downgrade(self) -> bool:
        """The channel offers a different but older version (controller bug B9).

        Running an upgrade rule would move the device to that older version.
        """
        return bool(
            self.available_version
            and self.version
            and self.available_version != self.version
            and not is_newer(self.available_version, self.version)
        )


# Event conditions (CMR guide, "Alert rules"): a rule with one of them runs its
# actions for every occurrence and never stays active, so it never adds to
# `devices-on` and `show-devices` never lists a device for it. Rules with only
# state conditions (cpu/mem/hdd/health thresholds, `connected`,
# `disconnected-more-than`, `upgrade-available`) stay active while they match.
EVENT_CONDITIONS = (
    "interface-change", "upgrade-done", "upgrade-job-done", "rebooted",
    "unpaired-device-connected", "log-topics", "log-regex",
)


def _condition_set(value: Any) -> bool:
    """An event condition is on unless it is absent or an explicit no."""
    return value not in (None, "") and str(value).strip().lower() not in ("false", "no")


@dataclass
class CmrAlertRule:
    """An alert rule (`/cmr/alert`)."""

    rest_id: str
    name: str
    comment: str | None
    labels: list[str]
    severity: str
    categories: list[str]
    devices: int
    devices_on: int
    fired: int
    action_failures: int
    disabled: bool
    webhook_url: str | None
    raw: dict[str, Any] = field(repr=False)

    @classmethod
    def from_rest(cls, raw: dict[str, Any]) -> CmrAlertRule:
        return cls(
            rest_id=str(raw.get(".id", "")),
            name=str(raw.get("name") or raw.get(".id")),
            comment=raw.get("comment") or None,
            labels=split_list(raw.get("labels")),
            severity=raw.get("severity") or "medium",
            categories=split_list(raw.get("category")),
            devices=to_int(raw.get("devices")) or 0,
            devices_on=to_int(raw.get("devices-on")) or 0,
            fired=to_int(raw.get("fired")) or 0,
            action_failures=to_int(raw.get("action-failures")) or 0,
            disabled=to_bool(raw.get("disabled")),
            webhook_url=raw.get("action.http-url") or None,
            raw=raw,
        )

    @property
    def kind(self) -> str:
        """`state` (stays active while it matches) or `event` (fires per occurrence)."""
        return "event" if any(_condition_set(self.raw.get(name)) for name in EVENT_CONDITIONS) else "state"

    @property
    def scope(self) -> str:
        """`system` for a finished upgrade job (no device context), else `device`."""
        return "system" if _condition_set(self.raw.get("upgrade-job-done")) else "device"


@dataclass
class CmrLayout:
    """A topology layout (`/cmr/layout`)."""

    rest_id: str
    name: str
    comment: str | None
    background: str | None
    scale: str | None

    @classmethod
    def from_rest(cls, raw: dict[str, Any]) -> CmrLayout:
        return cls(
            rest_id=str(raw.get(".id", "")),
            name=str(raw.get("name") or raw.get(".id")),
            comment=raw.get("comment") or None,
            background=raw.get("file") or None,
            scale=raw.get("scale") or None,
        )

    @property
    def scale_percent(self) -> int:
        """The picture's scale: 10..1000 %, 100 when unset."""
        try:
            return min(1000, max(10, int(str(self.scale))))
        except ValueError:
            return 100


@dataclass
class CmrNode:
    """A node on a layout: a device, or a link to another layout."""

    rest_id: str
    name: str
    layout: str
    device_ref: str | None
    target_layout: str | None
    x: int | None
    y: int | None

    @classmethod
    def from_rest(cls, raw: dict[str, Any]) -> CmrNode:
        return cls(
            rest_id=str(raw.get(".id", "")),
            name=str(raw.get("name") or raw.get(".id")),
            layout=str(raw.get("layout") or ""),
            device_ref=raw.get("device") or None,
            target_layout=raw.get("target-layout") or None,
            x=signed32(raw.get("x")),
            y=signed32(raw.get("y")),
        )

    @property
    def device_identity(self) -> str | None:
        """Identity part of `device` ("Office-GW@192.0.2.1" -> "Office-GW")."""
        return self.device_ref.split("@", 1)[0] if self.device_ref else None


@dataclass
class CmrLink:
    """A drawn connection between two nodes of a layout."""

    rest_id: str
    layout: str
    node1: str
    node2: str
    comment: str | None
    ports: list[PortLink]

    @classmethod
    def from_rest(cls, raw: dict[str, Any]) -> CmrLink:
        return cls(
            rest_id=str(raw.get(".id", "")),
            layout=str(raw.get("layout") or ""),
            node1=str(raw.get("node1") or ""),
            node2=str(raw.get("node2") or ""),
            comment=raw.get("comment") or None,
            ports=parse_links(raw.get("links")),
        )


# ---------------------------------------------------------------------------
# CMR WiFi provisioning (`/cmr/wifi`, `/cmr/wifi/radio`)
# ---------------------------------------------------------------------------

# A band label in a WiFi item's `labels` selects the radios of one band; the
# other labels select devices, with the usual grammar.
WIFI_BANDS = {"2ghz": "2.4", "5ghz": "5", "6ghz": "6"}
# Never kept: REST returns the network passphrase in clear to a user with the
# `sensitive` policy (seen 2026-10-06), and raw responses end up in diagnostics.
_SECRET_FIELD = re.compile(r"passphrase|password", re.IGNORECASE)


def strip_secrets(item: Any) -> Any:
    """A REST item without its passphrase and password fields."""
    if not isinstance(item, dict):
        return item
    return {key: value for key, value in item.items() if not _SECRET_FIELD.search(key)}


def split_wifi_labels(selector: Any) -> tuple[list[str], list[str]]:
    """A WiFi item's `labels` as (device selector items, bands)."""
    devices: list[str] = []
    bands: list[str] = []
    for item in split_list(selector):
        band = WIFI_BANDS.get(item.lstrip("+-").lower())
        if band:
            bands.append(band)
        else:
            devices.append(item)
    return devices, bands


def wifi_targets(selector: list[str], devices: Any) -> list[CmrDevice]:
    """The devices a WiFi item applies to; without device labels, every device."""
    if not selector:
        return list(devices)
    joined = ",".join(selector)
    return [device for device in devices if device.matches_labels(joined)]


@dataclass(frozen=True)
class CmrWifiNetwork:
    """A WiFi network CMR writes to the access points its labels select."""

    rest_id: str
    ssid: str | None
    comment: str | None
    disabled: bool
    selector: list[str]
    bands: list[str]
    mode: str | None
    vlan_id: int | None
    hidden: bool
    authentication: list[str]
    encryption: list[str]
    fast_roaming: bool
    mlo: bool
    max_clients: int | None

    @classmethod
    def from_rest(cls, raw: dict[str, Any]) -> CmrWifiNetwork:
        selector, bands = split_wifi_labels(raw.get("labels"))
        return cls(
            rest_id=str(raw.get(".id", "")),
            ssid=raw.get("ssid") or None,
            comment=raw.get("comment") or None,
            disabled=to_bool(raw.get("disabled")),
            selector=selector,
            bands=bands,
            mode=raw.get("mode") or None,
            vlan_id=to_int(raw.get("vlan-id")),
            hidden=to_bool(raw.get("hide-ssid")),
            authentication=split_list(raw.get("security.authentication-types")),
            encryption=split_list(raw.get("security.encryption")),
            fast_roaming=to_bool(raw.get("security.ft")),
            mlo=to_bool(raw.get("mlo")),
            max_clients=to_int(raw.get("max-clients")),
        )


@dataclass(frozen=True)
class CmrWifiRadio:
    """Radio settings CMR applies to the radios its labels select."""

    rest_id: str
    comment: str | None
    disabled: bool
    selector: list[str]
    bands: list[str]
    band: str | None
    frequency: str | None
    width: str | None
    country: str | None
    chains: str | None
    tx_power: int | None

    @classmethod
    def from_rest(cls, raw: dict[str, Any]) -> CmrWifiRadio:
        selector, bands = split_wifi_labels(raw.get("labels"))
        return cls(
            rest_id=str(raw.get(".id", "")),
            comment=raw.get("comment") or None,
            disabled=to_bool(raw.get("disabled")),
            selector=selector,
            bands=bands,
            band=raw.get("channel.band") or None,
            frequency=raw.get("channel.frequency") or None,
            width=raw.get("channel.width") or None,
            country=raw.get("configuration.country") or None,
            chains=raw.get("configuration.chains") or None,
            tx_power=to_int(raw.get("configuration.tx-power")),
        )


@dataclass
class CmrSnapshot:
    """Everything read from the controller in one poll."""

    settings: dict[str, Any]
    devices: dict[str, CmrDevice]
    alerts: dict[str, CmrAlertRule]
    upgrade_rules: list[dict[str, Any]]
    upgrade_jobs: list[dict[str, Any]]
    layouts: list[CmrLayout]
    nodes: list[CmrNode]
    links: list[CmrLink]
    wifi_networks: list[CmrWifiNetwork] = field(default_factory=list)
    wifi_radios: list[CmrWifiRadio] = field(default_factory=list)

    @property
    def controller(self) -> CmrDevice | None:
        return next((d for d in self.devices.values() if d.controller), None)

    def device_by_identity(self, identity: str | None) -> CmrDevice | None:
        if not identity:
            return None
        return next((d for d in self.devices.values() if d.identity == identity), None)

    def named_devices(self) -> list[tuple[str, str, str | None]]:
        """(key, identity, address) of every device, for `logparse.find_device`."""
        return [(d.key, d.identity, d.address) for d in self.devices.values()]


def _items(value: Any) -> list[dict[str, Any]]:
    if isinstance(value, list):
        return [item for item in value if isinstance(item, dict)]
    if isinstance(value, dict):
        return [value]
    return []


def parse_snapshot(raw: dict[str, Any]) -> CmrSnapshot:
    """Turn the raw REST responses (keyed by menu path) into a snapshot."""
    devices: dict[str, CmrDevice] = {}
    for device in (CmrDevice.from_rest(item) for item in _items(raw.get("cmr/device"))):
        seen = devices.get(device.key)
        # A controller was seen with a stale second record for itself (same
        # serial, no L flag): keep the live one, whichever comes first.
        if seen is None or (device.controller, device.connected) >= (seen.controller, seen.connected):
            devices[device.key] = device
    alerts = [CmrAlertRule.from_rest(item) for item in _items(raw.get("cmr/alert"))]
    settings = raw.get("cmr")
    return CmrSnapshot(
        settings=settings if isinstance(settings, dict) else {},
        devices=devices,
        alerts={rule.rest_id: rule for rule in alerts},
        upgrade_rules=_items(raw.get("cmr/upgrade")),
        upgrade_jobs=_items(raw.get("cmr/upgrade/job")),
        layouts=[CmrLayout.from_rest(item) for item in _items(raw.get("cmr/layout"))],
        nodes=[CmrNode.from_rest(item) for item in _items(raw.get("cmr/layout/node"))],
        links=[CmrLink.from_rest(item) for item in _items(raw.get("cmr/layout/link"))],
        wifi_networks=[CmrWifiNetwork.from_rest(item) for item in _items(raw.get("cmr/wifi"))],
        wifi_radios=[CmrWifiRadio.from_rest(item) for item in _items(raw.get("cmr/wifi/radio"))],
    )


# ---------------------------------------------------------------------------
# Upgrade job coverage (`/cmr/upgrade/job/show-devices`)
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class JobDevice:
    """One device of an upgrade job, with CMR's own state and reason."""

    identity: str
    address: str | None
    state: str | None
    # CMR's reason, e.g. "no upgrade available" (which CMR counts as a failure).
    error: str | None
    current_version: str | None
    upgrade_version: str | None
    channel: str | None
    device_key: str | None = None


def parse_job_devices(rows: Any, snapshot: CmrSnapshot | None = None) -> list[JobDevice]:
    """Rows of `show-devices`; `device` is "identity@address" (the controller: identity alone)."""
    out = []
    for row in _items(rows):
        identity, at, address = str(row.get("device") or "").rpartition("@")
        if not at:
            identity, address = address, ""
        key = None
        if snapshot is not None:
            # Identities can repeat; the address tells such devices apart.
            same = [d for d in snapshot.devices.values() if d.identity == identity]
            match = next((d for d in same if address and d.address == address), same[0] if same else None)
            key = match.key if match else None
        out.append(
            JobDevice(
                identity=identity,
                address=address or None,
                state=row.get("state") or None,
                error=row.get("error") or None,
                current_version=row.get("current-version") or None,
                upgrade_version=row.get("upgrade-version") or None,
                channel=row.get("channel") or None,
                device_key=key,
            )
        )
    return out
