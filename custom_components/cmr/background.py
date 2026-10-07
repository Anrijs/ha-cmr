"""Background pictures of CMR layouts.

A layout names a picture among the router's files (`file`) and a `scale` in
percent. The controller's GUI draws it at its natural pixel size times the
scale, centred on the layout's point (0, 0), under the nodes. The picture is
read once over REST, shrunk to what the map needs and kept on disk until the
file changes, so the map never waits for the router.
"""

from __future__ import annotations

import asyncio
from collections.abc import Callable
from dataclasses import asdict, dataclass
from datetime import datetime, timedelta
import hashlib
import json
import logging
import math
from pathlib import Path
import shutil
from typing import Any
import warnings

from aiohttp import web

from homeassistant.components.http import HomeAssistantView
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.http import KEY_HASS
from homeassistant.util import dt as dt_util

from .api import CmrApi, CmrApiError, CmrAuthError
from .const import DOMAIN
from .models import CmrLayout

_LOGGER = logging.getLogger(__name__)

CHUNK = 32768  # the most `/file/read` returns per call
PARALLEL = 3  # reads in flight; the client allows four, polls keep a turn
MAX_BYTES = 25 * 1024 * 1024
# Decoding more than this at once could exhaust a small server's memory. JPEGs
# are decoded at a fraction of their size, so only that fraction counts.
MAX_PIXELS = 50_000_000
MAX_SIDE = 4096
# `/file/read` needs these on top of read, api and rest-api (RouterOS manual, REST API).
NO_FILE_ACCESS = (
    "Home Assistant's router user may not read files: add the ftp and test policies to its group, "
    "then reload the integration"
)
RECHECK = timedelta(minutes=10)
RETRY = timedelta(hours=1)
_INDEX = "index.json"


class PictureError(Exception):
    """The file can't be shown as a background."""


@dataclass
class Picture:
    """A layout picture as read from the controller."""

    stamp: str  # size and last-modified: a changed file is read again
    key: str
    width: int  # natural size (after EXIF rotation), as the GUI draws it at 100 %
    height: int
    side: int  # longest side of the shrunk copy we serve

    @property
    def name(self) -> str:
        return f"{self.key}-{self.side}.webp"


def served_side(width: int, height: int, scale: int) -> int:
    """Longest side of the copy we serve: twice what the map shows at its
    own scale (sharp on high-density screens), within sensible bounds."""
    longest = max(width, height)
    return min(longest, MAX_SIDE, max(512, math.ceil(2 * longest * scale / 100)))


def render_picture(source: Path, target: Path, scale: int) -> tuple[int, int, int]:
    """Shrink a picture to a WebP; (natural width, natural height, served side)."""
    from PIL import Image, ImageOps  # noqa: PLC0415 - only needed in the executor

    with warnings.catch_warnings():
        warnings.simplefilter("ignore", Image.DecompressionBombWarning)
        try:
            image = Image.open(source)
        except Image.DecompressionBombError as err:
            raise PictureError("the picture has too many pixels") from err
        except OSError as err:
            raise PictureError("not a picture Home Assistant can read") from err
    with image:
        width, height = image.size
        if image.getexif().get(0x0112, 1) in (5, 6, 7, 8):  # rotated a quarter turn
            width, height = height, width
        side = served_side(width, height, scale)
        factor = side / max(width, height)
        # A JPEG decodes at 1/2, 1/4 or 1/8 of its size for next to nothing.
        image.draft(None, (math.ceil(image.size[0] * factor), math.ceil(image.size[1] * factor)))
        if image.size[0] * image.size[1] > MAX_PIXELS:
            raise PictureError(f"the picture is too large to shrink ({width}×{height})")
        alpha = image.mode in ("RGBA", "LA", "PA") or (image.mode == "P" and "transparency" in image.info)
        image = ImageOps.exif_transpose(image.convert("RGBA" if alpha else "RGB"))
        image.thumbnail((side, side), Image.Resampling.LANCZOS)
        image.save(target, "WEBP", quality=82, method=4)
    return width, height, side


class BackgroundStore:
    """The layout pictures of one controller."""

    def __init__(self, hass: HomeAssistant, entry_id: str, api: CmrApi, on_change: Callable[[], None]) -> None:
        self.hass = hass
        self._entry_id = entry_id
        self._api = api
        self._on_change = on_change
        self.directory = Path(hass.config.cache_path(DOMAIN, "backgrounds", entry_id))
        self._pictures: dict[str, Picture] = {}
        self._errors: dict[str, str] = {}
        self._checked: dict[str, datetime] = {}
        self._tasks: dict[str, asyncio.Task[None]] = {}
        # Keys of pictures being read or shrunk: their files survive a cleanup.
        self._busy: set[str] = set()

    async def async_load(self) -> None:
        """Pictures cached by an earlier run serve until their files are checked."""

        def load() -> dict[str, Any]:
            try:
                return json.loads((self.directory / _INDEX).read_text())
            except (OSError, ValueError):
                return {}

        for file, item in (await self.hass.async_add_executor_job(load)).items():
            try:
                picture = Picture(**item)
            except TypeError:
                continue
            if (self.directory / picture.name).is_file():
                self._pictures[file] = picture

    @callback
    def async_stop(self) -> None:
        for task in self._tasks.values():
            task.cancel()
        self._tasks.clear()

    def payload(self, layout: CmrLayout) -> dict[str, Any] | None:
        """What the map needs: the URL of the shrunk copy and the natural size."""
        if not layout.background:
            return None
        picture = self._pictures.get(layout.background)
        error = self._errors.get(layout.background)
        return {
            "file": layout.background,
            "scale": layout.scale_percent,
            "url": f"/api/{DOMAIN}/background/{self._entry_id}/{picture.name}" if picture else None,
            "width": picture.width if picture else None,
            "height": picture.height if picture else None,
            "error": error if not picture else None,
        }

    def path_for(self, name: str) -> Path | None:
        """The file behind a URL from `payload`, if it is one we serve."""
        if any(picture.name == name for picture in self._pictures.values()):
            return self.directory / name
        return None

    @callback
    def async_sync(self, layouts: list[CmrLayout]) -> None:
        """After a poll: read new or changed pictures in the background."""
        wanted: dict[str, int] = {}
        for layout in layouts:
            if layout.background:
                wanted[layout.background] = max(wanted.get(layout.background, 0), layout.scale_percent)
        now = dt_util.utcnow()
        for file, scale in wanted.items():
            if file in self._tasks:
                continue
            picture = self._pictures.get(file)
            checked = self._checked.get(file)
            due = checked is None or now - checked >= (RETRY if file in self._errors else RECHECK)
            rescale = picture is not None and served_side(picture.width, picture.height, scale) != picture.side
            if due or rescale:
                self._checked[file] = now
                self._tasks[file] = self.hass.async_create_background_task(
                    self._async_update(file, scale), f"{DOMAIN} layout picture {file}"
                )
        gone = (set(self._pictures) | set(self._errors)) - set(wanted)
        if gone:
            for file in gone:
                self._pictures.pop(file, None)
                self._errors.pop(file, None)
                self._checked.pop(file, None)
            self.hass.async_create_background_task(self._async_save(), f"{DOMAIN} layout pictures index")

    async def _async_update(self, file: str, scale: int) -> None:
        try:
            changed = await self._async_refresh(file, scale)
        except CmrAuthError:
            changed = self._fail(file, NO_FILE_ACCESS)
        except PictureError as err:
            changed = self._fail(file, str(err))
        except CmrApiError as err:
            # Keep what we have; the next check retries.
            _LOGGER.info("Reading layout picture %s failed, will retry: %s", file, err.detail or err)
            self._checked[file] = dt_util.utcnow() - RECHECK + timedelta(minutes=1)
            changed = False
        finally:
            self._tasks.pop(file, None)
        if changed:
            await self._async_save()
            self._on_change()

    def _fail(self, file: str, message: str) -> bool:
        """Show why a picture can't be shown (checked again in an hour); whether that's news."""
        changed = self._errors.get(file) != message or file in self._pictures
        if file not in self._errors:
            _LOGGER.warning("Can't show layout picture %s: %s", file, message)
        self._errors[file] = message
        self._pictures.pop(file, None)
        return changed

    async def _async_refresh(self, file: str, scale: int) -> bool:
        """Read the file if it changed and shrink it for `scale`; whether anything changed."""
        info = await self._api.file_info(file)
        if info is None:
            raise PictureError("no such file on the router")
        size = int(info.get("size") or 0)
        if not size:
            raise PictureError("the file is empty")
        if size > MAX_BYTES:
            raise PictureError(f"the file is larger than {MAX_BYTES // 2**20} MiB")
        stamp = f"{size}|{info.get('last-modified', '')}"
        old = self._pictures.get(file)
        if old and old.stamp == stamp and served_side(old.width, old.height, scale) == old.side:
            self._errors.pop(file, None)
            return False
        key = hashlib.sha256(f"{file}\0{stamp}".encode()).hexdigest()[:16]
        source = self.directory / f"{key}.orig"
        self._busy.add(key)
        try:
            if not await self.hass.async_add_executor_job(source.is_file):
                data = await self._async_download(file, size)
                await self.hass.async_add_executor_job(self._write, source, data)
            rendered = self.directory / f"{key}.tmp.webp"
            width, height, side = await self.hass.async_add_executor_job(render_picture, source, rendered, scale)
            picture = Picture(stamp=stamp, key=key, width=width, height=height, side=side)
            await self.hass.async_add_executor_job(rendered.replace, self.directory / picture.name)
        finally:
            self._busy.discard(key)
        self._pictures[file] = picture
        self._errors.pop(file, None)
        _LOGGER.debug("Layout picture %s: %d×%d, served at %d px", file, width, height, side)
        return True

    async def _async_download(self, file: str, size: int) -> bytes:
        limit = asyncio.Semaphore(PARALLEL)

        async def chunk(offset: int) -> bytes:
            async with limit:
                data = await self._api.read_file(file, offset, CHUNK)
            if len(data) != min(CHUNK, size - offset):
                raise CmrApiError(f"file/read {file}@{offset}: {len(data)} bytes", "the file changed while it was read")
            return data

        try:
            async with asyncio.TaskGroup() as group:
                tasks = [group.create_task(chunk(offset)) for offset in range(0, size, CHUNK)]
        except ExceptionGroup as errors:
            raise errors.exceptions[0] from None
        return b"".join(task.result() for task in tasks)

    def _write(self, path: Path, data: bytes) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)

    async def _async_save(self) -> None:
        """Write the index and drop files no picture uses any more."""
        index = {file: asdict(picture) for file, picture in self._pictures.items()}
        keys = {picture.key for picture in self._pictures.values()} | self._busy
        keep = {picture.name for picture in self._pictures.values()} | {f"{key}.orig" for key in keys}

        def save() -> None:
            self.directory.mkdir(parents=True, exist_ok=True)
            (self.directory / _INDEX).write_text(json.dumps(index))
            for path in self.directory.iterdir():
                if path.name != _INDEX and path.name not in keep and path.name.split(".")[0] not in self._busy:
                    path.unlink(missing_ok=True)

        await self.hass.async_add_executor_job(save)


class BackgroundView(HomeAssistantView):
    """Serves the shrunk pictures to signed-in users; a URL names one version."""

    url = f"/api/{DOMAIN}/background/{{entry_id}}/{{name}}"
    name = f"api:{DOMAIN}:background"

    async def get(self, request: web.Request, entry_id: str, name: str) -> web.StreamResponse:
        hass = request.app[KEY_HASS]
        entry = hass.config_entries.async_get_entry(entry_id)
        if entry is None or entry.domain != DOMAIN or entry.state is not ConfigEntryState.LOADED:
            raise web.HTTPNotFound
        store: BackgroundStore | None = entry.runtime_data.backgrounds
        path = store.path_for(name) if store else None
        if path is None:
            raise web.HTTPNotFound
        return web.FileResponse(path, headers={"Cache-Control": "private, max-age=31536000, immutable"})


async def async_remove_cache(hass: HomeAssistant, entry_id: str) -> None:
    """Drop a removed entry's pictures."""
    directory = Path(hass.config.cache_path(DOMAIN, "backgrounds", entry_id))
    await hass.async_add_executor_job(shutil.rmtree, directory, True)
