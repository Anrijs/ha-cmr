"""Controller commands run on request: layouts, upgrade jobs, device reboots.

Plain functions over `CmrApi`, without Home Assistant imports (portable like
`api.py`). The websocket commands check the actions option and admin rights.
"""

from __future__ import annotations

from typing import Any

from .api import CmrApi


async def async_rebuild_links(api: CmrApi, layout_id: str) -> Any:
    """Generate a layout's links from the port data the controller has collected."""
    return await api.post("cmr/layout/rebuild-links", {"numbers": layout_id})


# Commands whose argument is a single `<number>` take the item as `.id` over
# REST (`numbers` is refused: "unknown parameter numbers"). `show-devices`
# keeps printing until stopped, so `duration` ends it after one look.


async def async_job_devices(api: CmrApi, job_id: str) -> Any:
    """The devices an upgrade job covers, with each one's state and reason (raw rows)."""
    return await api.post("cmr/upgrade/job/show-devices", {".id": job_id, "duration": "1s"})


async def async_cancel_job(api: CmrApi, job_id: str) -> Any:
    """Remove a job: a queued one ends cancelled, a running one stops and its
    remaining devices are cancelled (an install under way can still finish)."""
    return await api.post("cmr/upgrade/job/remove", {"numbers": job_id})


async def async_run_next(api: CmrApi, job_id: str) -> Any:
    """Run a scheduled job now. A rule's job starts as a new job and stays
    scheduled; a one-off job (`/cmr/device/upgrade schedule-time=…`) simply runs."""
    return await api.post("cmr/upgrade/job/run-next", {".id": job_id})


async def async_reboot(api: CmrApi, device_id: str) -> Any:
    """Reboot a device; the command returns at once, the device is back in about a minute."""
    return await api.post("cmr/device/reboot", {"numbers": device_id})
