"""Constants for the CMR integration."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "cmr"

CONF_WEBHOOK_ID: Final = "webhook_id"
CONF_WEBHOOK_BASE_URL: Final = "webhook_base_url"
# Lets Home Assistant start upgrades (needs the `write` policy on the router).
CONF_ALLOW_UPGRADES: Final = "allow_upgrades"
# Which events go to Home Assistant's activity log: notable, all or off.
CONF_ACTIVITY_LOG: Final = "activity_log"
# Optional product catalog with photos (empty: off).
CONF_CATALOG_URL: Final = "catalog_url"
# Options section with the issue-detection thresholds (keys: insights.RULES
# kinds, plus the offline delay).
CONF_DETECTION: Final = "detection"
CONF_OFFLINE_MINUTES: Final = "offline_minutes"

DEFAULT_SCAN_INTERVAL: Final = 30
MIN_SCAN_INTERVAL: Final = 10
MAX_SCAN_INTERVAL: Final = 600

# Fired on the event bus for every alert the controller pushes to the webhook.
EVENT_ALERT: Final = f"{DOMAIN}_alert"
# Timeline events worth a line in the activity log, and detected issues.
EVENT_CMR: Final = f"{DOMAIN}_event"
EVENT_ISSUE: Final = f"{DOMAIN}_issue"
# Dispatcher signal (formatted with the entry id) for pushed alerts.
SIGNAL_ALERT: Final = f"{DOMAIN}_alert_{{}}"

SEVERITIES: Final = ("critical", "high", "medium", "low")

FRONTEND_URL: Final = "/cmr_static"
FRONTEND_SCRIPT: Final = "cmr.js"
