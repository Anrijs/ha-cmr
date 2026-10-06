"""Controller commands the cards run: layouts and upgrade jobs."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from .conftest import FakeController


async def test_rebuild_links(hass: HomeAssistant, controller: FakeController, make_entry, hass_ws_client) -> None:
    entry = make_entry(allow_upgrades=True)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    client = await hass_ws_client(hass)

    await client.send_json({"id": 1, "type": "cmr/rebuild_links", "entry_id": entry.entry_id, "layout": "Main"})
    reply = await client.receive_json()
    assert reply["success"] and reply["result"] == {"layout": "Main"}
    assert ("POST", "cmr/layout/rebuild-links", {"numbers": "*2"}) in controller.calls

    await client.send_json({"id": 2, "type": "cmr/rebuild_links", "entry_id": entry.entry_id, "layout": "Nowhere"})
    reply = await client.receive_json()
    assert not reply["success"] and reply["error"]["code"] == "no_layout"


async def test_rebuild_links_needs_actions(hass: HomeAssistant, controller: FakeController, entry, hass_ws_client) -> None:
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "cmr/rebuild_links", "entry_id": entry.entry_id, "layout": "Main"})
    reply = await client.receive_json()
    assert not reply["success"] and reply["error"]["code"] == "not_allowed"
    assert not any(path == "cmr/layout/rebuild-links" for _, path, _ in controller.calls)


SCHEDULED = {".id": "*9", "channel": "stable", "labels": "ap", "schedule-time": "2026-10-09 03:00:00",
             "starts-in": "2d16h", "state": "scheduled"}


async def test_job_devices(hass: HomeAssistant, controller: FakeController, entry, hass_ws_client) -> None:
    """Read-only, so no actions option needed; CMR's reason comes through as given."""
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "cmr/job_devices", "entry_id": entry.entry_id, "job_id": "*4"})
    reply = await client.receive_json()
    assert reply["success"]
    devices = reply["result"]["devices"]
    assert [(d["identity"], d["device_key"], d["state"], d["error"]) for d in devices] == [
        ("Site-AP2", "S0000000006", "done", None),
        ("Site-AP1", "S0000000003", "pending", "no upgrade available"),
    ]
    assert ("POST", "cmr/upgrade/job/show-devices", {".id": "*4", "duration": "1s"}) in controller.calls

    await client.send_json({"id": 2, "type": "cmr/job_devices", "entry_id": entry.entry_id, "job_id": "*77"})
    reply = await client.receive_json()
    assert not reply["success"] and reply["error"]["code"] == "no_job"


async def test_job_devices_unsupported(hass: HomeAssistant, controller: FakeController, entry, hass_ws_client) -> None:
    controller.has_job_devices = False  # an older build without the command
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "cmr/job_devices", "entry_id": entry.entry_id, "job_id": "*4"})
    reply = await client.receive_json()
    assert not reply["success"] and reply["error"]["code"] == "unsupported"


async def test_job_actions(hass: HomeAssistant, controller: FakeController, make_entry, hass_ws_client) -> None:
    controller.data["cmr/upgrade/job"].insert(0, dict(SCHEDULED))
    entry = make_entry(allow_upgrades=True)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    client = await hass_ws_client(hass)

    async def act(msg_id: int, job_id: str, action: str) -> dict:
        await client.send_json(
            {"id": msg_id, "type": "cmr/job_action", "entry_id": entry.entry_id, "job_id": job_id, "action": action}
        )
        return await client.receive_json()

    reply = await act(1, "*9", "run_next")
    assert reply["success"] and ("POST", "cmr/upgrade/job/run-next", {".id": "*9"}) in controller.calls
    # A finished job can't run again or be cancelled.
    for msg_id, action in ((2, "run_next"), (3, "cancel")):
        reply = await act(msg_id, "*4", action)
        assert not reply["success"] and reply["error"]["code"] == "not_allowed_now"
    reply = await act(4, "*9", "cancel")
    assert reply["success"] and ("POST", "cmr/upgrade/job/remove", {"numbers": "*9"}) in controller.calls
    await entry.runtime_data.async_refresh()  # the command's own refresh request is debounced
    jobs = {job[".id"]: job for job in entry.runtime_data.data.upgrade_jobs}
    assert jobs["*9"]["state"] == "cancelled"


async def test_job_actions_need_actions(hass: HomeAssistant, controller: FakeController, entry, hass_ws_client) -> None:
    client = await hass_ws_client(hass)
    await client.send_json(
        {"id": 1, "type": "cmr/job_action", "entry_id": entry.entry_id, "job_id": "*4", "action": "cancel"}
    )
    reply = await client.receive_json()
    assert not reply["success"] and reply["error"]["code"] == "not_allowed"
