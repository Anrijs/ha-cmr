import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { cmrStore, pickEntry } from "./data";
import { baseStyles, copyText, moreInfo } from "./shared";
import type { CmrAlertRule, CmrEntry, HassLike } from "./types";

interface AlertsConfig {
  type: string;
  entry_id?: string;
  title?: string;
  hide_disabled?: boolean;
}

const SEVERITY_ORDER = ["critical", "high", "medium", "low"] as const;
const SEVERITY_ICON: Record<string, string> = {
  critical: "mdi:alert-octagon",
  high: "mdi:alert",
  medium: "mdi:alert-circle-outline",
  low: "mdi:information-outline",
};

function ago(iso: string | undefined): string {
  if (!iso) return "";
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return `${Math.round(s / 86400)} d ago`;
}

export class CmrAlertsCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _entry: { state: true },
    _setup: { state: true },
    _copied: { state: true },
  };

  declare hass: HassLike;
  declare _config: AlertsConfig;
  declare _entry?: CmrEntry;
  declare _setup?: { url: string; script: string } | null;
  declare _copied: boolean;
  private _unsubscribe?: () => void;

  setConfig(config: AlertsConfig): void {
    this._config = config;
  }

  static getStubConfig(): Partial<AlertsConfig> {
    return {};
  }

  static getConfigForm() {
    return {
      schema: [
        { name: "entry_id", selector: { config_entry: { integration: "cmr" } } },
        { name: "title", selector: { text: {} } },
        { name: "hide_disabled", selector: { boolean: {} } },
      ],
      computeLabel: (s: { name: string }) =>
        ({ entry_id: "Controller", title: "Title", hide_disabled: "Hide disabled rules" })[s.name],
    };
  }

  getGridOptions() {
    return { columns: "full", rows: "auto", min_columns: 4 };
  }

  getCardSize(): number {
    return 2 + (this._entry?.alerts.length ?? 4);
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
    this._unsubscribe = cmrStore.subscribe(this.hass, (entries) => {
      this._entry = pickEntry(entries, this._config?.entry_id);
    });
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
    if (!entry) return html`<ha-card><div class="empty">Waiting for the CMR controller…</div></ha-card>`;

    const rules = entry.alerts
      .filter((r) => !(this._config.hide_disabled && r.disabled))
      .sort(
        (a, b) =>
          Number(b.devices_on > 0) - Number(a.devices_on > 0) ||
          Number(a.disabled) - Number(b.disabled) ||
          SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity) ||
          a.name.localeCompare(b.name),
      );
    const firing = rules.filter((r) => r.devices_on > 0).length;
    const hooked = entry.alerts.filter((r) => r.webhook).length;
    const lastId = entry.fleet_entities.fleet_alert;
    const last = lastId ? this.hass.states[lastId] : undefined;
    const lastAttrs = (last?.attributes ?? {}) as Record<string, string>;

    return html`
      <ha-card>
        <div class="card-header">
          <ha-icon icon=${firing ? "mdi:bell-alert" : "mdi:bell-check-outline"}></ha-icon>
          <span>${this._config.title ?? "Alerts"}</span>
          ${firing ? html`<span class="chip firing">${firing} firing</span>` : html`<span class="chip">all quiet</span>`}
          <div class="spacer"></div>
        </div>

        ${last && last.state !== "unknown" && last.state !== "unavailable"
          ? html`<button class="last sev-${lastAttrs.event_type}" @click=${() => moreInfo(this, lastId)}>
              <ha-icon icon=${SEVERITY_ICON[lastAttrs.event_type] ?? "mdi:bell"}></ha-icon>
              <div>
                <div><b>${lastAttrs.alert}</b>${lastAttrs.device ? html` · ${lastAttrs.device}` : nothing}</div>
                <div class="muted small">Last pushed alert · ${ago(last.state)}</div>
              </div>
            </button>`
          : nothing}

        <div class="rules">
          ${rules.map((rule) => this._rule(rule))}
          ${rules.length ? nothing : html`<div class="empty">No alert rules on the controller.</div>`}
        </div>

        ${this.hass.user?.is_admin
          ? html`<div class="footer">
              <button class="link" @click=${this._toggleSetup}>
                <ha-icon icon="mdi:webhook"></ha-icon>
                ${hooked
                  ? `${hooked} of ${entry.alerts.length} rules push to Home Assistant`
                  : "Push alerts to Home Assistant instantly"}
                <ha-icon icon=${this._setup !== undefined ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
              </button>
              ${this._setup === null ? html`<div class="muted small">Loading…</div>` : nothing}
              ${this._setup
                ? html`<div class="setup">
                    <div class="small">Paste into the controller's terminal. Each alert rule gets an HTTP action that calls Home Assistant; edit <code>find</code> to choose rules.</div>
                    <pre>${this._setup.script}</pre>
                    <button class="copy" @click=${this._copy}>
                      <ha-icon icon=${this._copied ? "mdi:check" : "mdi:content-copy"}></ha-icon>${this._copied ? "Copied" : "Copy script"}
                    </button>
                  </div>`
                : nothing}
            </div>`
          : nothing}
      </ha-card>
    `;
  }

  private _rule(rule: CmrAlertRule): TemplateResult {
    const on = rule.devices_on > 0;
    return html`
      <button class="rule sev-${rule.severity} ${on ? "on" : ""} ${rule.disabled ? "disabled" : ""}"
              @click=${() => moreInfo(this, rule.entity_id)}>
        <span class="stripe"></span>
        <ha-icon class="sev" icon=${SEVERITY_ICON[rule.severity]}></ha-icon>
        <div class="body">
          <div class="title">
            <span class="name">${rule.name}</span>
            ${rule.webhook ? html`<ha-icon class="hook" icon="mdi:webhook" title="Pushes to a webhook"></ha-icon>` : nothing}
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
      </button>
    `;
  }

  static styles = [
    baseStyles,
    css`
      .chip.firing { background: var(--cmr-alert); color: #fff; }
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
      .small { font-size: 11.5px; }
      .nums { text-align: right; font-variant-numeric: tabular-nums; font-size: 13px; }
      .hot { color: var(--cmr-alert); font-weight: 700; }
      .footer { border-top: 1px solid var(--cmr-line); padding: 8px 12px 12px; }
      .footer .link {
        all: unset; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 13px;
        color: var(--primary-color); --mdc-icon-size: 18px;
      }
      .setup { margin-top: 8px; display: flex; flex-direction: column; gap: 8px; }
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
