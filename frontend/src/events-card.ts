import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { cmrEvents, type CmrEvent, type CmrIssue } from "./data";
import { baseStyles, navigate } from "./shared";
import type { HassLike } from "./types";

interface EventsConfig {
  type: string;
  /** One controller's events; default: all controllers. */
  entry_id?: string;
  title?: string;
  /** Categories to show (empty: all but `hide_categories`). */
  categories?: string[];
  hide_categories?: string[];
  /** Only events about this device (CMR identity). */
  device?: string;
  show_issues?: boolean;
  show_filters?: boolean;
  max_items?: number;
  /** Start in "Notable" mode: issues, devices, alerts, upgrades, security, config, warnings. */
  notable?: boolean;
}

const NOTABLE = new Set(["insight", "device", "alert", "upgrade", "security", "config"]);
const isNotable = (e: CmrEvent) => NOTABLE.has(e.category) || e.severity === "warning" || e.severity === "error";

const CATEGORY: Record<string, { icon: string; label: string }> = {
  insight: { icon: "mdi:stethoscope", label: "Issues" },
  device: { icon: "mdi:router-network", label: "Devices" },
  alert: { icon: "mdi:bell-outline", label: "Alerts" },
  upgrade: { icon: "mdi:update", label: "Upgrades" },
  wifi: { icon: "mdi:wifi", label: "Wi-Fi" },
  link: { icon: "mdi:ethernet", label: "Links" },
  security: { icon: "mdi:shield-alert-outline", label: "Security" },
  login: { icon: "mdi:account-key-outline", label: "Logins" },
  config: { icon: "mdi:cog-outline", label: "Config" },
  dhcp: { icon: "mdi:ip-network-outline", label: "DHCP" },
  system: { icon: "mdi:cog-transfer-outline", label: "System" },
  api: { icon: "mdi:api", label: "API logins" },
};
const OTHER = { icon: "mdi:text-box-outline", label: "Other" };

function categoryInfo(category: string) {
  if (CATEGORY[category]) return CATEGORY[category];
  return category ? { ...OTHER, label: category[0].toUpperCase() + category.slice(1) } : OTHER;
}

/** A more specific icon for a few event kinds. */
function eventIcon(event: CmrEvent): string {
  const kind = event.data?.event;
  if (event.category === "wifi") {
    return kind === "disconnected" ? "mdi:wifi-off" : kind === "roamed" ? "mdi:wifi-sync" : "mdi:wifi-plus";
  }
  if (event.category === "link") return event.data?.state === "down" ? "mdi:ethernet-off" : "mdi:ethernet";
  if (event.category === "device") {
    return kind === "disconnected" ? "mdi:lan-disconnect" : kind === "rebooted" ? "mdi:restart" : "mdi:lan-connect";
  }
  if (event.category === "insight" && kind === "resolved") return "mdi:check-circle-outline";
  return categoryInfo(event.category).icon;
}

/** Events about the same thing, so runs of them can fold into one row. */
function subjectKey(event: CmrEvent): string {
  const d = event.data ?? {};
  const subject = d.mac ?? d.interface ?? d.user ?? d.rule_id ?? d.key ?? event.title;
  return `${event.category}|${event.device_key ?? ""}|${String(subject)}`;
}

interface Row {
  key: string;
  events: CmrEvent[]; // newest first
}

const DAY = 86400000;

export class CmrEventsCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _events: { state: true },
    _issues: { state: true },
    _category: { state: true },
    _device: { state: true },
    _search: { state: true },
    _open: { state: true },
    _limit: { state: true },
    _notable: { state: true },
  };

  declare hass: HassLike;
  declare _config: EventsConfig;
  declare _events: CmrEvent[];
  declare _issues: CmrIssue[];
  declare _category: string;
  declare _device: string;
  declare _search: string;
  declare _open: Set<string>;
  declare _limit: number;
  declare _notable: boolean;
  private _unsubscribe?: () => void;
  private _loaded = false;

  constructor() {
    super();
    this._events = [];
    this._issues = [];
    this._category = "";
    this._device = "";
    this._search = "";
    this._open = new Set();
    this._limit = 50;
  }

  setConfig(config: EventsConfig): void {
    if (this._unsubscribe && config.entry_id !== this._config?.entry_id) {
      // Another controller was picked in the editor: switch feeds.
      this._unsubscribe();
      this._unsubscribe = undefined;
      this._loaded = false;
    }
    this._config = { show_issues: true, show_filters: true, hide_categories: ["api"], max_items: 50, ...config };
    if (!this._unsubscribe && this.hass && this.isConnected) this._subscribe();
    this._limit = this._config.max_items ?? 50;
    this._device = config.device ?? "";
    this._notable = !!config.notable;
  }

  static getStubConfig(): Partial<EventsConfig> {
    return {};
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "title", selector: { text: {} } },
        { name: "entry_id", selector: { config_entry: { integration: "cmr" } } },
        { name: "device", selector: { text: {} } },
        { name: "max_items", selector: { number: { min: 5, max: 500, mode: "box" } } },
        { name: "notable", selector: { boolean: {} } },
        { name: "show_issues", selector: { boolean: {} } },
        { name: "show_filters", selector: { boolean: {} } },
      ],
      computeLabel: (s: { name: string }) =>
        ({
          title: "Title",
          entry_id: "Controller (default: all)",
          device: "Only this device (identity)",
          max_items: "Rows to show",
          notable: "Start with notable events only",
          show_issues: "Show detected issues",
          show_filters: "Show filters",
        })[s.name],
    };
  }

  getGridOptions() {
    return { columns: "full", rows: "auto", min_columns: 6 };
  }

  getCardSize(): number {
    return 8;
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.hass && !this._unsubscribe) this._subscribe();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribe?.();
    this._unsubscribe = undefined;
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has("hass") && this.hass && !this._unsubscribe && this.isConnected) this._subscribe();
  }

  private _subscribe(): void {
    this._unsubscribe = cmrEvents.subscribe(this.hass, this._config?.entry_id, (events, issues) => {
      this._events = events;
      this._issues = issues;
      this._loaded = true;
    });
  }

  // ------------------------------------------------------------ filtering

  private _visible(): CmrEvent[] {
    const cfg = this._config;
    const search = this._search.trim().toLowerCase();
    const hidden = new Set(cfg.hide_categories ?? []);
    return this._events.filter((e) => {
      if (this._notable && !this._category && !isNotable(e)) return false;
      if (this._category) {
        if (e.category !== this._category) return false;
      } else if (cfg.categories?.length ? !cfg.categories.includes(e.category) : hidden.has(e.category)) {
        return false;
      }
      if (this._device && e.device_name !== this._device) return false;
      if (search && !`${e.title} ${e.message} ${e.device_name ?? ""}`.toLowerCase().includes(search)) return false;
      return true;
    });
  }

  /** Newest first, with runs of events about the same subject folded together. */
  private _rows(events: CmrEvent[]): Row[] {
    const rows: Row[] = [];
    for (let i = events.length - 1; i >= 0; i--) {
      const event = events[i];
      const key = subjectKey(event);
      const last = rows[rows.length - 1];
      const sameDay = last && new Date(last.events[0].time).toDateString() === new Date(event.time).toDateString();
      if (last && last.key === key && sameDay && event.category !== "insight") {
        last.events.push(event);
      } else {
        rows.push({ key, events: [event] });
      }
    }
    return rows;
  }

  private _toggle(id: string): void {
    const next = new Set(this._open);
    next.has(id) ? next.delete(id) : next.add(id);
    this._open = next;
  }

  // -------------------------------------------------------------- render

  protected render(): TemplateResult {
    if (!this._loaded) return html`<ha-card><div class="empty">Loading network events…</div></ha-card>`;
    const cfg = this._config;
    const visible = this._visible();
    const rows = this._rows(visible);
    const shown = rows.slice(0, this._limit);
    const categories = [...new Set(this._events.map((e) => e.category))].sort(
      (a, b) => Object.keys(CATEGORY).indexOf(a) - Object.keys(CATEGORY).indexOf(b),
    );
    const devices = [...new Set(this._events.map((e) => e.device_name).filter(Boolean) as string[])].sort();
    const issues = this._device ? this._issues.filter((i) => this._issueDevice(i) === this._device) : this._issues;

    return html`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:timeline-text-outline"></ha-icon>
          <span>${cfg.title ?? "Network events"}</span>
          ${issues.length
            ? html`<span class="chip hot">${issues.length} issue${issues.length > 1 ? "s" : ""}</span>`
            : html`<span class="chip">no issues</span>`}
        </div>

        ${cfg.show_issues && issues.length
          ? html`<div class="issues">${issues.map((issue) => this._issue(issue))}</div>`
          : nothing}

        ${cfg.show_filters
          ? html`<div class="filters">
              <div class="cats">
                <button class="cat ${!this._category && this._notable ? "on" : ""}"
                  @click=${() => { this._category = ""; this._notable = true; }}>
                  <ha-icon icon="mdi:star-four-points-outline"></ha-icon>Notable</button>
                <button class="cat ${!this._category && !this._notable ? "on" : ""}"
                  @click=${() => { this._category = ""; this._notable = false; }}>All</button>
                ${categories.map((c) => {
                  const info = categoryInfo(c);
                  return html`<button class="cat ${this._category === c ? "on" : ""}" @click=${() => (this._category = this._category === c ? "" : c)}>
                    <ha-icon icon=${info.icon}></ha-icon>${info.label}
                  </button>`;
                })}
              </div>
              <div class="find">
                <select .value=${this._device} @change=${(e: Event) => (this._device = (e.target as HTMLSelectElement).value)}>
                  <option value="">All devices</option>
                  ${devices.map((d) => html`<option value=${d} ?selected=${d === this._device}>${d}</option>`)}
                </select>
                <input type="search" placeholder="Search" .value=${this._search}
                  @input=${(e: Event) => (this._search = (e.target as HTMLInputElement).value)} />
              </div>
            </div>`
          : nothing}

        <div class="timeline">
          ${shown.map((row, i) => {
            const day = new Date(row.events[0].time);
            const prev = i ? new Date(shown[i - 1].events[0].time) : undefined;
            const header = !prev || prev.toDateString() !== day.toDateString();
            return html`${header ? html`<div class="day">${this._dayLabel(day)}</div>` : nothing}${this._row(row)}`;
          })}
          ${shown.length ? nothing : html`<div class="empty">No events${this._search || this._category || this._device ? " match these filters" : " yet"}.</div>`}
          ${rows.length > this._limit
            ? html`<button class="more" @click=${() => (this._limit += 50)}>Show more (${rows.length - this._limit})</button>`
            : nothing}
        </div>
      </ha-card>
    `;
  }

  private _issueDevice(issue: CmrIssue): string | undefined {
    return this._events.find((e) => e.device_key === issue.device_key)?.device_name ?? undefined;
  }

  private _issue(issue: CmrIssue): TemplateResult {
    const device = this._issueDevice(issue);
    return html`<div class="issue sev-${issue.severity}">
      <ha-icon icon=${issue.severity === "error" ? "mdi:alert-octagon-outline" : "mdi:alert-outline"}></ha-icon>
      <div class="body">
        <div class="title">${issue.title}</div>
        <div class="detail">${issue.detail}</div>
        <div class="meta">
          since ${this._time(new Date(issue.since))} · ${issue.count}×
          ${device && issue.device_id
            ? html`· <a href="#" @click=${(e: Event) => { e.preventDefault(); navigate(`/config/devices/device/${issue.device_id}`); }}>${device}</a>`
            : device ? html`· ${device}` : nothing}
        </div>
      </div>
    </div>`;
  }

  private _row(row: Row): TemplateResult {
    const latest = row.events[0];
    const id = latest.id;
    const open = this._open.has(id);
    const folded = row.events.length > 1;
    const oldest = row.events[row.events.length - 1];
    const counts = new Map<string, number>();
    for (const e of row.events) {
      const k = String(e.data?.event ?? e.category);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    return html`
      <div class="row sev-${latest.severity} ${open ? "open" : ""}">
        <button class="line" @click=${() => this._toggle(id)}>
          <span class="time">${this._time(new Date(latest.time))}</span>
          <span class="dot-icon"><ha-icon icon=${eventIcon(latest)}></ha-icon></span>
          <span class="text">
            <span class="title">${latest.title}</span>
            ${folded
              ? html`<span class="fold">${row.events.length} events since ${this._time(new Date(oldest.time))} ·
                  ${[...counts].map(([k, n]) => `${n} ${k}`).join(", ")}</span>`
              : nothing}
          </span>
          ${latest.device_name ? html`<span class="device">${latest.device_name}</span>` : nothing}
        </button>
        ${open ? this._details(row) : nothing}
      </div>
    `;
  }

  private _details(row: Row): TemplateResult {
    const events = row.events.slice(0, 30);
    return html`<div class="details">
      ${events.map((e) => {
        const fields = Object.entries(e.data ?? {}).filter(
          ([k, v]) => v !== null && v !== undefined && v !== "" && !["event", "key", "rule_id"].includes(k),
        );
        return html`<div class="detail-item">
          <div class="detail-head"><span class="mono">${new Date(e.time).toLocaleString(this.hass.language)}</span>
            <span class="muted">${e.source}${e.topics?.length ? ` · ${e.topics.join(",")}` : ""}</span></div>
          ${e.message && e.message !== e.title ? html`<div class="raw mono">${e.message}</div>` : nothing}
          ${fields.length
            ? html`<div class="fields">${fields.map(([k, v]) => html`<span class="chip">${k.replace(/_/g, " ")}: ${typeof v === "object" ? JSON.stringify(v) : String(v)}</span>`)}</div>`
            : nothing}
        </div>`;
      })}
      ${row.events.length > events.length ? html`<div class="muted">…and ${row.events.length - events.length} more</div>` : nothing}
      ${row.events[0].device_id
        ? html`<a class="open-device" href="#" @click=${(e: Event) => { e.preventDefault(); navigate(`/config/devices/device/${row.events[0].device_id}`); }}>
            <ha-icon icon="mdi:open-in-app"></ha-icon>Open ${row.events[0].device_name}</a>`
        : nothing}
    </div>`;
  }

  private _time(date: Date): string {
    return date.toLocaleTimeString(this.hass.language, { hour: "2-digit", minute: "2-digit" });
  }

  private _dayLabel(date: Date): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);
    const diff = Math.round((today.getTime() - day.getTime()) / DAY);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return date.toLocaleDateString(this.hass.language, { weekday: "long", day: "numeric", month: "long" });
  }

  static styles = [
    baseStyles,
    css`
      ha-card { container-type: inline-size; }
      .chip.hot { background: var(--cmr-alert); color: #fff; }
      .issues { display: flex; flex-direction: column; gap: 8px; padding: 0 12px 10px; }
      .issue {
        display: flex; gap: 10px; padding: 10px 12px; border-radius: 12px;
        background: color-mix(in srgb, var(--sev) 10%, transparent);
        border-left: 3px solid var(--sev); --mdc-icon-size: 20px;
      }
      .issue ha-icon { color: var(--sev); flex: none; margin-top: 1px; }
      .issue .title { font-weight: 600; }
      .issue .detail { font-size: 13px; margin-top: 2px; line-height: 1.4; }
      .issue .meta { font-size: 12px; color: var(--cmr-muted); margin-top: 4px; }
      .issue a { color: var(--primary-color); text-decoration: none; }
      .sev-error { --sev: var(--cmr-alert); }
      .sev-warning { --sev: var(--cmr-pending); }
      .sev-notice { --sev: var(--cmr-update); }
      .sev-info { --sev: var(--cmr-muted); }

      .filters { padding: 0 12px 6px; display: flex; flex-direction: column; gap: 8px; }
      .cats { display: flex; flex-wrap: wrap; gap: 6px; }
      .cat {
        all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;
        font-size: 12px; padding: 3px 10px; border-radius: 999px; border: 1px solid var(--cmr-line);
        color: var(--cmr-muted); --mdc-icon-size: 14px;
      }
      .cat.on { background: var(--primary-color); border-color: var(--primary-color); color: var(--text-primary-color, #fff); }
      .find { display: flex; gap: 8px; }
      .find select, .find input {
        font: inherit; font-size: 13px; padding: 6px 10px; border-radius: 8px; min-width: 0;
        border: 1px solid var(--cmr-line); background: var(--cmr-surface); color: var(--primary-text-color);
      }
      .find input { flex: 1; }

      .timeline { padding: 0 8px 10px; }
      .day { padding: 10px 8px 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--cmr-muted); }
      .row { border-radius: 10px; }
      .row.open { background: var(--cmr-surface-2); }
      .line {
        all: unset; box-sizing: border-box; cursor: pointer; width: 100%; display: flex; align-items: flex-start; gap: 10px;
        padding: 6px 8px; border-radius: 10px;
      }
      .line:hover { background: var(--cmr-surface-2); }
      .time { font: 12px var(--cmr-mono); color: var(--cmr-muted); width: 44px; flex: none; padding-top: 3px; font-variant-numeric: tabular-nums; }
      .dot-icon {
        width: 24px; height: 24px; border-radius: 50%; flex: none; display: grid; place-items: center;
        background: color-mix(in srgb, var(--sev) 14%, transparent); color: var(--sev); --mdc-icon-size: 15px;
      }
      .sev-info .dot-icon { color: var(--secondary-text-color); }
      .text { flex: 1; min-width: 0; display: flex; flex-direction: column; padding-top: 2px; }
      .text .title { font-size: 13.5px; line-height: 1.35; overflow-wrap: anywhere; }
      .fold { font-size: 12px; color: var(--cmr-muted); }
      .device {
        flex: none; font-size: 11px; padding: 2px 8px; border-radius: 999px; background: var(--cmr-surface-2);
        color: var(--cmr-muted); margin-top: 1px; max-width: 40%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      }
      .details { padding: 2px 10px 10px 62px; display: flex; flex-direction: column; gap: 8px; }
      .detail-item { display: flex; flex-direction: column; gap: 3px; }
      .detail-head { display: flex; gap: 8px; font-size: 11.5px; flex-wrap: wrap; }
      .raw { font-size: 11.5px; color: var(--primary-text-color); overflow-wrap: anywhere; }
      .fields { display: flex; flex-wrap: wrap; gap: 4px; }
      .open-device { display: inline-flex; gap: 4px; align-items: center; color: var(--primary-color); text-decoration: none; font-size: 13px; --mdc-icon-size: 16px; }
      .more { all: unset; cursor: pointer; display: block; margin: 8px auto 0; font-size: 13px; color: var(--primary-color); }
      @container (max-width: 480px) {
        .device { display: none; }
        .details { padding-left: 12px; }
      }
    `,
  ];
}
