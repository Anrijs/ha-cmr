"""Move existing CMR nodes, checking for stale edits and verifying writes."""

from __future__ import annotations

from dataclasses import asdict
import hashlib
import json
from typing import Any

from .api import CmrApi, CmrApiError
from .models import CmrNode


class LayoutEditError(Exception):
    """An edit rejected before any node was changed."""

    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code


def node_revision(node: CmrNode) -> str:
    """Include identity, membership and signed coordinates, not live status."""
    return hashlib.sha256(json.dumps(asdict(node), sort_keys=True).encode()).hexdigest()[:16]


async def async_move_nodes(api: CmrApi, layout: str, changes: list[dict[str, Any]]) -> dict[str, Any]:
    """Validate the whole edit before writing; RouterOS has no transactions/CAS."""
    if len({change["id"] for change in changes}) != len(changes):
        raise LayoutEditError("invalid_nodes", "A node was included more than once")
    layouts = await api.get("cmr/layout")
    if not any(item.get("name") == layout for item in layouts):
        raise LayoutEditError("no_layout", "This layout no longer exists; reopen the map")
    nodes = {node.rest_id: node for node in (CmrNode.from_rest(row) for row in await api.get("cmr/layout/node"))}
    for change in changes:
        node = nodes.get(change["id"])
        if node is None or node.layout != layout:
            raise LayoutEditError("stale_layout", "A node was removed or moved to another layout; cancel and reopen Edit layout")
        if node_revision(node) != change["revision"]:
            raise LayoutEditError("stale_layout", f"{node.name} changed on CMR; cancel and reopen Edit layout")

    failures: dict[str, str] = {}
    for change in changes:
        try:
            try:
                await api.patch(f"cmr/layout/node/{change['id']}", {"x": str(change["x"]), "y": str(change["y"])})
            except CmrApiError as err:
                # Early CMR builds also require unsigned coordinates on writes.
                # Retry only their explicit range error; newer builds take signed values.
                if "(0..4294967295)" not in err.detail or not any(change[axis] < 0 for axis in ("x", "y")):
                    raise
                await api.patch(f"cmr/layout/node/{change['id']}", {axis: str(change[axis] % 2**32) for axis in ("x", "y")})
        except CmrApiError as err:
            failures[change["id"]] = err.detail

    # Verify even a failed PATCH: a timeout can occur after the router applies it.
    saved = []
    try:
        current = {n.rest_id: n for n in (CmrNode.from_rest(row) for row in await api.get("cmr/layout/node"))}
    except CmrApiError as err:
        failures = {c["id"]: f"Could not verify the saved position: {err.detail}. Cancel and reopen the editor." for c in changes}
    else:
        for change in changes:
            node = current.get(change["id"])
            original = nodes[change["id"]]
            if node and (node.name, node.layout, node.device_ref, node.target_layout) == (
                original.name, original.layout, original.device_ref, original.target_layout
            ) and (node.x, node.y) == (change["x"], change["y"]):
                saved.append({"id": node.rest_id, "x": node.x, "y": node.y, "revision": node_revision(node)})
                failures.pop(change["id"], None)
            else:
                failures.setdefault(change["id"], "CMR did not keep the requested position; cancel and reopen the editor")
    return {"saved": saved, "failed": [{"id": key, "message": value} for key, value in failures.items()]}
