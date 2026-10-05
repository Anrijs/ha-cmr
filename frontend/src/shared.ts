import { LitElement, css, html, nothing, type PropertyDeclarations, type PropertyValues, type TemplateResult } from "lit";
import { type RuleDevicesState, cmrStore, pickEntry } from "./data";
import type { CmrAlertRule, CmrDevice, CmrEntry, HassLike } from "./types";

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
  if (device.pending || device.remote_pending) return "pending";
  if (!device.connected) return "offline";
  if (device.alerts?.on) return "alert";
  if (device.update_available) return "update";
  return "ok";
}

/** Where a pending pairing has to be approved. */
export function pairingHint(device: CmrDevice): string {
  if (device.pending) return "approve on the controller";
  if (device.remote_pending) return "approve on the device";
  return "";
}

/** Most urgent first: the default order of device lists and status chips. */
export const STATUS_ORDER: Status[] = ["offline", "pending", "alert", "update", "ok"];

/** Approve a device's pairing on the controller (the Approve buttons). */
export async function approvePairing(hass: HassLike, entryId: string, deviceKey: string): Promise<void> {
  await hass.connection.sendMessagePromise({ type: "cmr/pair", entry_id: entryId, device_key: deviceKey });
}

/** Device fields a free-text search looks at. */
export function deviceMatches(device: CmrDevice, needle: string): boolean {
  if (!needle) return true;
  const hay = [device.identity, device.board, device.model_code, device.address, device.version, ...device.labels]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(needle);
}

/**
 * Filters another card asked for through the page URL, e.g.
 * `/cmr-network/devices?cmr_status=offline`. Home Assistant hands cards no
 * query parameters, so they read the location themselves.
 */
export function deepLinkParams(): { status?: Status; version?: string; search?: string; alert?: string } {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("cmr_status") as Status | null;
  return {
    status: status && STATUS_ORDER.includes(status) ? status : undefined,
    version: params.get("cmr_version") ?? undefined,
    search: params.get("cmr_search") ?? undefined,
    // An alert rule id: only the devices it fires on.
    alert: params.get("cmr_alert") ?? undefined,
  };
}

/** Path of a view in the dashboard the page is on ("devices" → "/cmr-network/devices"). */
export function viewPath(view: string, params: Record<string, string | undefined> = {}): string {
  const dashboard = window.location.pathname.split("/")[1] || "lovelace";
  const query = Object.entries(params)
    .filter((entry): entry is [string, string] => !!entry[1])
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  return `/${dashboard}/${view}${query ? `?${query}` : ""}`;
}

export const STATUS_LABEL: Record<Status, string> = {
  // Online with nothing wrong; plain "Online" reads as the connection count.
  ok: "OK",
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

/** "just now", "3 min ago", "2 h ago", "5 d ago". */
export function relativeTime(iso: string | null | undefined, never = "never"): string {
  if (!iso) return never;
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 10) return "just now";
  if (s < 60) return `${Math.round(s)} s ago`;
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return `${Math.round(s / 86400)} d ago`;
}

/** A device's web interface; IPv6 literals need brackets. */
export function deviceUrl(address: string): string {
  return address.includes(":") && !address.startsWith("[") ? `http://[${address}]` : `http://${address}`;
}

/** The "which controller" row every entry-bound card's editor starts with. */
export const ENTRY_FIELD = { name: "entry_id", selector: { config_entry: { integration: "cmr" } } };

export function labelsFrom(labels: Record<string, string>) {
  return (schema: { name: string }) => labels[schema.name];
}

interface EntryConfig {
  type: string;
  entry_id?: string;
}

/**
 * A card bound to one controller. It follows the shared snapshot store while
 * connected, picks the configured (or first) controller, and renders the
 * waiting, error and unreachable states the same way as every other card.
 */
export class CmrEntryCard<C extends EntryConfig = EntryConfig> extends LitElement {
  // Lit merges a subclass's own `static properties` with these.
  static properties: PropertyDeclarations = {
    hass: { attribute: false },
    _config: { state: true },
    _entry: { state: true },
    _error: { state: true },
  };

  declare hass: HassLike;
  declare _config: C;
  declare _entry?: CmrEntry;
  declare _error?: string;
  private _unsubscribeStore?: () => void;
  private _staleTicker?: number;

  setConfig(config: C): void {
    this._config = config;
  }

  static getStubConfig(): Record<string, never> {
    return {};
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.hass && !this._unsubscribeStore) this._subscribeStore();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribeStore?.();
    this._unsubscribeStore = undefined;
    window.clearInterval(this._staleTicker);
    this._staleTicker = undefined;
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has("hass") && this.hass && !this._unsubscribeStore && this.isConnected) this._subscribeStore();
  }

  private _subscribeStore(): void {
    this._unsubscribeStore = cmrStore.subscribe(this.hass, (entries, error) => {
      this._error = error;
      this._entry = pickEntry(entries, this._config?.entry_id);
      // Keep "data from … ago" moving while the controller is unreachable.
      const stale = !!this._entry && !this._entry.available;
      if (stale && !this._staleTicker) this._staleTicker = window.setInterval(() => this.requestUpdate(), 30000);
      if (!stale && this._staleTicker) {
        window.clearInterval(this._staleTicker);
        this._staleTicker = undefined;
      }
    });
  }

  /** Placeholder until the first snapshot arrives, or when the subscription failed. */
  protected renderWaiting(style = ""): TemplateResult {
    const text = this._error
      ? `Can't read CMR data from Home Assistant (${this._error}). Reload the page.`
      : "Waiting for the CMR controller…";
    return html`<ha-card><div class="empty" style=${style}>${text}</div></ha-card>`;
  }

  /** A strip under the header while the controller can't be polled. */
  protected renderStale(entry: CmrEntry): TemplateResult | typeof nothing {
    if (entry.available) return nothing;
    return html`<div class="stale">
      <ha-icon icon="mdi:lan-disconnect"></ha-icon>Controller unreachable · showing data from ${relativeTime(entry.last_update)}
    </div>`;
  }
}

/** Theme tokens shared by every card; all colors come from the HA theme. */
export const baseStyles = css`
  :host {
    --cmr-ok: var(--success-color, #2e7d32);
    --cmr-update: var(--info-color, #0288d1);
    /* Three distinct hues: alerts amber, offline red, pairing purple. */
    --cmr-alert: var(--warning-color, #f57c00);
    --cmr-pending: #8e24aa;
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
    /* Light "pedestal" behind product photos, in every theme. */
    --cmr-pedestal: linear-gradient(160deg, #fbfbfc, #e9ebef);
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
  .small {
    font-size: 12px;
  }
  .section-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--cmr-muted);
  }
  .chip.alert {
    background: var(--cmr-alert);
    color: #fff;
  }
  .chip.update {
    background: var(--cmr-update);
    color: #fff;
  }
  /* Toggle buttons: label filters, event categories, layout roots. */
  .pill {
    all: unset;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    padding: 3px 10px;
    border-radius: 999px;
    border: 1px solid var(--cmr-line);
    color: var(--cmr-muted);
    --mdc-icon-size: 14px;
  }
  .pill.on {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  .stale {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0 12px 8px;
    padding: 6px 10px;
    border-radius: 10px;
    font-size: 12px;
    background: color-mix(in srgb, var(--cmr-pending) 14%, transparent);
    color: var(--primary-text-color);
    --mdc-icon-size: 16px;
  }
  .stale ha-icon {
    color: var(--cmr-pending);
  }
  /* Product photos sit on a light "pedestal" in every theme: some photos have
     opaque white backgrounds, and white devices need contrast on light cards. */
  .badge.photo {
    background: var(--cmr-pedestal) !important;
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

// ------------------------------------------------------------ rule devices

/**
 * The devices an alert rule fires on, under a rule row: the list (or why it
 * isn't available) plus links to the Devices view and the map filtered to
 * the same set. Shared by the alerts and status cards.
 */
export function renderRuleDevices(
  host: HTMLElement,
  entry: CmrEntry,
  rule: CmrAlertRule,
  state: RuleDevicesState,
  views: { devices?: string; topology?: string } | undefined,
  max = 12,
): TemplateResult {
  let body: TemplateResult;
  if (rule.devices_on === 0) {
    body = html`<div class="muted small">Not firing on any device right now.</div>`;
  } else if (!entry.console || state === "unsupported") {
    body = html`<div class="muted small">
      The controller lists these devices only on its console, and this REST user may not run console commands.
    </div>`;
  } else if (state === "loading") {
    body = html`<div class="muted small">Asking the controller…</div>`;
  } else if (state === "error") {
    body = html`<div class="muted small">Couldn't read the device list from the controller.</div>`;
  } else {
    const byKey = new Map(entry.devices.map((d) => [d.key, d]));
    const devices = state.map((key) => byKey.get(key)).filter((d): d is CmrDevice => !!d).sort(compareDevices);
    const shown = devices.slice(0, max);
    body = html`
      <div class="rd-list">
        ${shown.map(
          (d) => html`<button class="rd-dev status-${deviceStatus(d)}" title=${STATUS_LABEL[deviceStatus(d)]}
            @click=${() => moreInfo(host, d.entities.connected)}><i class="dot"></i>${d.identity}</button>`,
        )}
        ${devices.length > shown.length ? html`<span class="muted small">+${devices.length - shown.length} more</span>` : nothing}
        ${devices.length ? nothing : html`<span class="muted small">Fires on devices this Home Assistant doesn't list yet.</span>`}
      </div>`;
  }
  const params = { cmr_alert: rule.id };
  return html`<div class="rd">
    ${body}
    ${rule.devices_on > 0 && (views?.devices || views?.topology)
      ? html`<div class="rd-links">
          ${views?.devices
            ? html`<button class="rd-link" @click=${() => navigate(viewPath(views.devices!, params))}>
                <ha-icon icon="mdi:table"></ha-icon>Show in Devices</button>`
            : nothing}
          ${views?.topology
            ? html`<button class="rd-link" @click=${() => navigate(viewPath(views.topology!, params))}>
                <ha-icon icon="mdi:sitemap-outline"></ha-icon>Show on map</button>`
            : nothing}
        </div>`
      : nothing}
  </div>`;
}

export const ruleDevicesStyles = css`
  .rd {
    margin: 0 0 6px 19px; padding: 8px 10px 8px 12px; border-radius: 0 0 10px 10px;
    background: var(--cmr-surface-2); display: flex; flex-direction: column; gap: 8px;
  }
  .rd-list { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  .rd-dev {
    all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px;
    padding: 3px 9px 3px 7px; border-radius: 999px; background: var(--cmr-surface); border: 1px solid var(--cmr-line);
    max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .rd-dev:hover { border-color: var(--status, var(--cmr-muted)); }
  .rd-links { display: flex; flex-wrap: wrap; gap: 4px 14px; }
  .rd-link {
    all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; font-size: 12.5px;
    color: var(--primary-color); --mdc-icon-size: 16px;
  }
  .rd-link:hover { text-decoration: underline; }
`;
