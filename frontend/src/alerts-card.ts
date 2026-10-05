import { css, html, nothing, type PropertyDeclarations, type PropertyValues, type TemplateResult } from "lit";
import { RuleDevices } from "./data";
import {
  CmrEntryCard,
  ENTRY_FIELD,
  baseStyles,
  copyText,
  labelsFrom,
  moreInfo,
  relativeTime,
  renderRuleDevices,
  ruleDevicesStyles,
} from "./shared";
import type { CmrAlertRule, CmrEntry } from "./types";

interface AlertsConfig {
  type: string;
  entry_id?: string;
  title?: string;
  hide_disabled?: boolean;
  /** Views of the dashboard this card is on, for "Show in …" links (the generated dashboard sets them). */
  views?: { devices?: string; topology?: string };
}

const SEVERITY_ORDER = ["critical", "high", "medium", "low"] as const;
const SEVERITY_ICON: Record<string, string> = {
  critical: "mdi:alert-octagon",
  high: "mdi:alert",
  medium: "mdi:alert-circle-outline",
  low: "mdi:information-outline",
};

export class CmrAlertsCard extends CmrEntryCard<AlertsConfig> {
  static properties: PropertyDeclarations = {
    _setup: { state: true },
    _copied: { state: true },
    _push: { state: true },
    _only: { state: true },
    _open: { state: true },
  };

  declare _setup?: { url: string; script: string } | null;
  declare _copied: boolean;
  /** "busy" while rules are being changed, else the last result or error text. */
  declare _push?: string;
  /** Chip filter: all rules, or only the firing / disabled / pushing ones. */
  declare _only: "" | "firing" | "disabled" | "pushing";
  /** Id of the rule opened to show the devices it fires on. */
  declare _open: string;
  private _ruleDevices = new RuleDevices(() => this.requestUpdate());

  constructor() {
    super();
    this._only = "";
    this._open = "";
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    // A new snapshot may mean new firing devices; the open list refreshes quietly.
    if (changed.has("_entry")) this._ruleDevices.invalidate();
  }

  private async _pushAlerts(enable: boolean): Promise<void> {
    this._push = "busy";
    try {
      const result = await this.hass.connection.sendMessagePromise<{ done: number; failures: string[] }>({
        type: "cmr/alert_push",
        entry_id: this._entry!.entry_id,
        enable,
      });
      const what = enable ? "now push to Home Assistant" : "no longer push";
      this._push = `${result.done} rule${result.done === 1 ? "" : "s"} ${what}`
        + (result.failures.length ? `; failed: ${result.failures.join("; ")}` : "");
    } catch (err) {
      this._push = (err as { message?: string })?.message ?? String(err);
    }
  }

  static getConfigForm() {
    return {
      schema: [
        ENTRY_FIELD,
        { name: "title", selector: { text: {} } },
        { name: "hide_disabled", selector: { boolean: {} } },
      ],
      computeLabel: labelsFrom({ entry_id: "Controller", title: "Title", hide_disabled: "Hide disabled rules" }),
    };
  }

  getGridOptions() {
    return { columns: "full", rows: "auto", min_columns: 4 };
  }

  getCardSize(): number {
    return 2 + (this._entry?.alerts.length ?? 4);
  }

  private async _toggleSetup(): Promise<void> {
    if (this._setup !== undefined) {
      this._setup = undefined;
      return;
    }
    this._setup = null;
    try {
      this._setup = await this.hass.connection.sendMessagePromise<{ url: string; script: string }>({
        type: "cmr/alert_setup",
        entry_id: this._entry!.entry_id,
      });
    } catch (err) {
      console.error("cmr: alert setup", err);
      this._setup = undefined;
    }
  }

  private async _copy(): Promise<void> {
    if (!this._setup) return;
    if (!(await copyText(this._setup.script))) return;
    this._copied = true;
    setTimeout(() => (this._copied = false), 1800);
  }

  protected render(): TemplateResult {
    const entry = this._entry;
    if (!entry) return this.renderWaiting();

    const pool = entry.alerts.filter((r) => !(this._config.hide_disabled && r.disabled));
    const counts = {
      firing: pool.filter((r) => r.devices_on > 0).length,
      disabled: pool.filter((r) => r.disabled).length,
      pushing: pool.filter((r) => r.webhook_ha).length,
    };
    const rules = pool
      .filter((r) =>
        this._only === "firing" ? r.devices_on > 0 : this._only === "disabled" ? r.disabled : this._only === "pushing" ? r.webhook_ha : true,
      )
      .sort(
        (a, b) =>
          Number(b.devices_on > 0) - Number(a.devices_on > 0) ||
          Number(a.disabled) - Number(b.disabled) ||
          SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity) ||
          a.name.localeCompare(b.name),
      );
    const firing = rules.filter((r) => r.devices_on > 0).length;
    const hooked = entry.alerts.filter((r) => r.webhook_ha).length;
    const canAct = entry.actions && !!this.hass.user?.is_admin;
    const lastId = entry.fleet_entities.fleet_alert;
    const last = lastId ? this.hass.states[lastId] : undefined;
    const lastAttrs = (last?.attributes ?? {}) as Record<string, string>;

    return html`
      <ha-card>
        <div class="card-header">
          <ha-icon icon=${firing ? "mdi:bell-alert" : "mdi:bell-check-outline"}></ha-icon>
          <span>${this._config.title ?? "Alerts"}</span>
          ${firing ? html`<span class="chip alert">${firing} firing</span>` : html`<span class="chip">all quiet</span>`}
          <div class="spacer"></div>
        </div>
        ${this.renderStale(entry)}
        ${pool.length > 3
          ? html`<div class="filters">
              <button class="pill ${this._only ? "" : "on"}" @click=${() => (this._only = "")}>All ${pool.length}</button>
              ${counts.firing ? html`<button class="pill hot ${this._only === "firing" ? "on" : ""}" @click=${() => (this._only = this._only === "firing" ? "" : "firing")}>
                  <ha-icon icon="mdi:bell-alert-outline"></ha-icon>Firing ${counts.firing}</button>` : nothing}
              ${counts.pushing ? html`<button class="pill ${this._only === "pushing" ? "on" : ""}" @click=${() => (this._only = this._only === "pushing" ? "" : "pushing")}>
                  <ha-icon icon="mdi:webhook"></ha-icon>Pushing ${counts.pushing}</button>` : nothing}
              ${counts.disabled ? html`<button class="pill ${this._only === "disabled" ? "on" : ""}" @click=${() => (this._only = this._only === "disabled" ? "" : "disabled")}>
                  <ha-icon icon="mdi:bell-off-outline"></ha-icon>Disabled ${counts.disabled}</button>` : nothing}
            </div>`
          : nothing}

        ${last && last.state !== "unknown" && last.state !== "unavailable"
          ? html`<button class="last sev-${lastAttrs.event_type}" @click=${() => moreInfo(this, lastId)}>
              <ha-icon icon=${SEVERITY_ICON[lastAttrs.event_type] ?? "mdi:bell"}></ha-icon>
              <div>
                <div><b>${lastAttrs.alert}</b>${lastAttrs.device ? html` · ${lastAttrs.device}` : nothing}</div>
                <div class="muted small">Last pushed alert · ${relativeTime(last.state, "")}</div>
              </div>
            </button>`
          : nothing}

        <div class="rules">
          ${rules.map((rule) => this._rule(rule, entry))}
          ${rules.length ? nothing : html`<div class="empty">${pool.length ? "No rules match this filter." : "No alert rules on the controller."}</div>`}
        </div>

        ${this.hass.user?.is_admin
          ? html`<div class="footer">
              ${canAct
                ? html`<div class="push">
                    <ha-icon icon="mdi:webhook"></ha-icon>
                    <span class="small">${hooked
                      ? `${hooked} of ${entry.alerts.length} rules push to Home Assistant`
                      : "Alerts reach Home Assistant on the next poll only"}</span>
                    <button class="copy" ?disabled=${this._push === "busy"} @click=${() => this._pushAlerts(hooked < entry.alerts.length)}>
                      ${this._push === "busy" ? "Working…" : hooked < entry.alerts.length ? "Push alerts to Home Assistant" : "Stop pushing"}
                    </button>
                    ${this._push && this._push !== "busy" ? html`<div class="muted small">${this._push}</div>` : nothing}
                  </div>`
                : html`<button class="link" @click=${this._toggleSetup}>
                      <ha-icon icon="mdi:webhook"></ha-icon>
                      ${hooked
                        ? `${hooked} of ${entry.alerts.length} rules push to Home Assistant`
                        : "Push alerts to Home Assistant instantly"}
                      <ha-icon icon=${this._setup !== undefined ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
                    </button>
                    ${this._setup === null ? html`<div class="muted small">Loading…</div>` : nothing}
                    ${this._setup
                      ? html`<div class="setup">
                          <div class="small">Paste into the controller's terminal. Each alert rule gets an HTTP action that calls Home Assistant; edit <code>find</code> to choose rules. (With <i>Allow actions on the controller</i> in the options this becomes one click.)</div>
                          <pre>${this._setup.script}</pre>
                          <button class="copy" @click=${this._copy}>
                            <ha-icon icon=${this._copied ? "mdi:check" : "mdi:content-copy"}></ha-icon>${this._copied ? "Copied" : "Copy script"}
                          </button>
                        </div>`
                      : nothing}`}
            </div>`
          : nothing}
      </ha-card>
    `;
  }

  private _rule(rule: CmrAlertRule, entry: CmrEntry): TemplateResult {
    const on = rule.devices_on > 0;
    const open = this._open === rule.id;
    return html`
      <button class="rule sev-${rule.severity} ${on ? "on" : ""} ${rule.disabled ? "disabled" : ""} ${open ? "open" : ""}"
              aria-expanded=${open} @click=${() => (this._open = open ? "" : rule.id)}>
        <span class="stripe"></span>
        <ha-icon class="sev" icon=${SEVERITY_ICON[rule.severity]}></ha-icon>
        <div class="body">
          <div class="title">
            <span class="name">${rule.name}</span>
            ${rule.webhook ? html`<ha-icon class="hook" icon="mdi:webhook" title=${rule.webhook_ha ? "Pushes to Home Assistant" : "Pushes to another webhook"}></ha-icon>` : nothing}
          </div>
          <div class="muted small">
            ${rule.disabled ? "disabled · " : nothing}${rule.categories.join(", ") || "uncategorised"} ·
            ${rule.labels.join(", ") || "all"}
          </div>
        </div>
        <div class="nums">
          <div class=${on ? "hot" : ""}>${rule.devices_on}/${rule.devices}</div>
          <div class="muted small" title="Times fired">${rule.fired}×</div>
        </div>
        ${rule.entity_id
          ? html`<span class="info" role="button" title="Entity details"
              @click=${(e: Event) => { e.stopPropagation(); moreInfo(this, rule.entity_id); }}>
              <ha-icon icon="mdi:information-outline"></ha-icon></span>`
          : nothing}
      </button>
      ${open
        ? renderRuleDevices(this, entry, rule, on ? this._ruleDevices.get(this.hass, entry.entry_id, rule.id) : [], this._config.views)
        : nothing}
    `;
  }

  static styles = [
    baseStyles,
    ruleDevicesStyles,
    css`
      .filters { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 10px; }
      .rule .info { color: var(--cmr-muted); --mdc-icon-size: 18px; line-height: 0; padding: 2px; border-radius: 50%; }
      .rule .info:hover { color: var(--primary-color); background: var(--cmr-surface); }
      .rule.open { background: var(--cmr-surface-2); border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
      .rule.open.on { background: color-mix(in srgb, var(--sev) 14%, transparent); }
      .pill.hot:not(.on) { border-color: color-mix(in srgb, var(--cmr-alert) 55%, transparent); color: var(--cmr-alert); }
      .pill.hot.on { background: var(--cmr-alert); border-color: var(--cmr-alert); }
      .last {
        all: unset; cursor: pointer; box-sizing: border-box; display: flex; gap: 10px; align-items: center;
        margin: 0 12px 8px; padding: 8px 12px; border-radius: 12px; width: calc(100% - 24px);
        background: color-mix(in srgb, var(--sev) 12%, transparent); --mdc-icon-size: 20px;
      }
      .last ha-icon { color: var(--sev); }
      .sev-critical { --sev: var(--cmr-alert); }
      .sev-high { --sev: var(--cmr-pending); }
      .sev-medium { --sev: var(--cmr-update); }
      .sev-low { --sev: var(--cmr-muted); }
      .rules { padding: 0 8px 8px; display: flex; flex-direction: column; gap: 2px; }
      .rule {
        all: unset; cursor: pointer; box-sizing: border-box; display: flex; align-items: center; gap: 10px;
        padding: 7px 10px 7px 6px; border-radius: 10px; position: relative;
      }
      .rule:hover { background: var(--cmr-surface-2); }
      .rule .stripe { width: 3px; align-self: stretch; border-radius: 2px; background: var(--sev); opacity: 0.35; }
      .rule.on .stripe { opacity: 1; }
      .rule.on { background: color-mix(in srgb, var(--sev) 10%, transparent); }
      .rule .sev { color: var(--sev); --mdc-icon-size: 18px; opacity: 0.8; }
      .rule.disabled { opacity: 0.45; }
      .body { flex: 1; min-width: 0; }
      .title { display: flex; align-items: center; gap: 6px; }
      .name { font-weight: 500; font-size: 13.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .hook { --mdc-icon-size: 14px; color: var(--cmr-muted); }
      .nums { text-align: right; font-variant-numeric: tabular-nums; font-size: 13px; }
      .hot { color: var(--cmr-alert); font-weight: 700; }
      .footer { border-top: 1px solid var(--cmr-line); padding: 8px 12px 12px; }
      .footer .link {
        all: unset; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 13px;
        color: var(--primary-color); --mdc-icon-size: 18px;
      }
      .setup { margin-top: 8px; display: flex; flex-direction: column; gap: 8px; }
      .push { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; --mdc-icon-size: 18px; }
      .push ha-icon { color: var(--cmr-muted); }
      .push .copy { align-self: center; }
      .push .copy[disabled] { opacity: 0.6; cursor: default; }
      .push > .muted { flex-basis: 100%; }
      pre {
        margin: 0; padding: 10px; border-radius: 8px; background: var(--cmr-surface-2);
        font: 11px/1.45 var(--cmr-mono); white-space: pre-wrap; word-break: break-all; max-height: 180px; overflow: auto;
      }
      code { font-family: var(--cmr-mono); }
      .copy {
        all: unset; cursor: pointer; align-self: flex-start; display: inline-flex; gap: 6px; align-items: center;
        padding: 6px 12px; border-radius: 8px; background: var(--primary-color); color: var(--text-primary-color, #fff);
        font-size: 13px; --mdc-icon-size: 16px;
      }
    `,
  ];
}
