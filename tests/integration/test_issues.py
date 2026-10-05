"""Detected issues: dismissing one by hand through the websocket command."""

from __future__ import annotations

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir
from homeassistant.util import dt as dt_util

from custom_components.cmr.const import DOMAIN
from custom_components.cmr.insights import Insight


async def test_dismiss_issue(hass: HomeAssistant, entry, hass_ws_client) -> None:
    log = entry.runtime_data.eventlog
    now = dt_util.utcnow()
    insight = Insight(
        "login_failures:203.0.113.9", "login_failures", "203.0.113.9", None, "error",
        now - timedelta(minutes=5), now, 5, {"name": "203.0.113.9", "users": ["admin"]},
    )
    log.engine.active[insight.key] = insight
    log._repair(insight, active=True)
    issue_id = f"{entry.entry_id}_{insight.key}"
    assert ir.async_get(hass).async_get_issue(DOMAIN, issue_id) is not None
    assert [i["key"] for i in log.insight_list()] == [insight.key]
    assert log.insight_list()[0]["entry_id"] == entry.entry_id

    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "cmr/issue_dismiss", "entry_id": entry.entry_id, "key": insight.key})
    reply = await client.receive_json()
    assert reply["success"], reply
    await hass.async_block_till_done()

    # Gone from the active list and from Repairs; the timeline got a "Resolved" event.
    assert log.insight_list() == []
    assert ir.async_get(hass).async_get_issue(DOMAIN, issue_id) is None
    resolved = [e for e in log.events if e["category"] == "insight" and e["data"].get("event") == "resolved"]
    assert resolved and resolved[-1]["title"].startswith("Resolved: Repeated login failures")

    # Dismissing again is an error, not a crash.
    await client.send_json({"id": 2, "type": "cmr/issue_dismiss", "entry_id": entry.entry_id, "key": insight.key})
    reply = await client.receive_json()
    assert not reply["success"]
    assert reply["error"]["code"] == "not_found"
