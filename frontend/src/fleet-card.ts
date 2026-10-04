import { css, html, nothing, type PropertyDeclarations, type TemplateResult } from "lit";
import {
  CmrEntryCard,
  ENTRY_FIELD,
  STATUS_LABEL,
  baseStyles,
  compareDevices,
  deviceStatus,
  deviceUrl,
  deviceVisual,
  formatDuration,
  labelsFrom,
  modelCode,
  modelName,
  moreInfo,
} from "./shared";
import type { CmrDevice } from "./types";

interface FleetConfig {
  type: string;
  entry_id?: string;
  title?: string;
  labels?: string[];
  show_filters?: boolean;
}

type SortKey = "device" | "version" | "uptime" | "address";

export class CmrFleetCard extends CmrEntryCard<FleetConfig> {
  static properties: PropertyDeclarations = {
    _filter: { state: true },
    _sort: { state: true },
  };

  declare _filter: Set<string>;
  declare _sort: { key: SortKey; desc: boolean };

  constructor() {
    super();
    this._filter = new Set();
    this._sort = { key: "device", desc: false };
  }

  setConfig(config: FleetConfig): void {
    this._config = { show_filters: true, ...config };
    this._filter = new Set(config.labels ?? []);
  }

  static getConfigForm() {
    return {
      schema: [
        ENTRY_FIELD,
        { name: "title", selector: { text: {} } },
        { name: "labels", selector: { text: { multiple: true } } },
        { name: "show_filters", selector: { boolean: {} } },
      ],
      computeLabel: labelsFrom({
        entry_id: "Controller",
        title: "Title",
        labels: "Only devices with these labels",
        show_filters: "Show label filters",
      }),
    };
  }

  getGridOptions() {
    return { columns: "full", rows: "auto", min_columns: 6 };
  }

  getCardSize(): number {
    return 2 + (this._entry?.devices.length ?? 4);
  }

  private _toggle(label: string): void {
    const next = new Set(this._filter);
    next.has(label) ? next.delete(label) : next.add(label);
    this._filter = next;
  }

  private _setSort(key: SortKey): void {
    this._sort = { key, desc: this._sort.key === key ? !this._sort.desc : false };
  }

  private _sorted(devices: CmrDevice[]): CmrDevice[] {
    const { key, desc } = this._sort;
    const sorted = [...devices].sort((a, b) => {
      switch (key) {
        case "version":
          return (a.version ?? "").localeCompare(b.version ?? "", undefined, { numeric: true });
        case "uptime":
          return (a.uptime ?? -1) - (b.uptime ?? -1);
        case "address":
          return (a.address ?? "").localeCompare(b.address ?? "", undefined, { numeric: true });
        default:
          return compareDevices(a, b);
      }
    });
    return desc ? sorted.reverse() : sorted;
  }

  protected render(): TemplateResult {
    const entry = this._entry;
    if (!entry) return this.renderWaiting();

    const labels = [...new Set(entry.devices.flatMap((d) => d.labels))].sort();
    const devices = this._sorted(
      entry.devices.filter((d) => [...this._filter].every((label) => d.labels.includes(label))),
    );
    const arrow = (key: SortKey) =>
      this._sort.key === key ? html`<ha-icon class="sort" icon=${this._sort.desc ? "mdi:arrow-down" : "mdi:arrow-up"}></ha-icon>` : nothing;

    return html`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:router-network"></ha-icon>
          <span>${this._config.title ?? "Devices"}</span>
          <span class="chip">${devices.length}</span>
          <div class="spacer"></div>
        </div>
        ${this.renderStale(entry)}
        ${this._config.show_filters && labels.length
          ? html`<div class="filters">
              ${labels.map(
                (label) => html`<button class="pill ${this._filter.has(label) ? "on" : ""}" @click=${() => this._toggle(label)}>
                  ${label}
                </button>`,
              )}
            </div>`
          : nothing}
        <div class="table" role="table">
          <div class="row head section-label" role="row">
            <button class="c-device" @click=${() => this._setSort("device")}>Device ${arrow("device")}</button>
            <span class="c-labels">Labels</span>
            <button class="c-version" @click=${() => this._setSort("version")}>Version ${arrow("version")}</button>
            <button class="c-uptime" @click=${() => this._setSort("uptime")}>Uptime ${arrow("uptime")}</button>
            <button class="c-address" @click=${() => this._setSort("address")}>Address ${arrow("address")}</button>
          </div>
          ${devices.map((d) => this._row(d))}
          ${devices.length ? nothing : html`<div class="empty">No devices match these labels.</div>`}
        </div>
      </ha-card>
    `;
  }

  private _row(d: CmrDevice): TemplateResult {
    const status = deviceStatus(d);
    return html`
      <div class="row status-${status}" role="row" @click=${() => moreInfo(this, d.entities.connected)}>
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
        <div class="c-version" title=${d.prerelease ? "Pre-release build" : ""}>
          <span class="mono">${d.version ?? "–"}</span>
          ${d.update_available
            ? html`<span class="update" title="Update available"><ha-icon icon="mdi:arrow-up-circle"></ha-icon><span class="mono">${d.available_version}</span></span>`
            : nothing}
        </div>
        <div class="c-uptime">${d.connected ? formatDuration(d.uptime) : html`<span class="offline">${STATUS_LABEL[status]}</span>`}</div>
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
      .filters { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 10px; }
      .table { padding: 0 8px 8px; }
      .row {
        display: grid; grid-template-columns: minmax(180px, 2.2fr) minmax(90px, 1.4fr) minmax(120px, 1.4fr) 80px 120px;
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
      .update { display: inline-flex; align-items: center; gap: 3px; color: var(--cmr-update); font-weight: 600; --mdc-icon-size: 15px; }
      .c-uptime { font-size: 13px; font-variant-numeric: tabular-nums; }
      .offline { color: var(--cmr-offline); font-weight: 500; }
      .c-address a { color: var(--primary-color); text-decoration: none; font-size: 12.5px; }
      .c-address a:hover { text-decoration: underline; }

      @container (max-width: 640px) {
        .row { grid-template-columns: 1fr auto; grid-template-areas: "device uptime" "version address" "labels labels"; gap: 4px 10px; }
        .row.head { display: none; }
        .c-device { grid-area: device; }
        .c-uptime { grid-area: uptime; text-align: right; }
        .c-version { grid-area: version; padding-left: 44px; }
        .c-address { grid-area: address; text-align: right; }
        .c-labels { grid-area: labels; padding-left: 44px; }
        .row:not(.head) { border-bottom: 1px solid var(--cmr-line); border-radius: 0; }
      }
    `,
  ];
}
