"""Load a CMR dashboard in a headless browser and report what the dashboard loader sees.

Catches what the dev Home Assistant in Chromium can't: Firefox-family
browsers get Home Assistant's custom-element-registry polyfill, which once
hid our elements from the dashboard loader ("Timeout waiting for strategy
element ll-strategy-dashboard-cmr").

    .venv/bin/pip install selenium && brew install geckodriver
    HA_URL=http://localhost:8123 HA_TOKEN="$(cat dev/config/dev-token)" \\
        .venv/bin/python dev/browser-check.py /dashboard-network/network

Environment: HA_URL (default http://localhost:8123), HA_TOKEN (a long-lived
access token; never printed), BROWSER (path to a Firefox-family binary,
default Waterfox on macOS). The token goes into the page's localStorage the
way the Home Assistant frontend stores its own.
"""

from __future__ import annotations

import json
import os
import sys
import time

from selenium import webdriver
from selenium.webdriver.firefox.options import Options

HA = os.environ.get("HA_URL", "http://localhost:8123").rstrip("/")
TOKEN = os.environ.get("HA_TOKEN") or sys.exit("HA_TOKEN is required")
BROWSER = os.environ.get("BROWSER", "/Applications/Waterfox.app/Contents/MacOS/waterfox")
PATH = sys.argv[1] if len(sys.argv) > 1 else "/dashboard-network/network"

CHECKS = """
  const res = performance.getEntriesByType('resource')
    .filter((e) => e.name.includes('cmr.js'))
    .map((e) => ({ start: Math.round(e.startTime), end: Math.round(e.responseEnd), bytes: e.transferSize }));
  return {
    userAgent: navigator.userAgent,
    modernBuild: !!window.latestJS,
    strategyDefined: !!customElements.get('ll-strategy-dashboard-cmr'),
    fleetCardDefined: !!customElements.get('cmr-fleet-card'),
    customStrategies: (window.customStrategies || []).map((s) => s.type),
    script: res,
    title: document.title,
  };
"""

ERROR_TEXT = """
  function walk(root, depth) {
    if (depth > 14) return null;
    for (const el of root.children || []) {
      if (el.shadowRoot) { const r = walk(el.shadowRoot, depth + 1); if (r) return r; }
      if (el.children.length === 0 && /strategy element/i.test(el.textContent || '')) return el.textContent.trim();
      const r = walk(el, depth + 1); if (r) return r;
    }
    return null;
  }
  return walk(document, 0);
"""


def main() -> int:
    opts = Options()
    opts.binary_location = BROWSER
    for arg in ("-headless", "-no-remote", "-new-instance"):
        opts.add_argument(arg)
    opts.enable_bidi = True
    driver = webdriver.Firefox(options=opts)
    console: list[str] = []
    try:
        try:
            driver.script.add_console_message_handler(lambda m: console.append(f"[{m.level}] {m.text}"))
            driver.script.add_javascript_error_handler(lambda m: console.append(f"[error] {m.text}"))
        except Exception as err:  # noqa: BLE001 - console capture is a bonus
            console.append(f"(no console capture: {err})")
        # The token has to be stored on the page's origin before the app starts.
        driver.get(HA + "/")
        time.sleep(2)
        tokens = {
            "access_token": TOKEN,
            "token_type": "Bearer",
            "expires_in": 1800,
            "hassUrl": HA,
            "clientId": HA + "/",
            "expires": int(time.time() * 1000) + 10**10,
        }
        driver.execute_script("localStorage.setItem('hassTokens', arguments[0])", json.dumps(tokens))
        console.clear()
        driver.get(HA + PATH)
        time.sleep(12)
        info = driver.execute_script(CHECKS)
        error = driver.execute_script(ERROR_TEXT)
    finally:
        driver.quit()
    print(json.dumps(info, indent=1))
    print("error on screen:", error)
    print("console:")
    print("\n".join(line for line in console if TOKEN not in line))
    return 0 if info["strategyDefined"] and not error else 1


if __name__ == "__main__":
    sys.exit(main())
