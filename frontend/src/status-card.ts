import { css, html, nothing, type TemplateResult } from "lit";
import { CmrEntryCard, ENTRY_FIELD, baseStyles, modelName, moreInfo, relativeTime } from "./shared";

interface StatusConfig {
  type: string;
  entry_id?: string;
}

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
  private _ticker?: number;

  static getConfigForm() {
    return { schema: [ENTRY_FIELD], computeLabel: () => "Controller" };
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
  }

  protected render(): TemplateResult {
    const entry = this._entry;
    if (!entry) return this.renderWaiting();

    const devices = entry.devices;
    const controller = devices.find((d) => d.controller);
    const online = devices.filter((d) => d.connected).length;
    const updates = devices.filter((d) => d.update_available).length;
    const pending = devices.filter((d) => d.pending).length;
    const firing = entry.alerts.filter((a) => a.devices_on > 0).length;
    const issuesState = entry.fleet_entities.network_issues
      ? this.hass.states[entry.fleet_entities.network_issues]?.state
      : undefined;
    const issues = Number(issuesState) || 0;
    const share = devices.length ? online / devices.length : 0;

    const versions = new Map<string, number>();
    devices.forEach((d) => versions.set(d.version ?? "unknown", (versions.get(d.version ?? "unknown") ?? 0) + 1));
    const versionList = [...versions.entries()].sort((a, b) => b[1] - a[1]);

    const fe = entry.fleet_entities;
    const R = 26;
    const C = 2 * Math.PI * R;

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
                ${controller?.prerelease ? html`<span class="chip">pre-release</span>` : nothing}
              </div>
            </div>
            <a class="open" href=${entry.controller_url} target="_blank" rel="noreferrer" title="Open the router's web interface">
              <ha-icon icon="mdi:open-in-new"></ha-icon>
            </a>
          </div>

          <div class="stats">
            <button class="stat ring" @click=${() => moreInfo(this, fe.devices_online)}>
              <svg viewBox="0 0 64 64" class=${online === devices.length ? "status-ok" : "status-offline"}>
                <circle cx="32" cy="32" r=${R} class="track"></circle>
                <circle cx="32" cy="32" r=${R} class="value"
                  stroke-dasharray=${`${C * share} ${C}`} transform="rotate(-90 32 32)"></circle>
              </svg>
              <div class="ring-text"><b>${online}</b><span>/${devices.length}</span></div>
              <div class="label">online</div>
            </button>
            ${this._stat("mdi:update", updates, "updates", fe.updates_available, updates ? "update" : "ok")}
            ${this._stat("mdi:bell-alert-outline", firing, "alerts firing", fe.alerts_firing, firing ? "alert" : "ok")}
            ${this._stat("mdi:stethoscope", issues, issues === 1 ? "issue" : "issues", fe.network_issues, issues ? "pending" : "ok")}
            ${this._stat("mdi:link-variant-plus", pending, "to pair", fe.devices_online, pending ? "pending" : "ok")}
          </div>
        </div>
        ${this.renderStale(entry)}

        <div class="bars">
          <div class="bar-title">
            <span>Versions</span>
            <span class="muted">updated ${relativeTime(entry.last_update)}</span>
          </div>
          <div class="bar">
            ${versionList.map(
              ([version, count], i) => html`<div class="seg" title="${version}: ${count}"
                style="flex:${count};background:${VERSION_COLORS[i % VERSION_COLORS.length]}"></div>`,
            )}
          </div>
          <div class="keys">
            ${versionList.map(
              ([version, count], i) => html`<span><i style="background:${VERSION_COLORS[i % VERSION_COLORS.length]}"></i>
                <span class="mono">${version}</span> <span class="muted">×${count}</span></span>`,
            )}
          </div>
        </div>
      </ha-card>
    `;
  }

  private _stat(icon: string, value: number, label: string, entityId: string | null | undefined, status: string) {
    return html`
      <button class="stat status-${status}" @click=${() => moreInfo(this, entityId)}>
        <ha-icon icon=${icon}></ha-icon>
        <b>${value}</b>
        <div class="label">${label}</div>
      </button>
    `;
  }

  static styles = [
    baseStyles,
    css`
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
      }
      .stat:hover { outline: 1px solid var(--cmr-line); }
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

      .bars { padding: 0 16px 14px; margin-top: auto; }
      .bar-title { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; }
      .bar { display: flex; gap: 3px; height: 8px; border-radius: 4px; overflow: hidden; }
      .seg { min-width: 6px; }
      .keys { display: flex; flex-wrap: wrap; gap: 4px 14px; margin-top: 8px; font-size: 12px; align-items: center; }
      .keys i { display: inline-block; width: 8px; height: 8px; border-radius: 2px; margin-right: 4px; }
      @container (max-width: 520px) {
        .stats { justify-content: stretch; }
        .stat { max-width: none; }
      }
    `,
  ];
}
