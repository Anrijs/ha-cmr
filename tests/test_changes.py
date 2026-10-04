"""Tests for events from changes between polls (no Home Assistant needed)."""

from datetime import datetime
import importlib
from pathlib import Path
import sys
import types

# Load the integration's pure modules as a package without running __init__.py.
_pkg = types.ModuleType("cmrpkg")
_pkg.__path__ = [str(Path(__file__).parents[1] / "custom_components" / "cmr")]
sys.modules.setdefault("cmrpkg", _pkg)
models = importlib.import_module("cmrpkg.models")
changes = importlib.import_module("cmrpkg.changes")

NOW = datetime(2026, 10, 4, 12, 0, 0)


def snapshot(devices=(), alerts=(), jobs=()):
    return models.parse_snapshot(
        {"cmr": {}, "cmr/device": list(devices), "cmr/alert": list(alerts), "cmr/upgrade/job": list(jobs)}
    )


CONTROLLER = {".id": "*1", "identity": "Core", "serial": "S1", "controller": "true", "uptime": "1d"}


def ap(**overrides):
    return {".id": "*2", "identity": "AP", "serial": "S2", "board": "wAP ax", "connected": "true",
            "uptime": "2d", "version": "7.40", **overrides}


def rule(**overrides):
    return {".id": "*9", "name": "cpu>95%", "severity": "high", "devices": "3", "devices-on": "0",
            "fired": "0", "action-failures": "0", **overrides}


def kinds(events):
    return [(e["category"], e["data"].get("event")) for e in events]


def test_alert_rule_firing_keeps_rule_severity():
    # Regression: a rule's "severity" in the event data clashed with the
    # event's own severity argument and raised TypeError.
    events = changes.diff_snapshots(
        snapshot([CONTROLLER], [rule()]), snapshot([CONTROLLER], [rule(**{"devices-on": "2"})]), NOW
    )
    (event,) = events
    assert (event["category"], event["severity"], event["data"]["severity"]) == ("alert", "warning", "high")
    assert event["title"] == "Alert cpu>95% fired on 2 device(s)"
    assert event["device_key"] == "S1"  # fleet-level events belong to the controller


def test_alert_cleared_and_action_failed():
    events = changes.diff_snapshots(
        snapshot([CONTROLLER], [rule(**{"devices-on": "1"})]),
        snapshot([CONTROLLER], [rule(**{"action-failures": "1"})]),
        NOW,
    )
    assert kinds(events) == [("alert", "cleared"), ("alert", "action_failed")]


def test_device_lifecycle():
    old = snapshot([CONTROLLER, ap()])
    assert kinds(changes.diff_snapshots(old, snapshot([CONTROLLER, ap(connected="false")]), NOW)) == [
        ("device", "disconnected")
    ]
    assert kinds(changes.diff_snapshots(snapshot([CONTROLLER, ap(connected="false")]), old, NOW)) == [
        ("device", "connected")
    ]
    rebooted = changes.diff_snapshots(old, snapshot([CONTROLLER, ap(uptime="5m")]), NOW)
    assert kinds(rebooted) == [("device", "rebooted")] and rebooted[0]["device_name"] == "AP"
    upgraded = changes.diff_snapshots(old, snapshot([CONTROLLER, ap(version="7.40.1")]), NOW)
    assert kinds(upgraded) == [("upgrade", "version")] and "upgraded from 7.40 to 7.40.1" in upgraded[0]["title"]
    assert kinds(changes.diff_snapshots(snapshot([CONTROLLER]), old, NOW)) == [("device", "added")]
    assert kinds(changes.diff_snapshots(old, snapshot([CONTROLLER]), NOW)) == [("device", "removed")]
    pending = snapshot([CONTROLLER, ap(**{"remote-pending": "true", "connected": "false"})])
    assert kinds(changes.diff_snapshots(snapshot([CONTROLLER]), pending, NOW)) == [("device", "pending")]


def test_upgrade_jobs():
    job = {".id": "*5", "channel": "7.41", "labels": "ap", "state": "running"}
    started = changes.diff_snapshots(snapshot([CONTROLLER]), snapshot([CONTROLLER], jobs=[job]), NOW)
    assert kinds(started) == [("upgrade", "job")]
    done = changes.diff_snapshots(
        snapshot([CONTROLLER], jobs=[job]),
        snapshot([CONTROLLER], jobs=[{**job, "state": "done", "success": "1/2"}]),
        NOW,
    )
    assert done[0]["severity"] == "warning" and "(1/2 succeeded)" in done[0]["title"]


def test_no_changes_no_events():
    old = snapshot([CONTROLLER, ap()], [rule()])
    assert changes.diff_snapshots(old, snapshot([CONTROLLER, ap()], [rule()]), NOW) == []
