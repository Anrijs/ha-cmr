"""Minimal async client for the router's REST API (`/rest/...`)."""

from __future__ import annotations

import asyncio
from typing import Any

import aiohttp

REQUEST_TIMEOUT = 20


class CmrApiError(Exception):
    """Base error talking to the controller; `detail` is the router's message."""

    def __init__(self, message: str, detail: str | None = None) -> None:
        super().__init__(message)
        self.detail = detail or message


class CmrConnectionError(CmrApiError):
    """The controller could not be reached."""


class CmrAuthError(CmrApiError):
    """The username or password was rejected, or lacks the needed policy."""


class CmrNotFoundError(CmrApiError):
    """The requested menu does not exist (e.g. the cmr package is missing)."""


class CmrRouterError(CmrApiError):
    """The router refused the request for another reason; see `detail`."""


# The router hides menus a user's policies don't allow, so "no such command"
# can also mean missing policies; the login failure text is checked first.
_PERMISSION_HINTS = ("permission", "login failure", "not allowed")
_NOT_FOUND_HINTS = ("no such command", "no such item", "not found")


class CmrApi:
    """Read-only access to the CMR menus of a controller."""

    def __init__(
        self,
        session: aiohttp.ClientSession,
        host: str,
        username: str,
        password: str,
        *,
        ssl: bool = True,
    ) -> None:
        scheme = "https" if ssl else "http"
        self.host = host
        self.base_url = f"{scheme}://{host}"
        self._rest = f"{self.base_url}/rest"
        self._session = session
        self._auth = aiohttp.BasicAuth(username, password)
        # Keep concurrent sessions well below the service's max-sessions.
        self._limit = asyncio.Semaphore(4)

    async def get(self, path: str) -> Any:
        """GET /rest/<path> and return the decoded JSON."""
        return await self._request("GET", path)

    async def post(self, path: str, payload: dict[str, Any]) -> Any:
        """POST /rest/<path> (runs a console command) and return the JSON."""
        return await self._request("POST", path, payload)

    async def _request(
        self, method: str, path: str, payload: dict[str, Any] | None = None
    ) -> Any:
        url = f"{self._rest}/{path.strip('/')}"
        try:
            async with self._limit, asyncio.timeout(REQUEST_TIMEOUT):
                async with self._session.request(
                    method, url, auth=self._auth, json=payload
                ) as resp:
                    if resp.status in (401, 403):
                        raise CmrAuthError(f"{method} {path}: HTTP {resp.status}")
                    body = await resp.json(content_type=None)
                    if resp.status >= 400:
                        raise _error_for(method, path, resp.status, body)
                    return body
        except (aiohttp.ClientError, TimeoutError, ValueError) as err:
            raise CmrConnectionError(f"{method} {path}: {err!r}") from err


def _error_for(method: str, path: str, status: int, body: Any) -> CmrApiError:
    """Classify a REST error response."""
    if isinstance(body, dict):
        detail = " ".join(
            str(body[key]) for key in ("message", "detail") if body.get(key)
        )
    else:
        detail = str(body)
    message = f"{method} {path}: HTTP {status}: {detail}"
    lowered = detail.lower()
    if any(hint in lowered for hint in _PERMISSION_HINTS):
        return CmrAuthError(message, detail)
    if status in (400, 404) and any(hint in lowered for hint in _NOT_FOUND_HINTS):
        return CmrNotFoundError(message, detail)
    return CmrRouterError(message, detail)
