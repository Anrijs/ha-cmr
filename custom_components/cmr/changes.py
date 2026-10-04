"""Events from what changed between two polls of the controller.

Pure Python (no Home Assistant imports), so every kind of change is tested.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any

from .models import CmrDevice, CmrSnapshot, is_newer

# Alert rule severity -> timeline severity.
ALERT_SEVERITY = {"critical": "error", "high": "warning", "medium": "notice", "low": "info"}


def diff_snapshots(old: CmrSnapshot, new: CmrSnapshot, now: datetime) -> list[dict[str, Any]]:
    """Devices, alert rules and upgrade jobs that changed since the last poll."""
    events: list[dict[str, Any]] = []
    controller_key = new.controller.key if new.controller else None

    # Positional-only, so event data may use any key (e.g. a rule's "severity").
    def add(
        category: str, severity: str, title: str, device: CmrDevice | None = None, /, **data: Any
    ) -> None:
        events.append(
            {
                "time": now,
                "source": "fleet",
                "category": category,
                "severity": severity,
                "title": title,
                "message": "",
                "data": data,
                "device_key": device.key if device else controller_key,
                "device_name": device.identity if device else None,
            }
        )

    for key, device in new.devices.items():
        before = old.devices.get(key)
        label = device.identity
        if before is None:
            if device.pending:
                add("device", "notice", f"{label} is waiting to be paired", device, event="pending")
            else:
                add("device", "notice", f"New device {label} ({device.board or 'unknown model'})", device, event="added")
            continue
        if before.pending and not device.pending:
            add("device", "notice", f"{label} was paired", device, event="paired")
        if before.connected and not device.connected:
            add("device", "warning", f"{label} disconnected from the controller", device, event="disconnected")
        elif not before.connected and device.connected:
            add("device", "info", f"{label} is back online", device, event="connected")
        if device.uptime is not None and before.uptime is not None and device.uptime + 60 < before.uptime:
            add("device", "notice", f"{label} rebooted", device, event="rebooted", uptime=device.uptime)
        if device.version and before.version and device.version != before.version:
            verb = "upgraded" if is_newer(device.version, before.version) else "changed"
            add(
                "upgrade", "notice", f"{label} {verb} from {before.version} to {device.version}",
                device, event="version", old=before.version, new=device.version,
            )
    for key, device in old.devices.items():
        if key not in new.devices:
            add("device", "warning", f"{device.identity} removed from the controller", device, event="removed")

    for rule_id, rule in new.alerts.items():
        before = old.alerts.get(rule_id)
        if before is None:
            continue
        if not before.devices_on and rule.devices_on:
            add(
                "alert", ALERT_SEVERITY.get(rule.severity, "notice"),
                f"Alert {rule.name} fired on {rule.devices_on} device(s)",
                event="fired", rule=rule.name, rule_id=rule_id, severity=rule.severity,
            )
        elif before.devices_on and not rule.devices_on:
            add("alert", "info", f"Alert {rule.name} cleared", event="cleared", rule=rule.name, rule_id=rule_id)
        if rule.action_failures > before.action_failures:
            add(
                "alert", "warning", f"Alert {rule.name}: action failed", event="action_failed",
                rule=rule.name, rule_id=rule_id, failures=rule.action_failures,
            )

    old_jobs = {str(job.get(".id")): job for job in old.upgrade_jobs}
    for job in new.upgrade_jobs:
        job_id = str(job.get(".id"))
        target = job.get("channel") or "?"
        labels = job.get("labels") or "all"
        before = old_jobs.get(job_id)
        if before is None:
            add(
                "upgrade", "notice", f"Upgrade job to {target} for {labels}: {job.get('state', 'created')}",
                event="job", job_id=job_id, state=job.get("state"),
            )
        elif before.get("state") != job.get("state"):
            success = job.get("success") or ""
            ok, _, total = success.partition("/")
            failed = ok.isdigit() and total.isdigit() and int(ok) < int(total)
            add(
                "upgrade", "warning" if failed else "notice",
                f"Upgrade job to {target} for {labels}: {job.get('state')}"
                + (f" ({success} succeeded)" if success else ""),
                event="job", job_id=job_id, state=job.get("state"), success=success,
            )
    return events
