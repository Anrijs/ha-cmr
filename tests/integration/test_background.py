"""Layout background pictures: read from the router's files, shrunk, served."""

from __future__ import annotations

from collections.abc import Callable
import io
import math
import os
from pathlib import Path
from typing import Any

from PIL import Image
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.core import HomeAssistant

from custom_components.cmr.background import PictureError, render_picture, served_side

from .conftest import FakeController


def jpeg(width: int, height: int, orientation: int = 1) -> bytes:
    """A photo-like JPEG (noise, so it spans many 32 KiB reads)."""
    image = Image.frombytes("RGB", (width, height), os.urandom(width * height * 3))
    exif = Image.Exif()
    exif[0x0112] = orientation
    out = io.BytesIO()
    image.save(out, "JPEG", quality=80, exif=exif.tobytes())
    return out.getvalue()


def layout(controller: FakeController, name: str) -> dict[str, Any]:
    return next(item for item in controller.data["cmr/layout"] if item["name"] == name)


async def snapshot(hass: HomeAssistant, hass_ws_client) -> dict[str, Any]:
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "cmr/subscribe"})
    assert (await client.receive_json())["success"]
    (payload,) = (await client.receive_json())["event"]["entries"]
    return {item["name"]: item for item in payload["layouts"]}


async def start(hass: HomeAssistant, make_entry: Callable[..., MockConfigEntry], **options: Any) -> MockConfigEntry:
    entry = make_entry(**options)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done(wait_background_tasks=True)
    return entry


def reads(controller: FakeController) -> int:
    return sum(path == "file/read" for _, path, _ in controller.calls)


async def test_picture_is_read_shrunk_and_served(
    hass: HomeAssistant, controller: FakeController, make_entry, hass_ws_client, hass_client, hass_client_no_auth
) -> None:
    data = jpeg(1200, 900, orientation=6)  # a phone photo taken upright
    controller.files["plan.jpg"] = (data, "2026-10-07 13:43:12")
    layout(controller, "Main").update({"file": "plan.jpg", "scale": "20"})
    await start(hass, make_entry)
    assert reads(controller) == math.ceil(len(data) / 32768)

    layouts = await snapshot(hass, hass_ws_client)
    picture = layouts["Main"]["background"]
    # The natural size is the upright one, as browsers show the photo.
    assert {k: v for k, v in picture.items() if k != "url"} == {
        "file": "plan.jpg", "scale": 20, "width": 900, "height": 1200, "error": None,
    }
    assert layouts["Overview"]["background"] is None

    response = await (await hass_client()).get(picture["url"])
    assert response.status == 200 and response.headers["Content-Type"] == "image/webp"
    assert "immutable" in response.headers["Cache-Control"]
    served = Image.open(io.BytesIO(await response.read()))
    side = served_side(900, 1200, 20)
    assert side == 512 and served.size == (384, 512)

    assert (await (await hass_client_no_auth()).get(picture["url"])).status == 401
    assert (await (await hass_client()).get(picture["url"].rsplit("/", 1)[0] + "/other.webp")).status == 404


async def test_unchanged_picture_is_not_read_again(
    hass: HomeAssistant, controller: FakeController, make_entry, hass_ws_client
) -> None:
    controller.files["plan.jpg"] = (jpeg(640, 480), "2026-10-07 13:43:12")
    layout(controller, "Main")["file"] = "plan.jpg"
    entry = await start(hass, make_entry)
    first = reads(controller)
    url = (await snapshot(hass, hass_ws_client))["Main"]["background"]["url"]

    # A restart checks the file and serves the cached copy.
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done(wait_background_tasks=True)
    assert reads(controller) == first
    assert (await snapshot(hass, hass_ws_client))["Main"]["background"]["url"] == url

    # A new upload under the same name is read again.
    controller.files["plan.jpg"] = (jpeg(640, 480), "2026-10-07 15:00:00")
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done(wait_background_tasks=True)
    assert reads(controller) == 2 * first
    assert (await snapshot(hass, hass_ws_client))["Main"]["background"]["url"] != url


async def test_missing_picture_reports_why(
    hass: HomeAssistant, controller: FakeController, make_entry, hass_ws_client
) -> None:
    layout(controller, "Main")["file"] = "gone.png"
    await start(hass, make_entry)
    picture = (await snapshot(hass, hass_ws_client))["Main"]["background"]
    assert picture["url"] is None and picture["error"] == "no such file on the router"


async def test_picture_needs_file_policies(
    hass: HomeAssistant, controller: FakeController, make_entry, hass_ws_client
) -> None:
    controller.files["plan.jpg"] = (jpeg(640, 480), "2026-10-07 13:43:12")
    controller.file_read_ok = False
    layout(controller, "Main")["file"] = "plan.jpg"
    await start(hass, make_entry)
    picture = (await snapshot(hass, hass_ws_client))["Main"]["background"]
    assert picture["url"] is None and "ftp and test policies" in picture["error"]


async def test_scale_is_saved_with_the_layout(
    hass: HomeAssistant, controller: FakeController, make_entry, hass_ws_client
) -> None:
    controller.files["plan.jpg"] = (jpeg(1200, 900), "2026-10-07 13:43:12")
    layout(controller, "Main").update({"file": "plan.jpg", "scale": "20"})
    entry = await start(hass, make_entry, allow_upgrades=True)
    first = reads(controller)
    before = (await snapshot(hass, hass_ws_client))["Main"]["background"]

    client = await hass_ws_client(hass)
    save = {"type": "cmr/move_nodes", "entry_id": entry.entry_id, "layout": "Main", "nodes": []}
    await client.send_json({"id": 1, **save, "scale": 5})
    assert not (await client.receive_json())["success"]
    await client.send_json({"id": 2, **save, "scale": 50})
    reply = await client.receive_json()
    assert reply["success"] and reply["result"] == {"saved": [], "failed": [], "scale": 50}
    assert layout(controller, "Main")["scale"] == "50"
    assert ("PATCH", "cmr/layout/*2", {"scale": "50"}) in controller.calls

    await hass.async_block_till_done(wait_background_tasks=True)
    after = (await snapshot(hass, hass_ws_client))["Main"]["background"]
    # Shrunk again for the larger scale from the copy already on disk.
    assert after["scale"] == 50 and after["url"] != before["url"]
    assert reads(controller) == first


async def test_scale_needs_actions(hass: HomeAssistant, controller: FakeController, entry, hass_ws_client) -> None:
    client = await hass_ws_client(hass)
    await client.send_json(
        {"id": 1, "type": "cmr/move_nodes", "entry_id": entry.entry_id, "layout": "Main", "nodes": [], "scale": 50}
    )
    reply = await client.receive_json()
    assert not reply["success"] and reply["error"]["code"] == "not_allowed"


def test_render_keeps_transparency(tmp_path: Path) -> None:
    source = tmp_path / "plan.png"
    Image.new("RGBA", (3000, 1000), (255, 0, 0, 0)).save(source)
    assert render_picture(source, tmp_path / "out.webp", 10) == (3000, 1000, 600)
    served = Image.open(tmp_path / "out.webp")
    assert served.mode == "RGBA" and served.size == (600, 200)


def test_render_refuses_what_it_cannot_decode_safely(tmp_path: Path) -> None:
    huge = tmp_path / "huge.png"
    Image.new("1", (8000, 8000)).save(huge)  # 64 MP: a PNG has no cheap reduced decode
    with pytest.raises(PictureError, match="too large"):
        render_picture(huge, tmp_path / "out.webp", 100)
    text = tmp_path / "notes.txt"
    text.write_text("not a picture")
    with pytest.raises(PictureError, match="not a picture"):
        render_picture(text, tmp_path / "out.webp", 100)


def test_served_side_bounds() -> None:
    assert served_side(11307, 8771, 10) == 2262  # twice what the map shows
    assert served_side(11307, 8771, 100) == 4096
    assert served_side(400, 300, 10) == 400  # never larger than the original
