#!/bin/sh
# Development Home Assistant for the CMR integration.
#   dev/ha.sh up | down | restart | logs
# The integration is mounted live from custom_components/; restart after
# Python changes. Frontend changes only need a browser reload.
set -e
cd "$(dirname "$0")/.."
NAME=ha-cmr-dev
IMAGE=ghcr.io/home-assistant/home-assistant:2026.9.1

case "${1:-up}" in
  up)
    docker run -d --name "$NAME" --restart unless-stopped \
      -e TZ="${TZ:-UTC}" --network host \
      -v "$PWD/dev/config:/config" \
      -v "$PWD/custom_components:/config/custom_components" \
      "$IMAGE" ;;
  down) docker rm -f "$NAME" ;;
  restart) docker restart "$NAME" ;;
  logs) docker logs -f --tail 100 "$NAME" ;;
  *) echo "usage: $0 up|down|restart|logs" >&2; exit 2 ;;
esac
