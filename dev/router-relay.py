#!/usr/bin/env python3
"""Dev-only TCP relay from the Mac's loopback to the router.

Colima's user-mode networking can fail to reach LAN/VPN routes that the Mac
itself reaches (e.g. over ZeroTier). The dev container reaches the Mac's
loopback reliably as host.lima.internal (192.168.5.2), so this relay listens
there and forwards to the router:

    dev/router-relay.py 192.0.2.10:443 18443

Then add the integration with host `192.168.5.2:18443`.
"""

import asyncio
import sys


async def pipe(reader: asyncio.StreamReader, writer: asyncio.StreamWriter) -> None:
    try:
        while data := await reader.read(65536):
            writer.write(data)
            await writer.drain()
    except (ConnectionError, OSError):
        pass
    finally:
        writer.close()


async def main(target: str, port: int) -> None:
    host, target_port = target.rsplit(":", 1)

    async def handle(client_r: asyncio.StreamReader, client_w: asyncio.StreamWriter) -> None:
        try:
            upstream_r, upstream_w = await asyncio.open_connection(host, int(target_port))
        except OSError as err:
            print(f"relay: {target} unreachable: {err}", flush=True)
            client_w.close()
            return
        await asyncio.gather(pipe(client_r, upstream_w), pipe(upstream_r, client_w))

    server = await asyncio.start_server(handle, "127.0.0.1", port)
    print(f"relay: 127.0.0.1:{port} -> {target}", flush=True)
    async with server:
        await server.serve_forever()


if __name__ == "__main__":
    asyncio.run(main(sys.argv[1], int(sys.argv[2])))
