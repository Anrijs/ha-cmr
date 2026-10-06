import { css, html, nothing, type PropertyDeclarations, type PropertyValues, type TemplateResult } from "lit";
import { RuleDevices } from "./data";
import {
  CmrEntryCard,
  ENTRY_FIELD,
  STATUS_LABEL,
  STATUS_ORDER,
  type Status,
  approvePairing,
  baseStyles,
  compareDevices,
  deepLinkParams,
  deviceMatches,
  deviceStatus,
  deviceUrl,
  deviceVisual,
  formatDuration,
  labelsFrom,
  modelCode,
  modelName,
  moreInfo,
  navigate,
  pairingHint,
  viewPath,
} from "./shared";
import type { CmrDevice } from "./types";

interface FleetConfig {
  type: string;
  entry_id?: string;
  title?: string;
  /** Only devices with all of these labels. */
  labels?: string[];
  /** Start filtered to one status (offline, pending, alert, update, ok). */
  status?: Status;
  /** Start filtered to one firmware version. */
  version?: string;
  /** Start filtered to the devices this alert rule (its id) is active on. */
  alert?: string;
  show_filters?: boolean;
  show_search?: boolean;
  /** Above this many rows the healthy devices fold into one line. */
  fold_after?: number;
  /** Rows per "Show more". */
  page_size?: number;
  /** Follow `?cmr_status=…` style parameters in the page URL. */
  deep_link?: boolean;
  /**
   * Overview mode: only the devices that need attention, a few rows, status
   * chips only, and a link to the full table (`views.devices`).
   */
  compact?: boolean;
  /** Views of the dashboard this card is on (the generated dashboard sets them). */
  views?: { devices?: string };
}

/** Label chips shown before the rest folds into "+N more". */
const LABEL_CHIPS_MAX = 8;

type SortKey = "attention" | "device" | "version" | "uptime" | "address";

const CHIP_ICON: Record<Status, string> = {
  offline: "mdi:lan-disconnect",
  pending: "mdi:link-variant-plus",
  alert: "mdi:bell-alert-outline",
  update: "mdi:update",
  ok: "mdi:check-circle-outline",
};

export class CmrFleetCard extends CmrEntryCard<FleetConfig> {
  static properties: PropertyDeclarations = {
    _filter: { state: true },
    _status: { state: true },
    _version: { state: true },
    _alert: { state: true },
    _search: { state: true },
    _sort: { state: true },
    _limit: { state: true },
    _unfolded: { state: true },
    _pairing: { state: true },
    _labelPicker: { state: true },
    _labelSearch: { state: true },
  };

  /** The "+N more" label list is open. */
  declare _labelPicker: boolean;
  declare _labelSearch: string;

  declare _filter: Set<string>;
  declare _status: Status | "";
  declare _version: string;
  /** Alert rule id: only the devices it is active on (the list comes from the controller's console). */
  declare _alert: string;
  declare _search: string;
  private _ruleDevices = new RuleDevices(() => this.requestUpdate());
  declare _sort: { key: SortKey; desc: boolean };
  declare _limit: number;
  /** The healthy group was opened by hand. */
  declare _unfolded: boolean;
  /** Device key -> "busy" or an error message, while an approval is in flight or failed. */
  declare _pairing: Map<string, string>;

  constructor() {
    super();
    this._filter = new Set();
    this._status = "";
    this._version = "";
    this._alert = "";
    this._search = "";
    this._sort = { key: "attention", desc: false };
    this._limit = 100;
    this._unfolded = false;
    this._pairing = new Map();
    this._labelPicker = false;
    this._labelSearch = "";
  }

  setConfig(config: FleetConfig): void {
    this._config = { show_filters: true, show_search: true, fold_after: 50, page_size: 100, deep_link: true, ...config };
    this._filter = new Set(config.labels ?? []);
    this._status = config.status ?? "";
    this._version = config.version ?? "";
    this._alert = config.alert ?? "";
    this._limit = this._config.page_size ?? 100;
    this._applyDeepLink();
  }

  static getConfigForm() {
    return {
      schema: [
        ENTRY_FIELD,
        { name: "title", selector: { text: {} } },
        { name: "labels", selector: { text: { multiple: true } } },
        {
          name: "status",
          selector: {
            select: {
              mode: "dropdown",
              options: STATUS_ORDER.map((status) => ({ value: status, label: STATUS_LABEL[status] })),
            },
          },
        },
        { name: "show_filters", selector: { boolean: {} } },
        { name: "show_search", selector: { boolean: {} } },
        { name: "fold_after", selector: { number: { min: 0, max: 5000, mode: "box" } } },
        { name: "compact", selector: { boolean: {} } },
      ],
      computeLabel: labelsFrom({
        entry_id: "Controller",
        title: "Title",
        labels: "Only devices with these labels",
        status: "Only devices with this status",
        show_filters: "Show filter chips",
        show_search: "Show search",
        fold_after: "Fold healthy devices above this many rows (0: never)",
        compact: "Overview mode: only devices needing attention, few rows",
      }),
    };
  }

  getGridOptions() {
    return { columns: "full", rows: "auto", min_columns: 6 };
  }

  getCardSize(): number {
    return 2 + Math.min(this._entry?.devices.length ?? 4, 12);
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("location-changed", this._onLocation);
    this._applyDeepLink();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("location-changed", this._onLocation);
  }

  private _onLocation = (): void => this._applyDeepLink();

  private _applyDeepLink(): void {
    if (this._config?.deep_link === false) return;
    const link = deepLinkParams();
    if (link.status) this._status = link.status;
    if (link.version) this._version = link.version;
    if (link.search) this._search = link.search;
    if (link.alert) this._alert = link.alert;
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (changed.has("_entry")) this._ruleDevices.invalidate();
  }

  // ------------------------------------------------------------ actions

  private _toggleLabel(label: string): void {
    const next = new Set(this._filter);
    next.has(label) ? next.delete(label) : next.add(label);
    this._filter = next;
  }

  private _setStatus(status: Status | ""): void {
    this._status = this._status === status ? "" : status;
    this._limit = this._config.page_size ?? 100;
  }

  private _setSort(key: SortKey): void {
    this._sort = { key, desc: this._sort.key === key ? !this._sort.desc : false };
  }

  private async _approve(d: CmrDevice): Promise<void> {
    this._pairing = new Map(this._pairing).set(d.key, "busy");
    try {
      await approvePairing(this.hass, this._entry!.entry_id, d.key);
      const next = new Map(this._pairing);
      next.delete(d.key);
      this._pairing = next;
    } catch (err) {
      const message = (err as { message?: string })?.message ?? String(err);
      this._pairing = new Map(this._pairing).set(d.key, message);
    }
  }

  // ---------------------------------------------------------- selection

  private _sorted(devices: CmrDevice[]): CmrDevice[] {
    const { key, desc } = this._sort;
    const sorted = [...devices].sort((a, b) => {
      switch (key) {
        case "device":
          return compareDevices(a, b);
        case "version":
          return (a.version ?? "").localeCompare(b.version ?? "", undefined, { numeric: true });
        case "uptime":
          return (a.uptime ?? -1) - (b.uptime ?? -1);
        case "address":
          return (a.address ?? "").localeCompare(b.address ?? "", undefined, { numeric: true });
        default:
          // Attention first: whatever needs a look is at the top of a long list.
          return STATUS_ORDER.indexOf(deviceStatus(a)) - STATUS_ORDER.indexOf(deviceStatus(b)) || compareDevices(a, b);
      }
    });
    return desc ? sorted.reverse() : sorted;
  }

  protected render(): TemplateResult {
    const entry = this._entry;
    if (!entry) return this.renderWaiting();

    const compact = !!this._config.compact;
    // Labels by how many devices carry them; the most common stay as chips,
    // the rest (and a long tail of one-offs) sit behind "+N more".
    const labelCount = new Map<string, number>();
    for (const d of entry.devices) for (const l of d.labels) labelCount.set(l, (labelCount.get(l) ?? 0) + 1);
    const labels = [...labelCount.keys()].sort((a, b) => labelCount.get(b)! - labelCount.get(a)! || a.localeCompare(b));
    const labelChips = labels.length > LABEL_CHIPS_MAX + 1
      ? [...new Set([...labels.slice(0, LABEL_CHIPS_MAX), ...this._filter])].sort((a, b) => labels.indexOf(a) - labels.indexOf(b))
      : labels;
    const labelRest = labels.filter((l) => !labelChips.includes(l));
    const labelNeedle = this._labelSearch.trim().toLowerCase();
    const needle = this._search.trim().toLowerCase();
    // Label, version and search narrow the pool; the status chips count within it.
    // An alert filter narrows to the devices the rule is active on; while the
    // controller is asked (or can't answer) the other filters still apply.
    const rule = this._alert ? entry.alerts.find((r) => r.id === this._alert) : undefined;
    const ruleState = rule && rule.devices_on > 0 ? this._ruleDevices.get(this.hass, entry.entry_id, rule.id) : rule ? [] : undefined;
    const ruleKeys = Array.isArray(ruleState) ? new Set(ruleState) : undefined;
    const pool = entry.devices.filter(
      (d) =>
        [...this._filter].every((label) => d.labels.includes(label)) &&
        (!this._version || d.version === this._version) &&
        (!ruleKeys || ruleKeys.has(d.key)) &&
        deviceMatches(d, needle),
    );
    const counts = new Map<Status, number>();
    for (const d of pool) counts.set(deviceStatus(d), (counts.get(deviceStatus(d)) ?? 0) + 1);
    const devices = this._sorted(this._status ? pool.filter((d) => deviceStatus(d) === this._status) : pool);

    // Long healthy lists fold: the devices that need attention stay visible,
    // the rest become one line until opened.
    const foldAfter = this._config.fold_after ?? 50;
    const attention = devices.filter((d) => deviceStatus(d) !== "ok");
    const healthy = devices.length - attention.length;
    const folding =
      !this._status && !this._unfolded && foldAfter > 0 && devices.length > foldAfter && attention.length > 0 && healthy > 0;
    // Compact: the attention list only (or the chosen status), never more than a page.
    const listed = compact && !this._status ? attention : folding ? attention : devices;
    const shown = listed.slice(0, this._limit);
    const devicesView = this._config.views?.devices;
    const arrow = (key: SortKey) =>
      this._sort.key === key ? html`<ha-icon class="sort" icon=${this._sort.desc ? "mdi:arrow-down" : "mdi:arrow-up"}></ha-icon>` : nothing;

    return html`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:router-network"></ha-icon>
          <span>${this._config.title ?? "Devices"}</span>
          <span class="chip">${devices.length}${devices.length !== entry.devices.length ? ` of ${entry.devices.length}` : ""}</span>
          <div class="spacer"></div>
          ${compact && this._config.views?.devices
            ? html`<button class="open-link" @click=${() => navigate(viewPath(this._config.views!.devices!))}>
                Open Devices <ha-icon icon="mdi:arrow-right"></ha-icon></button>`
            : nothing}
          ${this._config.show_search && !compact
            ? html`<input class="search" type="search" placeholder="Search" .value=${this._search}
                @input=${(e: Event) => { this._search = (e.target as HTMLInputElement).value; this._limit = this._config.page_size ?? 100; }} />`
            : nothing}
        </div>
        ${this.renderStale(entry)}
        ${this._config.show_filters
          ? html`<div class="filters">
              <button class="pill ${!this._status ? "on" : ""}" @click=${() => this._setStatus("")}>All ${pool.length}</button>
              ${STATUS_ORDER.filter((status) => counts.get(status) || status === this._status).map(
                (status) => html`<button class="pill status-${status} ${this._status === status ? "on" : ""}"
                  @click=${() => this._setStatus(status)}>
                  <ha-icon icon=${CHIP_ICON[status]}></ha-icon>${STATUS_LABEL[status]} ${counts.get(status) ?? 0}
                </button>`,
              )}
              ${this._version
                ? html`<button class="pill on" title="Clear the version filter" @click=${() => (this._version = "")}>
                    <span class="mono">${this._version}</span> ✕</button>`
                : nothing}
              ${this._alert
                ? html`<button class="pill on status-alert" title="Clear the alert filter" @click=${() => (this._alert = "")}>
                    <ha-icon icon="mdi:bell-alert-outline"></ha-icon>${rule?.name ?? "alert rule"}${ruleState === "loading" ? " …" : ""} ✕</button>`
                : nothing}
              ${ruleState === "unsupported" || ruleState === "error"
                ? html`<span class="muted small">${ruleState === "unsupported"
                    ? "The controller lists a rule's devices only on its console, which the REST user may not use."
                    : "Couldn't read the rule's device list from the controller."}</span>`
                : nothing}
              ${labelChips.length && !compact ? html`<span class="sep"></span>` : nothing}
              ${compact
                ? nothing
                : labelChips.map(
                    (label) => html`<button class="pill ${this._filter.has(label) ? "on" : ""}" @click=${() => this._toggleLabel(label)}>
                      ${label}
                    </button>`,
                  )}
              ${labelRest.length && !compact
                ? html`<button class="pill more-labels ${this._labelPicker ? "on" : ""}" aria-expanded=${this._labelPicker}
                    @click=${() => (this._labelPicker = !this._labelPicker)}>
                    ${this._labelPicker ? "Fewer labels" : `+${labelRest.length} more`}</button>`
                : nothing}
            </div>
            ${this._labelPicker && labelRest.length && !compact
              ? html`<div class="picker">
                  <input class="search" type="search" placeholder="Find a label" .value=${this._labelSearch}
                    @input=${(e: Event) => (this._labelSearch = (e.target as HTMLInputElement).value)} />
                  <div class="picker-list">
                    ${labelRest
                      .filter((label) => !labelNeedle || label.toLowerCase().includes(labelNeedle))
                      .sort()
                      .map(
                        (label) => html`<button class="pill ${this._filter.has(label) ? "on" : ""}" @click=${() => this._toggleLabel(label)}>
                          ${label} <span class="muted">${labelCount.get(label)}</span>
                        </button>`,
                      )}
                  </div>
                </div>`
              : nothing}`
          : nothing}
        <div class="table" role="table">
          <div class="row head section-label" role="row">
            <button class="c-device" @click=${() => this._setSort(this._sort.key === "device" ? "attention" : "device")}
              title="Click to sort by name; again for attention first">
              Device ${arrow("device")}${this._sort.key === "attention" ? html`<ha-icon class="sort" icon="mdi:sort-variant" title="Attention first"></ha-icon>` : nothing}
            </button>
            <span class="c-labels">Labels</span>
            <button class="c-version" @click=${() => this._setSort("version")}>Version ${arrow("version")}</button>
            <button class="c-uptime" @click=${() => this._setSort("uptime")}>Uptime ${arrow("uptime")}</button>
            <button class="c-address" @click=${() => this._setSort("address")}>Address ${arrow("address")}</button>
          </div>
          ${shown.map((d) => this._row(d))}
          ${compact && !this._status && healthy > 0
            ? html`<div class="fold static">
                <ha-icon icon="mdi:check-circle-outline"></ha-icon>
                ${attention.length ? `${healthy} more` : `All ${healthy}`} device${healthy === 1 ? "" : "s"} online and up to date
              </div>`
            : nothing}
          ${folding && !compact
            ? html`<button class="fold" @click=${() => (this._unfolded = true)}>
                <ha-icon icon="mdi:check-circle-outline"></ha-icon>
                ${healthy} device${healthy === 1 ? "" : "s"} online and up to date — show ${healthy === 1 ? "it" : "them"}
              </button>`
            : nothing}
          ${listed.length > this._limit
            ? compact && devicesView
              ? html`<button class="more" @click=${() => navigate(viewPath(devicesView, this._status ? { cmr_status: this._status } : {}))}>
                  ${listed.length - this._limit} more — open Devices <ha-icon icon="mdi:arrow-right"></ha-icon></button>`
              : html`<button class="more" @click=${() => (this._limit += this._config.page_size ?? 100)}>
                  Show more (${listed.length - this._limit})</button>`
            : nothing}
          ${devices.length ? nothing : html`<div class="empty">${this._emptyText(entry.devices.length)}</div>`}
        </div>
      </ha-card>
    `;
  }

  private _emptyText(total: number): string {
    if (!total) return "The controller manages no devices yet.";
    if (this._status) return `No devices are ${STATUS_LABEL[this._status].toLowerCase()}.`;
    return "No devices match these filters.";
  }

  private _pairingCell(d: CmrDevice, status: Status): TemplateResult {
    const state = this._pairing.get(d.key);
    const canApprove = d.pending && !!this._entry?.actions && !!this.hass.user?.is_admin;
    return html`<span class="offline" title=${pairingHint(d)}>${STATUS_LABEL[status]}</span>
      ${canApprove
        ? html`<button class="approve" ?disabled=${state === "busy"}
            @click=${(e: Event) => { e.stopPropagation(); this._approve(d); }}>
            ${state === "busy" ? "Approving…" : "Approve"}</button>`
        : nothing}
      ${state && state !== "busy" ? html`<span class="small offline">${state}</span>` : nothing}`;
  }

  private _uptimeCell(d: CmrDevice, status: Status): TemplateResult {
    if (status === "pending") return this._pairingCell(d, status);
    if (!d.connected) {
      return html`<span class="offline">${STATUS_LABEL[status]}</span>
        ${d.disconnected_since ? html`<span class="muted small">since ${d.disconnected_since}</span>` : nothing}`;
    }
    return html`${formatDuration(d.uptime)}`;
  }

  private _row(d: CmrDevice): TemplateResult {
    const status = deviceStatus(d);
    return html`
      <div class="row status-${status}" role="row"
        @click=${() => moreInfo(this, (d.update_available ? d.entities.update : undefined) ?? d.entities.connected)}>
        <div class="c-device">
          <div class="icon" title=${STATUS_LABEL[status]}>${deviceVisual(d, "thumb")}<i class="dot"></i></div>
          <div class="who">
            <div class="name">
              ${d.identity}
              ${d.controller ? html`<ha-icon class="crown" icon="mdi:crown-outline" title="CMR controller"></ha-icon>` : nothing}
            </div>
            <div class="muted small">${modelName(d)}${modelCode(d) ? html` · <span class="mono">${modelCode(d)}</span>` : nothing}</div>
          </div>
        </div>
        <div class="c-labels">${d.labels.map((l) => html`<span class="chip">${l}</span>`)}</div>
        <div class="c-version" title="Click to filter by this version">
          <button class="ver mono" @click=${(e: Event) => { e.stopPropagation(); this._version = this._version === d.version ? "" : (d.version ?? ""); }}>
            ${d.version ?? "–"}</button>
          ${d.update_available
            ? html`<span class="update" title="Update available"><ha-icon icon="mdi:arrow-up-circle"></ha-icon><span class="mono">${d.available_version}</span></span>`
            : nothing}
        </div>
        <div class="c-uptime">${this._uptimeCell(d, status)}</div>
        <div class="c-address">
          ${d.address
            ? html`<a class="mono" href=${deviceUrl(d.address)} target="_blank" rel="noreferrer" @click=${(e: Event) => e.stopPropagation()}>${d.address}</a>`
            : html`<span class="muted">${d.controller ? "local" : "–"}</span>`}
        </div>
      </div>
    `;
  }

  static styles = [
    baseStyles,
    css`
      ha-card { container-type: inline-size; }
      .card-header { flex-wrap: wrap; }
      .search {
        font: inherit; font-size: 13px; padding: 5px 10px; border-radius: 999px; width: 160px; max-width: 100%;
        border: 1px solid var(--cmr-line); background: var(--cmr-surface); color: var(--primary-text-color);
      }
      .filters { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 0 16px 10px; }
      .filters .sep { width: 1px; height: 18px; background: var(--cmr-line); margin: 0 4px; }
      .pill.status-offline:not(.on), .pill.status-pending:not(.on), .pill.status-alert:not(.on), .pill.status-update:not(.on) {
        border-color: color-mix(in srgb, var(--status) 55%, transparent); color: var(--status);
      }
      .pill.on.status-offline, .pill.on.status-pending, .pill.on.status-alert, .pill.on.status-update {
        background: var(--status); border-color: var(--status);
      }
      .table { padding: 0 8px 8px; }
      .row {
        display: grid; grid-template-columns: minmax(180px, 2.2fr) minmax(90px, 1.4fr) minmax(120px, 1.4fr) minmax(80px, 1fr) 120px;
        gap: 10px; align-items: center; padding: 8px; border-radius: 10px; cursor: pointer;
      }
      .row:not(.head):hover { background: var(--cmr-surface-2); }
      .row.head { cursor: default; padding-bottom: 4px; }
      .row.head button { all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 2px; }
      .sort { --mdc-icon-size: 14px; }
      .c-device { display: flex; gap: 10px; align-items: center; min-width: 0; }
      .icon { position: relative; width: 40px; height: 40px; flex: none; }
      .icon .badge { width: 100%; height: 100%; border-radius: 10px; display: grid; place-items: center;
        background: color-mix(in srgb, var(--status) 13%, transparent); color: var(--status); --mdc-icon-size: 20px; }
      .icon .dot { position: absolute; right: -3px; bottom: -3px; border: 2px solid var(--cmr-surface); width: 9px; height: 9px; z-index: 1; }
      .who { min-width: 0; }
      .name { font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 4px; }
      .crown { --mdc-icon-size: 15px; color: var(--primary-color); }
      .small { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .c-labels { display: flex; flex-wrap: wrap; gap: 4px; }
      .c-version { display: flex; flex-wrap: wrap; gap: 4px 8px; align-items: center; font-size: 13px; }
      .ver { all: unset; cursor: pointer; border-bottom: 1px dotted transparent; }
      .ver:hover { border-bottom-color: var(--cmr-muted); }
      .update { display: inline-flex; align-items: center; gap: 3px; color: var(--cmr-update); font-weight: 600; --mdc-icon-size: 15px; }
      .c-uptime { font-size: 13px; font-variant-numeric: tabular-nums; display: flex; flex-wrap: wrap; gap: 2px 8px; align-items: center; }
      .offline { color: var(--cmr-offline); font-weight: 500; }
      .status-pending .offline { color: var(--cmr-pending); }
      .approve {
        all: unset; cursor: pointer; font-size: 12px; padding: 3px 10px; border-radius: 999px;
        background: var(--primary-color); color: var(--text-primary-color, #fff);
      }
      .approve[disabled] { opacity: 0.6; cursor: default; }
      .c-address a { color: var(--primary-color); text-decoration: none; font-size: 12.5px; }
      .c-address a:hover { text-decoration: underline; }
      .fold, .more {
        all: unset; cursor: pointer; box-sizing: border-box; width: 100%; display: flex; align-items: center; justify-content: center;
        gap: 8px; padding: 10px 8px; margin-top: 4px; border-radius: 10px; font-size: 13px; color: var(--primary-color);
        background: var(--cmr-surface-2); --mdc-icon-size: 18px;
      }
      .fold ha-icon { color: var(--cmr-ok); }
      .fold.static { cursor: default; color: var(--cmr-muted); }
      .more { background: none; }
      .more ha-icon { --mdc-icon-size: 16px; }
      .open-link {
        all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; font-size: 13px;
        color: var(--primary-color); --mdc-icon-size: 16px;
      }
      .open-link:hover { text-decoration: underline; }
      .picker { margin: -4px 16px 10px; padding: 10px; border-radius: 10px; background: var(--cmr-surface-2); display: flex; flex-direction: column; gap: 8px; }
      .picker .search { width: 220px; }
      .picker-list { display: flex; flex-wrap: wrap; gap: 6px; max-height: 180px; overflow: auto; }
      .picker-list .muted { font-size: 11px; margin-left: 2px; }

      @container (max-width: 640px) {
        .card-header .search { width: 100%; order: 10; }
        .row { grid-template-columns: 1fr auto; grid-template-areas: "device uptime" "version address" "labels labels"; gap: 4px 10px; }
        .row.head { display: none; }
        .c-device { grid-area: device; }
        .c-uptime { grid-area: uptime; justify-content: flex-end; text-align: right; }
        .c-version { grid-area: version; padding-left: 44px; }
        .c-address { grid-area: address; text-align: right; }
        .c-labels { grid-area: labels; padding-left: 44px; }
        .row:not(.head) { border-bottom: 1px solid var(--cmr-line); border-radius: 0; }
      }
    `,
  ];
}
