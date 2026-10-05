import { css, html, nothing, type PropertyDeclarations, type PropertyValues, type TemplateResult } from "lit";
import { RuleDevices, cmrEvents, dismissIssue, type CmrIssue } from "./data";
import {
  CmrEntryCard,
  ENTRY_FIELD,
  approvePairing,
  baseStyles,
  compareDevices,
  deviceVisual,
  labelsFrom,
  modelName,
  moreInfo,
  navigate,
  pairingHint,
  relativeTime,
  renderRuleDevices,
  ruleDevicesStyles,
  viewPath,
} from "./shared";
import type { CmrAlertRule, CmrDevice, CmrEntry } from "./types";

interface StatusConfig {
  type: string;
  entry_id?: string;
  /** Views of the dashboard this card is on, for "Open in …" links (the generated dashboard sets them). */
  views?: { devices?: string; events?: string; topology?: string };
}

type Panel = "online" | "updates" | "alerts" | "issues" | "pending" | "version";

// Distinct but calm segment colours for the version bar, theme-aware where possible.
const VERSION_COLORS = [
  "var(--primary-color)",
  "var(--cmr-update)",
  "var(--cmr-pending)",
  "var(--accent-color, #7e57c2)",
  "var(--cmr-ok)",
  "var(--cmr-muted)",
];

export class CmrStatusCard extends CmrEntryCard<StatusConfig> {
  static properties: PropertyDeclarations = {
    _panel: { state: true },
    _version: { state: true },
    _issues: { state: true },
    _pairing: { state: true },
    _openRule: { state: true },
  };

  declare _panel?: Panel;
  declare _version?: string;
  declare _issues: CmrIssue[];
  declare _pairing: Map<string, string>;
  /** Rule opened in the alerts panel to show the devices it fires on. */
  declare _openRule: string;
  private _ticker?: number;
  private _unsubscribeEvents?: () => void;
  private _ruleDevices = new RuleDevices(() => this.requestUpdate());

  constructor() {
    super();
    this._issues = [];
    this._pairing = new Map();
    this._openRule = "";
  }

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (changed.has("_entry")) this._ruleDevices.invalidate();
  }

  static getConfigForm() {
    return { schema: [ENTRY_FIELD], computeLabel: labelsFrom({ entry_id: "Controller" }) };
  }

  getGridOptions() {
    return { columns: "full", rows: "auto", min_columns: 6 };
  }

  getCardSize(): number {
    return 4;
  }

  connectedCallback(): void {
    super.connectedCallback();
    // Keep "updated x s ago" fresh between polls.
    this._ticker = window.setInterval(() => this.requestUpdate(), 15000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearInterval(this._ticker);
    this._unsubscribeEvents?.();
    this._unsubscribeEvents = undefined;
  }

  // ------------------------------------------------------------ panels

  private _toggle(panel: Panel, version?: string): void {
    const same = this._panel === panel && (panel !== "version" || this._version === version);
    this._panel = same ? undefined : panel;
    this._version = same ? undefined : version;
    // Issues live in the events feed; only listen while the panel is open.
    if (this._panel === "issues" && !this._unsubscribeEvents) {
      this._unsubscribeEvents = cmrEvents.subscribe(this.hass, this._config?.entry_id, (_events, issues) => {
        this._issues = issues;
      });
    } else if (this._panel !== "issues" && this._unsubscribeEvents) {
      this._unsubscribeEvents();
      this._unsubscribeEvents = undefined;
    }
  }

  private async _approve(d: CmrDevice): Promise<void> {
    this._pairing = new Map(this._pairing).set(d.key, "busy");
    try {
      await approvePairing(this.hass, this._entry!.entry_id, d.key);
      const next = new Map(this._pairing);
      next.delete(d.key);
      this._pairing = next;
    } catch (err) {
      this._pairing = new Map(this._pairing).set(d.key, (err as { message?: string })?.message ?? String(err));
    }
  }

  // ------------------------------------------------------------ render

  protected render(): TemplateResult {
    const entry = this._entry;
    if (!entry) return this.renderWaiting();

    const devices = entry.devices;
    const controller = devices.find((d) => d.controller);
    const online = devices.filter((d) => d.connected).length;
    const updates = devices.filter((d) => d.update_available).length;
    const pending = devices.filter((d) => d.pending || d.remote_pending).length;
    const firing = entry.alerts.filter((a) => a.devices_on > 0).length;
    const issuesState = entry.fleet_entities.network_issues
      ? this.hass.states[entry.fleet_entities.network_issues]?.state
      : undefined;
    const issues = Number(issuesState) || 0;
    const share = devices.length ? online / devices.length : 0;

    const versions = new Map<string, number>();
    devices.forEach((d) => versions.set(d.version ?? "unknown", (versions.get(d.version ?? "unknown") ?? 0) + 1));
    const versionList = [...versions.entries()].sort((a, b) => b[1] - a[1]);

    const R = 26;
    const C = 2 * Math.PI * R;
    const on = (panel: Panel) => (this._panel === panel ? "on" : "");

    return html`
      <ha-card>
        <div class="hero">
          <div class="identity">
            ${controller?.product?.image
              ? html`<div class="logo photo"><img src=${controller.product.image} alt=${controller.product.name} referrerpolicy="no-referrer" /></div>`
              : html`<div class="logo"><ha-icon icon="mdi:router-network"></ha-icon></div>`}
            <div class="who">
              <div class="eyebrow">CMR controller</div>
              <div class="name">${controller?.identity ?? entry.title}</div>
              <div class="meta">
                ${controller ? modelName(controller) : ""} ·
                <span class="mono">${controller?.version ?? "?"}</span>
              </div>
            </div>
            <a class="open" href=${entry.controller_url} target="_blank" rel="noreferrer" title="Open the router's web interface (WebFig)">
              <ha-icon icon="mdi:open-in-new"></ha-icon>
            </a>
          </div>

          <div class="stats">
            <button class="stat ring ${on("online")}" aria-pressed=${this._panel === "online"} @click=${() => this._toggle("online")}>
              <svg viewBox="0 0 64 64" class=${online === devices.length ? "status-ok" : "status-offline"}>
                <circle cx="32" cy="32" r=${R} class="track"></circle>
                <circle cx="32" cy="32" r=${R} class="value"
                  stroke-dasharray=${`${C * share} ${C}`} transform="rotate(-90 32 32)"></circle>
              </svg>
              ${devices.length < 100
                ? html`<div class="ring-text"><b>${online}</b><span>/${devices.length}</span></div>
                    <div class="label">online</div>`
                : html`<div class="ring-text"><b>${online}</b></div>
                    <div class="label">of ${devices.length} online</div>`}
            </button>
            ${this._stat("updates", "mdi:update", updates, "updates", updates ? "update" : "ok")}
            ${this._stat("alerts", "mdi:bell-alert-outline", firing, "alerts firing", firing ? "alert" : "ok")}
            ${this._stat("issues", "mdi:stethoscope", issues, issues === 1 ? "issue" : "issues", issues ? "pending" : "ok")}
            ${this._stat("pending", "mdi:link-variant-plus", pending, "to pair", pending ? "pending" : "ok")}
          </div>
        </div>
        ${this.renderStale(entry)}
        ${this._panel ? this._renderPanel(entry) : nothing}

        <div class="bars">
          <div class="bar-title">
            <span>Versions</span>
            <span class="muted">updated ${relativeTime(entry.last_update)}</span>
          </div>
          <div class="bar">
            ${versionList.map(
              ([version, count], i) => html`<button class="seg ${this._panel === "version" && this._version === version ? "on" : ""}"
                title="${version}: ${count} — click to list them"
                style="flex:${count};background:${VERSION_COLORS[i % VERSION_COLORS.length]}"
                @click=${() => this._toggle("version", version)}></button>`,
            )}
          </div>
          <div class="keys">
            ${versionList.map(
              ([version, count], i) => html`<button class="key ${this._panel === "version" && this._version === version ? "on" : ""}"
                @click=${() => this._toggle("version", version)}>
                <i style="background:${VERSION_COLORS[i % VERSION_COLORS.length]}"></i>
                <span class="mono">${version}</span> <span class="muted">×${count}</span></button>`,
            )}
          </div>
        </div>
      </ha-card>
    `;
  }

  private _stat(panel: Panel, icon: string, value: number, label: string, status: string) {
    return html`
      <button class="stat status-${status} ${this._panel === panel ? "on" : ""}" aria-pressed=${this._panel === panel}
        @click=${() => this._toggle(panel)}>
        <ha-icon icon=${icon}></ha-icon>
        <b>${value}</b>
        <div class="label">${label}</div>
      </button>
    `;
  }

  /** The drill-down under the tiles: the items behind the number. */
  private _renderPanel(entry: CmrEntry): TemplateResult {
    const panel = this._panel!;
    const sorted = (list: CmrDevice[]) => [...list].sort(compareDevices);
    let title = "";
    let items: TemplateResult[] = [];
    let empty = "";
    let link: { view?: string; params: Record<string, string | undefined> } | undefined;

    if (panel === "online") {
      const offline = sorted(entry.devices.filter((d) => !d.connected));
      title = offline.length ? `${offline.length} offline` : "All devices online";
      empty = "Every managed device is connected to the controller.";
      items = offline.map((d) => this._deviceRow(d, d.disconnected_since ? `since ${d.disconnected_since}` : "disconnected"));
      link = { view: this._config.views?.devices, params: { cmr_status: "offline" } };
    } else if (panel === "updates") {
      const list = sorted(entry.devices.filter((d) => d.update_available));
      title = list.length ? `${list.length} with an update` : "Everything is up to date";
      empty = "No device's channel offers a newer version.";
      items = list.map((d) =>
        this._deviceRow(d, html`<span class="mono">${d.version}</span> → <span class="mono up">${d.available_version}</span>`, d.entities.update),
      );
      link = { view: this._config.views?.devices, params: { cmr_status: "update" } };
    } else if (panel === "alerts") {
      const rules = entry.alerts.filter((r) => r.devices_on > 0).sort((a, b) => b.devices_on - a.devices_on);
      title = rules.length ? `${rules.length} alert rule${rules.length > 1 ? "s" : ""} firing` : "No alert rule is firing";
      empty = "All alert rules are quiet.";
      items = rules.map((r) => this._ruleRow(r, entry));
    } else if (panel === "issues") {
      title = this._issues.length ? `${this._issues.length} detected issue${this._issues.length > 1 ? "s" : ""}` : "No issues detected";
      empty = this._unsubscribeEvents ? "Nothing unusual in the events." : "Loading…";
      items = this._issues.map(
        (issue) => html`<div class="item sev-${issue.severity}">
          <ha-icon icon=${issue.severity === "error" ? "mdi:alert-octagon-outline" : "mdi:alert-outline"}></ha-icon>
          <div class="text">
            <div class="t">${issue.title}</div>
            <div class="muted small">${issue.detail}</div>
          </div>
          ${issue.device_name ? html`<span class="chip">${issue.device_name}</span>` : nothing}
          ${this.hass.user?.is_admin
            ? html`<button class="dismiss" title="Dismiss (comes back only on new occurrences)"
                @click=${() => dismissIssue(this.hass, issue.entry_id, issue.key).catch((err) => console.error("cmr: dismiss", err))}>
                <ha-icon icon="mdi:close"></ha-icon></button>`
            : nothing}
        </div>`,
      );
      link = { view: this._config.views?.events, params: {} };
    } else if (panel === "pending") {
      const list = sorted(entry.devices.filter((d) => d.pending || d.remote_pending));
      title = list.length ? `${list.length} waiting to pair` : "No device is waiting to pair";
      empty = "New devices appear here until their pairing is approved.";
      items = list.map((d) => this._pendingRow(d, entry));
      link = { view: this._config.views?.devices, params: { cmr_status: "pending" } };
    } else {
      const list = sorted(entry.devices.filter((d) => (d.version ?? "unknown") === this._version));
      title = `${list.length} on ${this._version}`;
      items = list.map((d) => this._deviceRow(d, d.update_available ? html`update: <span class="mono up">${d.available_version}</span>` : modelName(d)));
      link = { view: this._config.views?.devices, params: { cmr_version: this._version } };
    }

    return html`<div class="panel">
      <div class="panel-head">
        <span class="section-label">${title}</span>
        <span class="spacer"></span>
        ${link?.view
          ? html`<button class="link" @click=${() => navigate(viewPath(link!.view!, link!.params))}>
              Open in ${panel === "issues" ? "Events" : "Devices"} <ha-icon icon="mdi:arrow-right"></ha-icon></button>`
          : nothing}
        <button class="close" title="Close" @click=${() => this._toggle(panel, this._version)}><ha-icon icon="mdi:close"></ha-icon></button>
      </div>
      ${items.length ? items : html`<div class="muted small">${empty}</div>`}
    </div>`;
  }

  private _deviceRow(d: CmrDevice, detail: unknown, entityId?: string | null): TemplateResult {
    return html`<button class="item status-${d.connected ? (d.update_available ? "update" : "ok") : "offline"}"
      @click=${() => moreInfo(this, entityId ?? d.entities.connected)}>
      ${deviceVisual(d, "thumb")}
      <div class="text">
        <div class="t">${d.identity}</div>
        <div class="muted small">${detail}</div>
      </div>
    </button>`;
  }

  private _ruleRow(rule: CmrAlertRule, entry: CmrEntry): TemplateResult {
    const open = this._openRule === rule.id;
    return html`<button class="item sev-${rule.severity} ${open ? "open" : ""}" aria-expanded=${open}
        @click=${() => (this._openRule = open ? "" : rule.id)}>
        <ha-icon icon="mdi:bell-alert"></ha-icon>
        <div class="text">
          <div class="t">${rule.name}</div>
          <div class="muted small">${rule.severity} · ${rule.categories.join(", ") || "uncategorised"} · fired ${rule.fired}×</div>
        </div>
        <span class="chip alert">${rule.devices_on}/${rule.devices}</span>
        <ha-icon class="chev" icon=${open ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
      </button>
      ${open
        ? renderRuleDevices(this, entry, rule, this._ruleDevices.get(this.hass, entry.entry_id, rule.id), this._config.views)
        : nothing}`;
  }

  private _pendingRow(d: CmrDevice, entry: CmrEntry): TemplateResult {
    const state = this._pairing.get(d.key);
    const canApprove = d.pending && entry.actions && !!this.hass.user?.is_admin;
    return html`<div class="item status-pending">
      ${deviceVisual(d, "thumb")}
      <div class="text">
        <div class="t">${d.identity}</div>
        <div class="muted small">${modelName(d)} · ${pairingHint(d)}${state && state !== "busy" ? ` · ${state}` : ""}</div>
      </div>
      ${canApprove
        ? html`<button class="approve" ?disabled=${state === "busy"} @click=${() => this._approve(d)}>
            ${state === "busy" ? "Approving…" : "Approve"}</button>`
        : nothing}
    </div>`;
  }

  static styles = [
    baseStyles,
    ruleDevicesStyles,
    css`
      .item .chev { color: var(--cmr-muted); --mdc-icon-size: 18px; }
      .item.open { border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
      .rd { margin-left: 0; }
      .item .dismiss { all: unset; cursor: pointer; line-height: 0; padding: 4px; border-radius: 50%; color: var(--cmr-muted); --mdc-icon-size: 18px; }
      .item .dismiss:hover { color: var(--primary-text-color); background: var(--cmr-surface); }
      ha-card { display: flex; flex-direction: column; container-type: inline-size; }
      .hero { display: flex; gap: 16px; padding: 16px; align-items: center; flex-wrap: wrap; }
      .identity { display: flex; gap: 12px; align-items: center; flex: 1 1 260px; min-width: 0; }
      .logo {
        width: 52px; height: 52px; border-radius: 16px; flex: none; display: grid; place-items: center;
        background: linear-gradient(135deg, var(--primary-color), color-mix(in srgb, var(--primary-color) 55%, #000));
        color: var(--text-primary-color, #fff); --mdc-icon-size: 28px;
        box-shadow: 0 6px 18px color-mix(in srgb, var(--primary-color) 35%, transparent);
      }
      .logo.photo {
        width: 64px; height: 64px; background: var(--cmr-pedestal);
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
      }
      .logo.photo img { width: 100%; height: 100%; object-fit: contain; padding: 8%; box-sizing: border-box; mix-blend-mode: multiply; }
      .who { min-width: 0; }
      .eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--cmr-muted); }
      .name { font-size: 22px; font-weight: 600; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .meta { font-size: 13px; color: var(--cmr-muted); display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
      .open { color: var(--cmr-muted); align-self: flex-start; --mdc-icon-size: 18px; }
      .open:hover { color: var(--primary-color); }

      .stats { display: flex; gap: 8px; flex: 1 1 300px; justify-content: flex-end; flex-wrap: wrap; }
      .stat {
        all: unset; cursor: pointer; box-sizing: border-box; flex: 1; min-width: 72px; max-width: 120px;
        padding: 10px 6px; border-radius: 14px; text-align: center; background: var(--cmr-surface-2);
        display: flex; flex-direction: column; align-items: center; gap: 2px; position: relative;
        border: 1px solid transparent;
      }
      .stat:hover { border-color: var(--cmr-line); }
      .stat.on { border-color: var(--status, var(--primary-color)); background: color-mix(in srgb, var(--status, var(--primary-color)) 10%, var(--cmr-surface-2)); }
      .stat:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
      .stat ha-icon { color: var(--status); --mdc-icon-size: 20px; }
      .stat b { font-size: 22px; line-height: 1.1; }
      .stat .label { font-size: 11px; color: var(--cmr-muted); }
      .stat.ring svg { width: 46px; height: 46px; }
      .ring .track { fill: none; stroke: var(--cmr-line); stroke-width: 6; }
      .ring .value { fill: none; stroke: var(--status); stroke-width: 6; stroke-linecap: round; transition: stroke-dasharray 0.6s ease; }
      .ring-text { position: absolute; top: 22px; left: 0; right: 0; text-align: center; font-size: 13px; }
      .ring-text b { font-size: 15px; }
      .ring-text span { color: var(--cmr-muted); }
      .stat.ring .label { margin-top: 2px; }

      .panel { margin: 0 16px 12px; padding: 10px 12px; border-radius: 12px; background: var(--cmr-surface-2); display: flex; flex-direction: column; gap: 4px; }
      .panel-head { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
      .panel-head .spacer { flex: 1; }
      .panel-head .link { all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 2px; font-size: 12px; color: var(--primary-color); --mdc-icon-size: 16px; }
      .panel-head .close { all: unset; cursor: pointer; color: var(--cmr-muted); --mdc-icon-size: 18px; line-height: 0; }
      .item {
        all: unset; cursor: pointer; box-sizing: border-box; display: flex; align-items: center; gap: 10px;
        padding: 6px 8px; border-radius: 10px; width: 100%; --mdc-icon-size: 20px;
      }
      div.item { cursor: default; }
      button.item:hover { background: var(--cmr-surface); }
      .item .badge { width: 34px; height: 34px; border-radius: 9px; flex: none; display: grid; place-items: center;
        background: color-mix(in srgb, var(--status, var(--cmr-muted)) 14%, var(--cmr-surface)); color: var(--status, var(--cmr-muted)); --mdc-icon-size: 18px; }
      .item > ha-icon { color: var(--sev, var(--status, var(--cmr-muted))); flex: none; }
      .item .text { flex: 1; min-width: 0; }
      .item .t { font-size: 13.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .item .small { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .item .up { color: var(--cmr-update); font-weight: 600; }
      .sev-critical, .sev-error { --sev: var(--cmr-alert); }
      .sev-high, .sev-warning { --sev: var(--cmr-pending); }
      .sev-medium, .sev-notice { --sev: var(--cmr-update); }
      .sev-low, .sev-info { --sev: var(--cmr-muted); }
      .approve {
        all: unset; cursor: pointer; font-size: 12px; padding: 4px 12px; border-radius: 999px; flex: none;
        background: var(--primary-color); color: var(--text-primary-color, #fff);
      }
      .approve[disabled] { opacity: 0.6; cursor: default; }

      .bars { padding: 0 16px 14px; margin-top: auto; }
      .bar-title { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; }
      .bar { display: flex; gap: 3px; height: 8px; border-radius: 4px; overflow: hidden; }
      .seg { all: unset; cursor: pointer; min-width: 6px; height: 8px; display: block; }
      .seg.on { outline: 2px solid var(--primary-text-color); outline-offset: -1px; }
      .keys { display: flex; flex-wrap: wrap; gap: 4px 14px; margin-top: 8px; font-size: 12px; align-items: center; }
      .key { all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 2px; padding: 1px 6px; margin: -1px -6px; border-radius: 6px; }
      .key:hover, .key.on { background: var(--cmr-surface-2); }
      .key i { display: inline-block; width: 8px; height: 8px; border-radius: 2px; margin-right: 4px; }
      @container (max-width: 520px) {
        .stats { justify-content: stretch; }
        .stat { max-width: none; }
      }
    `,
  ];
}
