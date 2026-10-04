import { css } from "lit";
import type { CmrDevice, Role } from "./types";

export const ROLE_ICON: Record<Role, string> = {
  gateway: "mdi:web",
  router: "mdi:router",
  switch: "mdi:switch",
  ap: "mdi:access-point",
  lte: "mdi:signal-cellular-3",
  device: "mdi:chip",
};

export const ROLE_LABEL: Record<Role, string> = {
  gateway: "Gateway",
  router: "Router",
  switch: "Switch",
  ap: "Access point",
  lte: "LTE",
  device: "Device",
};

export type Status = "ok" | "update" | "alert" | "pending" | "offline";

/** The single most important thing to say about a device. */
export function deviceStatus(device: CmrDevice): Status {
  if (device.pending) return "pending";
  if (!device.connected) return "offline";
  if (device.alerts?.on) return "alert";
  if (device.update_available) return "update";
  return "ok";
}

export const STATUS_LABEL: Record<Status, string> = {
  ok: "Online",
  update: "Update available",
  alert: "Alert firing",
  pending: "Waiting to pair",
  offline: "Disconnected",
};

export function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null) return "–";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d) return `${d}d ${h}h`;
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m`;
  return `${Math.floor(seconds)}s`;
}

export function compareDevices(a: CmrDevice, b: CmrDevice): number {
  const order: Role[] = ["gateway", "router", "switch", "lte", "ap", "device"];
  if (a.controller !== b.controller) return a.controller ? -1 : 1;
  const byRole = order.indexOf(a.role) - order.indexOf(b.role);
  return byRole || a.identity.localeCompare(b.identity);
}

export function fireEvent(node: HTMLElement, type: string, detail: unknown): void {
  node.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
}

export function moreInfo(node: HTMLElement, entityId: string | null | undefined): void {
  if (entityId) fireEvent(node, "hass-more-info", { entityId });
}

export function navigate(path: string): void {
  history.pushState(null, "", path);
  window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
}

/** Theme tokens shared by every card; all colors come from the HA theme. */
export const baseStyles = css`
  :host {
    --cmr-ok: var(--success-color, #2e7d32);
    --cmr-update: var(--info-color, #0288d1);
    --cmr-alert: var(--error-color, #d32f2f);
    --cmr-pending: var(--warning-color, #f57c00);
    --cmr-offline: var(--error-color, #d32f2f);
    /* Aqua, the jacket colour of OM3/OM4 multimode fiber. */
    --cmr-fiber: var(--cyan-color, #00bcd4);
    --cmr-poe: var(--amber-color, #ffc107);
    --cmr-muted: var(--secondary-text-color);
    --cmr-line: var(--divider-color, rgba(127, 127, 127, 0.25));
    --cmr-surface: var(--card-background-color, var(--ha-card-background, #fff));
    --cmr-surface-2: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
    --cmr-radius: var(--ha-card-border-radius, 12px);
    --cmr-mono: ui-monospace, "SF Mono", "Cascadia Mono", Menlo, monospace;
  }
  ha-card {
    height: 100%;
    overflow: hidden;
  }
  .status-ok { --status: var(--cmr-ok); }
  .status-update { --status: var(--cmr-update); }
  .status-alert { --status: var(--cmr-alert); }
  .status-pending { --status: var(--cmr-pending); }
  .status-offline { --status: var(--cmr-offline); }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--status);
    flex: none;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 11px;
    line-height: 16px;
    background: var(--cmr-surface-2);
    color: var(--primary-text-color);
    white-space: nowrap;
  }
  .mono {
    font-family: var(--cmr-mono);
    font-size: 0.92em;
  }
  .muted {
    color: var(--cmr-muted);
  }
  .empty {
    padding: 24px 16px;
    color: var(--cmr-muted);
    text-align: center;
  }
  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px 8px;
    font-size: 16px;
    font-weight: 500;
  }
  .card-header ha-icon {
    --mdc-icon-size: 20px;
    color: var(--cmr-muted);
  }
  .card-header .spacer {
    flex: 1;
  }
`;
