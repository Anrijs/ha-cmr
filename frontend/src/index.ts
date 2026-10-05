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
    name: "CMR network",
    description: "A complete network dashboard generated from your CMR controller: status, topology, devices, alerts and upgrades.",
    documentationURL: DOCS,
  });
}

console.info("%c CMR %c cards loaded ", "background:#3a6ea5;color:#fff;border-radius:3px 0 0 3px", "background:#ddd;color:#333;border-radius:0 3px 3px 0");
