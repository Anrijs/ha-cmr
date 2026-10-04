"""Pushed alerts, their payload parsing, and REST error classification."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from custom_components.cmr import api, webhook
from custom_components.cmr.const import EVENT_ALERT

from .conftest import FakeController


def test_parse_payload_tolerates_broken_json() -> None:
    assert webhook.parse_payload('{"alert": "cpu>95%", "severity": "high"}') == {"alert": "cpu>95%", "severity": "high"}
    # A message with an unescaped quote breaks the JSON; the pairs are still recovered.
    broken = '{"alert":"link","severity":"low","message":"port "ether1" down"}'
    assert webhook.parse_payload(broken)["alert"] == "link"
    assert webhook.parse_payload("plain text") == {"message": "plain text"}
    assert webhook.parse_payload("") == {}
    assert webhook.parse_payload("[1, 2]") == {"message": [1, 2]}


def test_normalize_alert() -> None:
    alert = webhook.normalize_alert({"alert": "cpu>95%", "severity": "HIGH", "device": "unknown", "identity": "AP1", "version": ""})
    assert alert == {
        "alert": "cpu>95%", "severity": "high", "device": "AP1", "serial": None, "address": None,
        "version": None, "upgrade_version": None, "message": None,
    }
    assert webhook.normalize_alert({})["severity"] == "medium"
    assert webhook.normalize_alert({"severity": "bogus"})["severity"] == "medium"


def test_alert_setup_script_points_every_rule_at_the_webhook() -> None:
    script = webhook.alert_setup_script("http://ha.local:8123/", "abc")
    assert 'action.http-url="http://ha.local:8123/api/webhook/abc"' in script
    assert script.startswith(":foreach a in=[/cmr/alert find]")
    assert '\\"severity\\":\\"" . $s . "\\"' in script
    assert webhook.webhook_url(None, "abc") == "http://homeassistant.local:8123/api/webhook/abc"


def test_rest_error_classification() -> None:
    assert isinstance(api._error_for("GET", "cmr", 400, {"message": "no such command"}), api.CmrNotFoundError)
    assert isinstance(api._error_for("GET", "cmr", 400, {"detail": "not enough permissions"}), api.CmrAuthError)
    err = api._error_for("POST", "execute", 500, {"message": "failure", "detail": "script error"})
    assert isinstance(err, api.CmrRouterError) and err.detail == "failure script error"
    assert isinstance(api._error_for("GET", "x", 404, "<html>not found</html>"), api.CmrNotFoundError)


async def test_pushed_alert_reaches_bus_and_event_entity(
    hass: HomeAssistant, entry, controller: FakeController, hass_client
) -> None:
    fired = []
    hass.bus.async_listen(EVENT_ALERT, lambda event: fired.append(event.data))
    client = await hass_client()
    response = await client.post(
        "/api/webhook/test-webhook-id",
        data='{"alert":"cpu>95%","severity":"high","device":"Site-GW","serial":"S0000000002","message":"CPU 97%"}',
    )
    assert response.status == 200
    await hass.async_block_till_done()
    (data,) = fired
    assert data["device_key"] == "S0000000002" and data["entry_id"] == entry.entry_id

    events = [s for s in hass.states.async_all("event") if s.attributes.get("event_type") == "high"]
    assert len(events) == 2  # the fleet event entity and the gateway's own
    assert all(s.attributes["alert"] == "cpu>95%" for s in events)
