"""Loading an entry: devices, entities, websocket payload, diagnostics, unload."""

from __future__ import annotations

from datetime import UTC, datetime

from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er
from pytest_homeassistant_custom_component.components.diagnostics import get_diagnostics_for_config_entry

from custom_components.cmr.const import DOMAIN

from .conftest import FakeController

CONTROLLER = "S0000000001"
GATEWAY = "S0000000002"


def entity_id(hass: HomeAssistant, platform: str, unique_id: str) -> str:
    found = er.async_get(hass).async_get_entity_id(platform, DOMAIN, unique_id)
    assert found, f"no {platform} entity with unique id {unique_id}"
    return found


async def test_entry_loads_devices_and_entities(hass: HomeAssistant, entry, controller: FakeController) -> None:
    assert entry.state is ConfigEntryState.LOADED

    registry = dr.async_get(hass)
    devices = dr.async_entries_for_config_entry(registry, entry.entry_id)
    assert len(devices) == 7
    core = registry.async_get_device_by_identifier((DOMAIN, CONTROLLER), entry.entry_id)
    assert core and core.manufacturer == "ExampleVendor"
    assert core.model == "RB5009UPr+S+" and core.sw_version == "7.90_ab12"
    assert core.configuration_url == "https://192.0.2.254"
    gateway = registry.async_get_device_by_identifier((DOMAIN, GATEWAY), entry.entry_id)
    assert gateway and gateway.via_device_id == core.id
    assert gateway.configuration_url == "http://192.0.2.1"
    assert gateway.model_id is None  # no product code among its auto-labels
    coded = next(d for d in controller.devices if "C53UiG+5HPaxD2HPaxD" in d["auto-labels"])
    ap = registry.async_get_device_by_identifier((DOMAIN, coded["serial"]), entry.entry_id)
    assert ap and ap.model_id == "C53UiG+5HPaxD2HPaxD" and ap.model == "hAP ax^3"

    entities = er.async_entries_for_config_entry(er.async_get(hass), entry.entry_id)
    by_platform: dict[str, int] = {}
    for item in entities:
        by_platform[item.domain] = by_platform.get(item.domain, 0) + 1
    assert by_platform["update"] == 7
    assert by_platform["event"] == 1 + 7
    assert by_platform["button"] == 1  # upgrades are off by default
    # 7 × connected, the fleet trouble sensor, one per alert rule
    assert by_platform["binary_sensor"] == 7 + 1 + len(controller.data["cmr/alert"])

    connected = hass.states.get(entity_id(hass, "binary_sensor", f"{GATEWAY}_connected"))
    assert connected and connected.state == "on"
    assert connected.attributes["labels"] == ["house", "gw", "gateway"]
    assert hass.states.get(entity_id(hass, "sensor", f"{CONTROLLER}_devices")).state == "7"
    assert hass.states.get(entity_id(hass, "sensor", f"{CONTROLLER}_devices_online")).state == "7"


async def test_older_channel_version_is_not_an_update(hass: HomeAssistant, entry) -> None:
    """Controller bug B9: the channel offers 7.89rc1 to a device on 7.90_ab12."""
    state = hass.states.get(entity_id(hass, "update", f"{CONTROLLER}_update"))
    assert state and state.state == "off"
    assert state.attributes["installed_version"] == "7.90_ab12"
    assert state.attributes["latest_version"] == "7.90_ab12"
    assert "7.89rc1" in state.attributes["release_summary"]
    assert hass.states.get(entity_id(hass, "sensor", f"{CONTROLLER}_updates_available")).state == "0"


async def test_computed_fields_are_merged(hass: HomeAssistant, entry, controller: FakeController) -> None:
    """Alert counters and link ports only exist in the console's print output."""
    alerts = hass.states.get(entity_id(hass, "sensor", f"{CONTROLLER}_active_alerts"))
    assert alerts and alerts.state == "0" and alerts.attributes["matching_rules"] == 12
    firing = hass.states.get(entity_id(hass, "sensor", "S0000000006_active_alerts"))
    assert firing and firing.state == "1"
    snapshot = entry.runtime_data.data
    with_ports = [link for link in snapshot.links if link.ports]
    assert with_ports, "console link details were not merged"
    assert with_ports[0].ports[0].a.interface.startswith(("ether", "sfp"))
    scripts = {payload["script"] for method, path, payload in controller.calls if path == "execute"}
    assert scripts == {
        "/cmr/device/print detail show-ids without-paging",
        "/cmr/layout/link/print detail show-ids without-paging",
    }
    assert not any(path.endswith("/print") and ".proplist" in (payload or {}) for _, path, payload in controller.calls)


async def test_websocket_subscribe_payload(hass: HomeAssistant, entry, hass_ws_client) -> None:
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "cmr/subscribe"})
    assert (await client.receive_json())["success"]
    message = await client.receive_json()
    (payload,) = message["event"]["entries"]
    assert payload["controller_key"] == CONTROLLER
    assert payload["available"] is True
    assert len(payload["devices"]) == 7
    core = next(d for d in payload["devices"] if d["controller"])
    assert core["prerelease"] is True and core["update_available"] is False
    assert core["alerts"]["total"] > 0
    assert core["entities"]["update"] and core["entities"]["connected"]
    assert "role" not in core
    assert {layout["name"] for layout in payload["layouts"]} >= {"Overview", "Main"}
    assert any(link["ports"] for link in payload["links"])
    assert all(node["device_key"] for node in payload["nodes"] if not node["target_layout"])

    await client.send_json({"id": 2, "type": "cmr/events/subscribe"})
    assert (await client.receive_json())["success"]
    first = (await client.receive_json())["event"]
    assert first["reset"] is True
    categories = {event["category"] for event in first["events"]}
    assert {"link", "wifi", "security"} <= categories
    wifi = [event for event in first["events"] if event["category"] == "wifi"]
    # Two from the remote AP's wifi-logs, one from the controller's log; the
    # duplicate that both sources report is kept once.
    assert sorted(e["device_name"] for e in wifi) == ["Remote-AP", "Remote-AP", "Site-AP1"]
    remote = next(e for e in wifi if e["device_name"] == "Remote-AP" and e["data"]["event"] == "connected")
    assert remote["source"] == "wifi" and remote["data"]["bssid"] == "D0:EA:11:AE:17:FE"
    assert remote["device_key"] == "S0000000007"


async def test_diagnostics_redact_secrets(hass: HomeAssistant, entry, hass_client) -> None:
    diagnostics = await get_diagnostics_for_config_entry(hass, hass_client, entry)
    assert diagnostics["entry"]["data"]["password"] == "**REDACTED**"
    assert diagnostics["entry"]["data"]["webhook_id"] == "**REDACTED**"
    assert "secret-test-password" not in str(diagnostics)
    assert len(diagnostics["raw"]["cmr/device"]) == 7


async def test_unload(hass: HomeAssistant, entry) -> None:
    assert await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.NOT_LOADED
    assert hass.states.get(entity_id(hass, "update", f"{CONTROLLER}_update")).state == "unavailable"


async def test_scheduled_job_is_not_an_install_in_progress(hass: HomeAssistant, controller: FakeController, make_entry) -> None:
    ap = controller.device("Site-AP1")
    controller.data["cmr/upgrade/job"].append(
        {".id": "*20", "labels": "ap", "channel": "stable", "state": "scheduled", "schedule-time": "2026-12-01 00:00:00", "starts-in": "6d"}
    )
    # Home Assistant only reports an entity's own `in_progress` when it supports progress.
    entry = make_entry(allow_upgrades=True)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    update = entity_id(hass, "update", f"{ap['serial']}_update")
    assert hass.states.get(update).attributes["in_progress"] is False

    controller.data["cmr/upgrade/job"][-1]["state"] = "processing"
    await entry.runtime_data.async_refresh()
    await hass.async_block_till_done()
    assert hass.states.get(update).attributes["in_progress"] is True
    # A device outside the selector is untouched.
    gw = entity_id(hass, "update", f"{GATEWAY}_update")
    assert hass.states.get(gw).attributes["in_progress"] is False


async def test_shared_nat_address_gets_no_device_link(hass: HomeAssistant, controller: FakeController, make_entry) -> None:
    controller.device("Site-AP1")["address"] = "198.51.100.216"  # same as Remote-AP: both behind one NAT
    entry = make_entry()
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    registry = dr.async_get(hass)
    for identity in ("Site-AP1", "Remote-AP"):
        device = registry.async_get_device_by_identifier((DOMAIN, controller.device(identity)["serial"]), entry.entry_id)
        assert device and device.configuration_url is None
    gateway = registry.async_get_device_by_identifier((DOMAIN, GATEWAY), entry.entry_id)
    assert gateway and gateway.configuration_url == "http://192.0.2.1"


async def test_offline_issue_uses_the_controllers_timestamp(hass: HomeAssistant, controller: FakeController, make_entry) -> None:
    ap = controller.device("Site-AP2")
    ap["connected"] = "false"
    ap["disconnected-since"] = "2026-10-01 10:00:00"  # the fake clock runs at UTC
    entry = make_entry()
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    engine = entry.runtime_data.eventlog.engine
    (insight,) = [i for i in engine.active.values() if i.kind == "device_offline"]
    assert insight.device_key == ap["serial"]
    assert insight.since == datetime(2026, 10, 1, 10, 0, tzinfo=UTC)


async def test_console_not_allowed_still_loads(hass: HomeAssistant, controller: FakeController, make_entry) -> None:
    """A read-only user can't run console commands; cables just lose their ports."""
    controller.console_ok = False
    entry = make_entry()
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.LOADED
    assert all(not link.ports for link in entry.runtime_data.data.links)
    assert all(device.alerts is None for device in entry.runtime_data.data.devices.values())
    # Tried once, not on every poll.
    assert sum(path == "execute" for _, path, _ in controller.calls) == 1
