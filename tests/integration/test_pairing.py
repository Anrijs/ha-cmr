"""Devices waiting to be paired: Repair issues, the fix flow, the websocket command."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir

from custom_components.cmr.const import DOMAIN

from .conftest import FakeController

NEW_DEVICE = {
    ".id": "*42", "identity": "New-AP", "board": "wAP ax", "version": "7.90_ab12", "peer": "peer-new",
    "address": "192.0.2.77", "labels": "", "auto-labels": "192.0.2.77,arm,wAP ax,New-AP", "packages": "system",
    "connected": "true", "pending": "true", "serial": "S0000000042", "ids": "0" * 64,
}


def pairing_issue(hass: HomeAssistant, entry, key: str) -> ir.IssueEntry | None:
    return ir.async_get(hass).async_get_issue(DOMAIN, f"pairing_{entry.entry_id}_{key}")


async def test_pending_device_becomes_a_repair_issue(hass: HomeAssistant, controller: FakeController, make_entry) -> None:
    controller.devices.append(dict(NEW_DEVICE))
    entry = make_entry()  # actions not allowed
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    issue = pairing_issue(hass, entry, "S0000000042")
    assert issue and issue.translation_key == "pairing_pending" and issue.is_fixable is False
    assert issue.translation_placeholders == {"identity": "New-AP", "board": "wAP ax"}

    # The device-side variant is a reminder only.
    controller.device("New-AP").pop("pending")
    controller.device("New-AP")["remote-pending"] = "true"
    await entry.runtime_data.async_refresh()
    await hass.async_block_till_done()
    issue = pairing_issue(hass, entry, "S0000000042")
    assert issue and issue.translation_key == "pairing_remote" and issue.is_fixable is False

    # Paired: the issue is gone.
    controller.device("New-AP").pop("remote-pending")
    await entry.runtime_data.async_refresh()
    await hass.async_block_till_done()
    assert pairing_issue(hass, entry, "S0000000042") is None


async def test_fix_flow_pairs_the_device(hass: HomeAssistant, controller: FakeController, make_entry, hass_client) -> None:
    controller.devices.append(dict(NEW_DEVICE))
    entry = make_entry(allow_upgrades=True)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    issue = pairing_issue(hass, entry, "S0000000042")
    assert issue and issue.is_fixable is True

    client = await hass_client()
    response = await client.post("/api/repairs/issues/fix", json={"handler": DOMAIN, "issue_id": issue.issue_id})
    assert response.status == 200
    flow = await response.json()
    assert flow["type"] == "form" and flow["step_id"] == "confirm"
    assert flow["description_placeholders"]["identity"] == "New-AP"

    response = await client.post(f"/api/repairs/issues/fix/{flow['flow_id']}", json={})
    assert response.status == 200
    result = await response.json()
    assert result["type"] == "create_entry"
    assert ("POST", "cmr/device/pair", {"numbers": "*42"}) in controller.calls
    await hass.async_block_till_done()
    assert pairing_issue(hass, entry, "S0000000042") is None
    assert entry.runtime_data.data.devices["S0000000042"].pending is False


async def test_websocket_pair(hass: HomeAssistant, controller: FakeController, make_entry, hass_ws_client) -> None:
    controller.devices.append(dict(NEW_DEVICE))
    entry = make_entry(allow_upgrades=True)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    client = await hass_ws_client(hass)

    await client.send_json({"id": 1, "type": "cmr/pair", "entry_id": entry.entry_id, "device_key": "S0000000001"})
    reply = await client.receive_json()
    assert not reply["success"] and reply["error"]["code"] == "not_pending"

    await client.send_json(
        {"id": 2, "type": "cmr/pair", "entry_id": entry.entry_id, "device_key": "S0000000042", "username": "admin", "password": "pw"}
    )
    reply = await client.receive_json()
    assert reply["success"] and reply["result"] == {"device_key": "S0000000042"}
    assert ("POST", "cmr/device/pair", {"numbers": "*42", "username": "admin", "password": "pw"}) in controller.calls


async def test_websocket_pair_refused_without_actions(hass: HomeAssistant, controller: FakeController, entry, hass_ws_client) -> None:
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "cmr/pair", "entry_id": entry.entry_id, "device_key": "S0000000001"})
    reply = await client.receive_json()
    assert not reply["success"] and reply["error"]["code"] == "not_allowed"
