// Entry point: registers the CMR cards and dashboard strategy.
// Served by the integration and loaded on every Home Assistant page.
import { CmrAlertsCard } from "./alerts-card";
import { CmrEventsCard } from "./events-card";
import { CmrFleetCard } from "./fleet-card";
import { CmrStatusCard } from "./status-card";
import { CmrDashboardStrategy } from "./strategy";
import { CmrStrategyEditor } from "./strategy-editor";
import { CmrTopologyCard } from "./topology-card";
import { CmrUpgradesCard } from "./upgrades-card";

declare global {
  interface Window {
    customCards?: Record<string, unknown>[];
    customStrategies?: Record<string, unknown>[];
  }
}

const DOCS = "https://github.com/trakais/ha-cmr";

const CARDS: [string, CustomElementConstructor, string, string][] = [
  ["cmr-status-card", CmrStatusCard, "CMR status", "Controller, devices online, updates and alerts at a glance."],
  ["cmr-topology-card", CmrTopologyCard, "CMR topology", "Live network map drawn from the controller's CMR layouts."],
  ["cmr-fleet-card", CmrFleetCard, "CMR devices", "Every managed device with model, version, uptime and labels."],
  ["cmr-alerts-card", CmrAlertsCard, "CMR alerts", "Alert rules, what is firing, and pushing alerts to Home Assistant."],
  ["cmr-upgrades-card", CmrUpgradesCard, "CMR upgrades", "Upgrade rules as a rollout pipeline, plus recent jobs."],
  ["cmr-events-card", CmrEventsCard, "CMR events", "Network timeline from the controller's log and changes, with detected issues."],
];

for (const [tag, element] of CARDS) {
  if (!customElements.get(tag)) customElements.define(tag, element);
}

window.customCards = window.customCards || [];
for (const [type, , name, description] of CARDS) {
  if (!window.customCards.some((card) => card.type === type)) {
    window.customCards.push({ type, name, description, preview: false, documentationURL: DOCS });
  }
}

if (!customElements.get("ll-strategy-dashboard-cmr")) {
  customElements.define("ll-strategy-dashboard-cmr", CmrDashboardStrategy);
}
if (!customElements.get("cmr-strategy-editor")) {
  customElements.define("cmr-strategy-editor", CmrStrategyEditor);
}
window.customStrategies = window.customStrategies || [];
if (!window.customStrategies.some((s) => s.type === "cmr")) {
  window.customStrategies.push({
    type: "cmr",
    strategyType: "dashboard",
    name: "MikroTik CMR network",
    description: "A complete network dashboard generated from your MikroTik CMR controller: status, topology, devices, alerts and upgrades.",
    documentationURL: DOCS,
  });
}

// When this script is fetched (first load after an update, or a busy
// server) Home Assistant's dashboard loader may give up waiting for the
// strategy element after 5 s and show "Timeout waiting for strategy element
// ll-strategy-dashboard-cmr". Once the element exists a reload always works,
// so do that once per session. The timing goes to the console for bug reports.
const fetched = performance.getEntriesByType("resource").find((e) => e.name.includes("/cmr_static/cmr.js")) as
  | PerformanceResourceTiming
  | undefined;
const timing = fetched ? `fetched ${Math.round(fetched.startTime)}–${Math.round(fetched.responseEnd)} ms, ` : "";
console.info(
  "%c CMR %c cards loaded ",
  "background:#3a6ea5;color:#fff;border-radius:3px 0 0 3px",
  "background:#ddd;color:#333;border-radius:0 3px 3px 0",
  `${timing}registered at ${Math.round(performance.now())} ms`,
);

const STRATEGY_TIMEOUT_TEXT = "Timeout waiting for strategy element ll-strategy-dashboard-cmr";
const RELOAD_FLAG = "cmr-strategy-reloaded";

function showsStrategyTimeout(root: Document | ShadowRoot | Element, depth = 0): boolean {
  if (depth > 12) return false;
  if (root instanceof Element && root.shadowRoot && showsStrategyTimeout(root.shadowRoot, depth + 1)) return true;
  for (const child of Array.from(root.children)) {
    if (child.tagName === "SCRIPT" || child.tagName === "STYLE") continue;
    if (child.children.length === 0 && child.textContent?.includes(STRATEGY_TIMEOUT_TEXT)) return true;
    if (showsStrategyTimeout(child, depth + 1)) return true;
  }
  return false;
}

function healStrategyTimeout(attempt = 0): void {
  if (!showsStrategyTimeout(document)) {
    // The error appears up to ~5 s after the dashboard starts loading.
    if (attempt < 6) {
      setTimeout(() => healStrategyTimeout(attempt + 1), 2000);
    } else {
      // Loaded fine: a later timeout (next update) may reload again.
      try { sessionStorage.removeItem(RELOAD_FLAG); } catch { /* storage unavailable */ }
    }
    return;
  }
  let reloaded = false;
  try {
    reloaded = sessionStorage.getItem(RELOAD_FLAG) === location.pathname;
    sessionStorage.setItem(RELOAD_FLAG, location.pathname);
  } catch {
    // Storage unavailable: still reload once, risking a second error page rather than a loop.
    reloaded = attempt > 0;
  }
  if (reloaded) {
    console.warn("cmr: the dashboard strategy timed out again after a reload; not retrying");
    return;
  }
  console.warn("cmr: the dashboard strategy timed out before this script registered it; reloading once");
  location.reload();
}

healStrategyTimeout();
