import { cmrStore, pickEntry } from "./data";
import { ROLE_ICON, compareDevices } from "./shared";
import type { CmrDevice, CmrEntry, HassLike } from "./types";

interface StrategyConfig {
  type: string;
  entry_id?: string;
  title?: string;
}

type Card = Record<string, unknown>;

const heading = (text: string, icon: string, extra: Card = {}): Card => ({
  type: "heading",
  heading: text,
  icon,
  heading_style: "title",
  ...extra,
});

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([promise, new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))]);
}

function deviceSection(device: CmrDevice, hass: HassLike, alertsPushed: boolean): Card {
  // Skip entities that don't exist (yet) on this controller.
  const live = (id: string | null | undefined): id is string =>
    !!id && !!hass.states[id] && hass.states[id].state !== "unavailable";
  const e = device.entities;
  const cards: Card[] = [
    heading(device.identity, ROLE_ICON[device.role], {
      heading_style: "subtitle",
      ...(device.device_id
        ? { tap_action: { action: "navigate", navigation_path: `/config/devices/device/${device.device_id}` } }
        : {}),
      badges: live(e.version) ? [{ type: "entity", entity: e.version, show_icon: true }] : [],
    }),
  ];
  if (live(e.connected)) {
    cards.push({ type: "tile", entity: e.connected, name: "Connection", state_content: ["state", "last_changed"] });
  }
  if (live(e.uptime)) cards.push({ type: "tile", entity: e.uptime, name: "Up since" });
  if (live(e.update)) {
    // The update entity carries the product photo when a catalog is set.
    cards.push({ type: "tile", entity: e.update, name: "Firmware", show_entity_picture: true, grid_options: { columns: 12 } });
  }
  if (live(e.active_alerts)) cards.push({ type: "tile", entity: e.active_alerts, name: "Alerts" });
  // The alert event entity only ever fills when rules push to Home Assistant.
  if (alertsPushed && live(e.alert)) cards.push({ type: "tile", entity: e.alert, name: "Last alert" });
  return { type: "grid", cards };
}

function networkView(entry: CmrEntry, base: Card): Card {
  const fe = entry.fleet_entities;
  return {
    title: "Network",
    path: "network",
    icon: "mdi:router-network",
    type: "sections",
    max_columns: 3,
    badges: (
      [
        [fe.devices_online, "Online"],
        [fe.updates_available, "Updates"],
        [fe.alerts_firing, "Alerts firing"],
        [fe.network_issues, "Issues"],
      ] as const
    )
      .filter(([entity]) => entity)
      .map(([entity, name]) => ({ type: "entity", entity, name, show_name: true })),
    sections: [
      { type: "grid", column_span: 3, cards: [{ ...base, type: "custom:cmr-status-card" }] },
      {
        type: "grid",
        column_span: 3,
        cards: [{ ...base, type: "custom:cmr-topology-card", height: 480, grid_options: { columns: "full" } }],
      },
      {
        type: "grid",
        column_span: 2,
        cards: [{ ...base, type: "custom:cmr-fleet-card", grid_options: { columns: "full" } }],
      },
      { type: "grid", cards: [{ ...base, type: "custom:cmr-alerts-card", grid_options: { columns: "full" } }] },
      {
        type: "grid",
        column_span: 2,
        cards: [{ ...base, type: "custom:cmr-events-card", max_items: 15, notable: true, grid_options: { columns: "full" } }],
      },
      { type: "grid", cards: [{ ...base, type: "custom:cmr-upgrades-card", grid_options: { columns: "full" } }] },
    ],
  };
}

function devicesView(entry: CmrEntry, hass: HassLike): Card {
  const alertsPushed = entry.alerts.some((rule) => rule.webhook);
  const devices = [...entry.devices].sort(compareDevices);
  const connectivity = devices.map((d) => d.entities.connected).filter(Boolean);
  return {
    title: "Devices",
    path: "devices",
    icon: "mdi:devices",
    type: "sections",
    max_columns: 4,
    sections: [
      {
        type: "grid",
        column_span: 4,
        cards: [
          heading("Connectivity, last 24 hours", "mdi:chart-timeline-variant"),
          { type: "history-graph", hours_to_show: 24, entities: connectivity, grid_options: { columns: "full" } },
        ],
      },
      ...devices.map((device) => deviceSection(device, hass, alertsPushed)),
    ],
  };
}

function eventsView(base: Card): Card {
  return {
    title: "Events",
    path: "events",
    icon: "mdi:timeline-text-outline",
    type: "sections",
    max_columns: 2,
    sections: [
      {
        type: "grid",
        column_span: 2,
        cards: [{ ...base, type: "custom:cmr-events-card", max_items: 100, grid_options: { columns: "full" } }],
      },
    ],
  };
}

function topologyView(base: Card): Card {
  return {
    title: "Topology",
    path: "topology",
    icon: "mdi:sitemap-outline",
    type: "panel",
    cards: [{ ...base, type: "custom:cmr-topology-card", height: 760 }],
  };
}

function messageDashboard(config: StrategyConfig, message: string): Card {
  return {
    title: config.title ?? "Network",
    views: [{ title: "Network", path: "network", cards: [{ type: "markdown", content: `## CMR\n${message}` }] }],
  };
}

export class CmrDashboardStrategy extends HTMLElement {
  static getCreateSuggestions() {
    return { title: "Network", icon: "mdi:router-network" };
  }

  static async generate(config: StrategyConfig, hass: HassLike) {
    // Never throw: a failing strategy leaves Home Assistant on an error page
    // with no way back, so any problem becomes a message on a normal view.
    try {
      const entries = await withTimeout(cmrStore.once(hass), 8000, [] as CmrEntry[]);
      const entry = pickEntry(entries, config.entry_id);
      if (!entry) {
        return messageDashboard(
          config,
          "No CMR controller is set up yet. Add the **CMR** integration under " +
            "[Settings → Devices & services](/config/integrations/dashboard/add?domain=cmr).",
        );
      }
      const base: Card = config.entry_id ? { entry_id: config.entry_id } : {};
      return {
        title: config.title ?? "Network",
        views: [networkView(entry, base), eventsView(base), devicesView(entry, hass), topologyView(base)],
      };
    } catch (err) {
      console.error("cmr: dashboard strategy failed", err);
      return messageDashboard(
        config,
        `The dashboard couldn't be built (${String(err)}). Reload the page to try again.`,
      );
    }
  }
}
