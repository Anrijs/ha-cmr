"""Which devices an alert rule fires on: the console lookup and its websocket command."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from .conftest import FakeController


def _show_devices_calls(controller: FakeController) -> int:
    return sum(1 for _, path, payload in controller.calls if path == "execute" and "show-devices" in (payload or {}).get("script", ""))


async def test_alert_devices_are_read_from_the_console_and_cached(hass: HomeAssistant, controller: FakeController, entry, hass_ws_client) -> None:
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "cmr/alert_devices", "entry_id": entry.entry_id, "rule_id": "*1"})
    reply = await client.receive_json()
    assert reply["success"], reply
    # Device ids from the console are mapped to the keys the cards use (serials).
    assert reply["result"] == {"devices": ["S0000000006"]}
    script = next(p["script"] for _, path, p in controller.calls if path == "execute" and "show-devices" in (p or {}).get("script", ""))
    assert "/cmr/alert/show-devices *1 on-only=yes as-value" in script

    # A second look within the poll interval is answered from the cache.
    await client.send_json({"id": 2, "type": "cmr/alert_devices", "entry_id": entry.entry_id, "rule_id": "*1"})
    assert (await client.receive_json())["result"] == {"devices": ["S0000000006"]}
    assert _show_devices_calls(controller) == 1

    # A rule firing nowhere is an empty list, not an error.
    await client.send_json({"id": 3, "type": "cmr/alert_devices", "entry_id": entry.entry_id, "rule_id": "*2"})
    assert (await client.receive_json())["result"] == {"devices": []}


async def test_alert_devices_unknown_rule(hass: HomeAssistant, controller: FakeController, entry, hass_ws_client) -> None:
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "cmr/alert_devices", "entry_id": entry.entry_id, "rule_id": "*FF"})
    reply = await client.receive_json()
    assert not reply["success"]
    assert reply["error"]["code"] == "not_found"
    # Nothing is run on the controller for a rule the snapshot doesn't know.
    assert _show_devices_calls(controller) == 0


async def test_alert_devices_without_console_rights(hass: HomeAssistant, controller: FakeController, make_entry, hass_ws_client) -> None:
    controller.console_ok = False
    entry = make_entry()
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "cmr/alert_devices", "entry_id": entry.entry_id, "rule_id": "*1"})
    reply = await client.receive_json()
    assert not reply["success"]
    assert reply["error"]["code"] == "unsupported"

    # The snapshot tells the cards not to offer the lookup.
    await client.send_json({"id": 2, "type": "cmr/subscribe", "entry_id": entry.entry_id})
    assert (await client.receive_json())["success"]
    snapshot = await client.receive_json()
    assert snapshot["event"]["entries"][0]["console"] is False


async def test_event_alert_has_no_active_devices(hass: HomeAssistant, controller: FakeController, entry, hass_ws_client) -> None:
    """An event alert (here: rebooted) is never active, so nothing is looked up."""
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "cmr/alert_devices", "entry_id": entry.entry_id, "rule_id": "*8"})
    reply = await client.receive_json()
    assert reply["success"] and reply["result"] == {"devices": []}
    assert _show_devices_calls(controller) == 0

    await client.send_json({"id": 2, "type": "cmr/subscribe", "entry_id": entry.entry_id})
    assert (await client.receive_json())["success"]
    rules = {r["name"]: r for r in (await client.receive_json())["event"]["entries"][0]["alerts"]}
    assert (rules["rebooted"]["kind"], rules["cpu>95%"]["kind"]) == ("event", "state")
