"""Layout editing through the real websocket validation and fake controller."""

from __future__ import annotations

import asyncio

import pytest

from custom_components.cmr.api import CmrApiError
from custom_components.cmr.layout_edit import node_revision
from custom_components.cmr.models import CmrNode


def move(controller, node_id="*4", x=-160, y=80):
    row = next(n for n in controller.data["cmr/layout/node"] if n[".id"] == node_id)
    return {"id": node_id, "revision": node_revision(CmrNode.from_rest(row)), "x": x, "y": y}


async def setup(hass, make_entry, hass_ws_client, **options):
    entry = make_entry(allow_upgrades=True, **options)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry, await hass_ws_client(hass)


async def send(client, entry, nodes, layout="Main", request_id=1):
    await client.send_json({"id": request_id, "type": "cmr/move_nodes", "entry_id": entry.entry_id, "layout": layout, "nodes": nodes})
    return await client.receive_json()


def patches(controller):
    return [(path, data) for method, path, data in controller.calls if method == "PATCH" and path.startswith("cmr/layout/node/")]


async def test_move_signed_coordinates_and_refresh(hass, controller, make_entry, hass_ws_client):
    entry, client = await setup(hass, make_entry, hass_ws_client)
    before = move(controller)
    reply = await send(client, entry, [before])
    assert reply["success"] and reply["result"]["failed"] == []
    assert patches(controller) == [("cmr/layout/node/*4", {"x": "-160", "y": "80"})]
    saved = reply["result"]["saved"][0]
    assert saved["revision"] != before["revision"]
    node = next(n for n in entry.runtime_data.data.nodes if n.rest_id == "*4")
    assert (node.x, node.y) == (-160, 80)
    assert saved["revision"] == node_revision(node)


async def test_move_unplaced_and_site_nodes(hass, controller, make_entry, hass_ws_client):
    row = controller.data["cmr/layout/node"][0]
    row.pop("x", None)
    row.pop("y", None)
    entry, client = await setup(hass, make_entry, hass_ws_client)
    reply = await send(client, entry, [move(controller, "*1", 0, -20)], "Overview")
    assert reply["success"] and len(reply["result"]["saved"]) == 1
    assert row["target-layout"] == "Main"


async def test_early_controller_requires_unsigned_writes(hass, controller, make_entry, hass_ws_client, monkeypatch):
    entry, client = await setup(hass, make_entry, hass_ws_client)
    original = controller._patch

    def patch(path, payload):
        if any(int(value) < 0 for value in payload.values()):
            raise CmrApiError("bad request", "Bad Request value of x out of range (0..4294967295)")
        return original(path, payload)

    monkeypatch.setattr(controller, "_patch", patch)
    reply = await send(client, entry, [move(controller, x=-160, y=-20)])
    assert reply["success"] and reply["result"]["failed"] == []
    assert (reply["result"]["saved"][0]["x"], reply["result"]["saved"][0]["y"]) == (-160, -20)
    assert patches(controller)[1][1] == {"x": str(2**32 - 160), "y": str(2**32 - 20)}


@pytest.mark.parametrize("change", ["position", "name", "membership", "device", "deleted"])
async def test_stale_node_rejects_whole_batch(hass, controller, make_entry, hass_ws_client, change):
    entry, client = await setup(hass, make_entry, hass_ws_client)
    changes = [move(controller, "*5"), move(controller)]
    row = next(n for n in controller.data["cmr/layout/node"] if n[".id"] == "*4")
    if change == "deleted":
        controller.data["cmr/layout/node"].remove(row)
    else:
        row[{"position": "x", "name": "name", "membership": "layout", "device": "device"}[change]] = "500" if change == "position" else "Changed"
    reply = await send(client, entry, changes)
    assert not reply["success"] and reply["error"]["code"] == "stale_layout"
    assert patches(controller) == []
    refreshed = next((n for n in entry.runtime_data.data.nodes if n.rest_id == "*4"), None)
    assert refreshed == (None if change == "deleted" else CmrNode.from_rest(row))


@pytest.mark.parametrize("case", ["duplicate", "cross_layout", "missing_layout", "missing_node"])
async def test_invalid_targets_write_nothing(hass, controller, make_entry, hass_ws_client, case):
    entry, client = await setup(hass, make_entry, hass_ws_client)
    changes, layout = [move(controller)], "Main"
    if case == "duplicate":
        changes *= 2
    elif case == "cross_layout":
        changes = [move(controller, "*1")]
    elif case == "missing_layout":
        layout = "Gone"
    else:
        changes[0]["id"] = "*FFFF"
    reply = await send(client, entry, changes, layout)
    assert not reply["success"]
    assert patches(controller) == []


@pytest.mark.parametrize("invalid", [True, 1.5, "12", None, 2**31, -(2**31) - 1])
async def test_invalid_coordinates_rejected(hass, controller, make_entry, hass_ws_client, invalid):
    entry, client = await setup(hass, make_entry, hass_ws_client)
    node = move(controller)
    node["x"] = invalid
    reply = await send(client, entry, [node])
    assert not reply["success"] and reply["error"]["code"] == "invalid_format"
    assert patches(controller) == []


async def test_actions_disabled(hass, controller, entry, hass_ws_client):
    client = await hass_ws_client(hass)
    reply = await send(client, entry, [move(controller)])
    assert not reply["success"] and reply["error"]["code"] == "not_allowed"
    assert patches(controller) == []


async def test_non_admin_denied(hass, controller, make_entry, hass_ws_client, hass_admin_user):
    entry, client = await setup(hass, make_entry, hass_ws_client)
    hass_admin_user.is_admin = False
    reply = await send(client, entry, [move(controller)])
    assert not reply["success"] and reply["error"]["code"] == "unauthorized"
    assert patches(controller) == []


async def test_partial_save_and_unsigned_readback(hass, controller, make_entry, hass_ws_client, monkeypatch):
    entry, client = await setup(hass, make_entry, hass_ws_client)
    original = controller._patch

    def patch(path, payload):
        if path.endswith("/*5"):
            raise CmrApiError("refused", "write refused")
        result = original(path, payload)
        result["x"] = str(int(result["x"]) % 2**32)
        return result

    monkeypatch.setattr(controller, "_patch", patch)
    reply = await send(client, entry, [move(controller), move(controller, "*5")])
    assert reply["success"]
    assert [(n["id"], n["x"]) for n in reply["result"]["saved"]] == [("*4", -160)]
    assert reply["result"]["failed"] == [{"id": "*5", "message": "write refused"}]
    assert next(n for n in entry.runtime_data.data.nodes if n.rest_id == "*4").x == -160


async def test_timeout_after_write_verified_by_readback(hass, controller, make_entry, hass_ws_client, monkeypatch):
    entry, client = await setup(hass, make_entry, hass_ws_client)
    original = controller._patch

    def patch(path, payload):
        original(path, payload)
        raise CmrApiError("timeout", "Timed out")

    monkeypatch.setattr(controller, "_patch", patch)
    reply = await send(client, entry, [move(controller)])
    assert reply["success"] and not reply["result"]["failed"]
    assert len(reply["result"]["saved"]) == 1


async def test_readback_mismatch_reported(hass, controller, make_entry, hass_ws_client, monkeypatch):
    entry, client = await setup(hass, make_entry, hass_ws_client)
    monkeypatch.setattr(controller, "_patch", lambda path, payload: {})
    reply = await send(client, entry, [move(controller)])
    assert reply["success"] and not reply["result"]["saved"]
    assert reply["result"]["failed"][0]["id"] == "*4"


async def test_concurrent_saves_are_rejected_while_busy(hass, controller, make_entry, hass_ws_client, monkeypatch):
    entry, client = await setup(hass, make_entry, hass_ws_client)
    second = await hass_ws_client(hass)
    entered, release = asyncio.Event(), asyncio.Event()
    original = controller.request

    async def request(method, path, payload=None):
        if method == "PATCH":
            entered.set()
            await release.wait()
        return await original(method, path, payload)

    monkeypatch.setattr(controller, "request", request)
    first = asyncio.create_task(send(client, entry, [move(controller)]))
    await asyncio.wait_for(entered.wait(), 2)
    try:
        reply = await send(second, entry, [move(controller, "*5")])
        assert not reply["success"] and reply["error"]["code"] == "layout_busy"
    finally:
        release.set()
    assert (await first)["success"]
    assert len(patches(controller)) == 1
