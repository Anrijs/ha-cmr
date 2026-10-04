import { css, html, type TemplateResult } from "lit";
import type { CmrDevice } from "./types";

/**
 * Icon when there is no product photo. The controller reports no role for a
 * device (one box can be the gateway, a switch and an AP at once), so the only
 * distinction drawn is controller vs. managed device.
 */
export function deviceIcon(device: CmrDevice): string {
  return device.controller ? "mdi:router-network" : "mdi:router";
}

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

/** Controller first, then by identity. */
export function compareDevices(a: CmrDevice, b: CmrDevice): number {
  if (a.controller !== b.controller) return a.controller ? -1 : 1;
  return a.identity.localeCompare(b.identity);
}

/** Copy text to the clipboard; the async API only exists on secure origins. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy path.
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
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
  /* Product photos sit on a light "pedestal" in every theme: some photos have
     opaque white backgrounds, and white devices need contrast on light cards. */
  .badge.photo {
    background: linear-gradient(160deg, #fbfbfc, #e9ebef) !important;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
    overflow: hidden;
  }
  .badge.photo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 9%;
    box-sizing: border-box;
    display: block;
    /* White photo backgrounds (JPGs, some PNGs) take on the tile's colour. */
    mix-blend-mode: multiply;
  }
  .badge.photo ha-icon {
    display: none;
  }
  .badge.photo.broken img {
    display: none;
  }
  .badge.photo.broken ha-icon {
    display: inline-flex;
    color: #5f6368;
  }
`;

/** The device's product photo on a light tile, or a generic icon. */
export function deviceVisual(device: CmrDevice, extraClass = ""): TemplateResult {
  if (device.product?.image) {
    return html`<div class="badge photo ${extraClass}" title=${device.product.name}>
      <img src=${device.product.image} alt=${device.product.name} loading="lazy" referrerpolicy="no-referrer"
        @error=${(e: Event) => ((e.target as HTMLElement).parentElement!.classList.add("broken"))} />
      <ha-icon icon=${deviceIcon(device)}></ha-icon>
    </div>`;
  }
  return html`<div class="badge ${extraClass}"><ha-icon icon=${deviceIcon(device)}></ha-icon></div>`;
}

/** Model line: the catalog's product name when known, else the board name. */
export function modelName(device: CmrDevice): string {
  const product = device.product && !device.product.ambiguous ? device.product : undefined;
  return product?.name ?? device.board ?? "Device";
}

/** Product code when certain, else the code the controller reports. */
export function modelCode(device: CmrDevice): string | null {
  return device.product && !device.product.ambiguous ? device.product.code : device.model_code;
}
