import { css, html, nothing, type TemplateResult } from "lit";
import {
  CmrEntryCard,
  ENTRY_FIELD,
  STATUS_LABEL,
  baseStyles,
  compareDevices,
  deviceStatus,
  labelsFrom,
  moreInfo,
} from "./shared";
import type { CmrDevice, CmrWifiNetwork, CmrWifiRadio } from "./types";

interface WifiConfig {
  type: string;
  entry_id?: string;
  title?: string;
}

// The Wi-Fi generation each RouterOS band suffix stands for.
const STANDARD: Record<string, string> = { be: "Wi-Fi 7", ax: "Wi-Fi 6", ac: "Wi-Fi 5", n: "Wi-Fi 4", g: "802.11g", a: "802.11a" };

/** "5ghz-ax" → ["5 GHz", "Wi-Fi 6"]; 6 GHz Wi-Fi 6 is Wi-Fi 6E. */
function bandText(band: string | null): string[] {
  const match = /^(\d+)ghz-([a-z]+)$/.exec(band ?? "");
  if (!match) return band ? [band] : [];
  const ghz = match[1] === "2" ? "2.4" : match[1];
  const standard = match[1] === "6" && match[2] === "ax" ? "Wi-Fi 6E" : STANDARD[match[2]] ?? match[2];
  return [`${ghz} GHz`, standard];
}

/** A single frequency as its channel number; lists and ranges stay in MHz. */
function channelText(frequency: string | null): string | null {
  if (!frequency) return null;
  if (!/^\d+$/.test(frequency)) return `${frequency.replace(/,/g, ", ")} MHz`;
  const f = Number(frequency);
  const channel =
    f === 2484 ? 14 : f >= 2412 && f <= 2472 ? (f - 2407) / 5 : f >= 5000 && f <= 5900 ? (f - 5000) / 5 : f >= 5955 ? (f - 5950) / 5 : null;
  return channel !== null && Number.isInteger(channel) ? `channel ${channel} (${f} MHz)` : `${f} MHz`;
}

/** Authentication types in plain words: "WPA2/WPA3 Personal", "Enhanced Open". */
function securityText(types: string[]): string | null {
  const versions = (kind: string) =>
    [...new Set(types.filter((t) => t.includes(kind)).map((t) => (t.match(/^wpa(\d?)/)?.[1] || "1")))]
      .sort()
      .map((v) => (v === "1" ? "WPA" : `WPA${v}`));
  const parts: string[] = [];
  const personal = versions("-psk");
  const enterprise = versions("-eap");
  if (personal.length) parts.push(`${personal.join("/")} Personal`);
  if (enterprise.length) parts.push(`${enterprise.join("/")} Enterprise`);
  if (types.includes("owe")) parts.push("Enhanced Open");
  return parts.join(" · ") || null;
}

function bandChips(bands: string[]): TemplateResult {
  return bands.length
    ? html`${bands.map((b) => html`<span class="chip band">${b} GHz</span>`)}`
    : html`<span class="chip band">All bands</span>`;
}

function overlaps(a: string[], b: string[]): boolean {
  return !a.length || !b.length || a.some((x) => b.includes(x));
}

export class CmrWifiCard extends CmrEntryCard<WifiConfig> {
  static getConfigForm() {
    return {
      schema: [ENTRY_FIELD, { name: "title", selector: { text: {} } }],
      computeLabel: labelsFrom({ entry_id: "Controller", title: "Title" }),
    };
  }

  getGridOptions() {
    return { columns: "full", rows: "auto", min_columns: 4 };
  }

  getCardSize(): number {
    const wifi = this._entry?.wifi;
    return 2 + 2 * ((wifi?.networks.length ?? 1) + (wifi?.radios.length ?? 0));
  }

  protected render(): TemplateResult {
    const entry = this._entry;
    if (!entry) return this.renderWaiting();
    const wifi = entry.wifi;
    const byKey = new Map(entry.devices.map((d) => [d.key, d]));
    const enabled = wifi?.networks.filter((n) => !n.disabled) ?? [];
    const radios = new Set(enabled.flatMap((n) => n.devices).filter((key) => byKey.get(key)?.wifi));

    let body: TemplateResult;
    if (!wifi) {
      body = html`<div class="empty">This controller's CMR has no WiFi menu.</div>`;
    } else if (!wifi.networks.length && !wifi.radios.length) {
      body = html`<div class="none">
        <ha-icon icon="mdi:wifi-cog"></ha-icon>
        <div>
          <div>CMR doesn't configure any Wi-Fi on this controller.</div>
          <div class="muted small">Networks and radio settings added under CMR › WiFi show up here, with the access points they apply to.</div>
        </div>
      </div>`;
    } else {
      body = html`
        ${wifi.networks.length
          ? html`<div class="section-label">Networks</div>
              <div class="items">${wifi.networks.map((n) => this._network(n, byKey))}</div>`
          : nothing}
        ${wifi.radios.length
          ? html`<div class="section-label">Radio settings</div>
              <div class="items">${wifi.radios.map((r) => this._radio(r, enabled, byKey))}</div>`
          : nothing}`;
    }

    return html`<ha-card>
      <div class="card-header">
        <ha-icon icon="mdi:wifi"></ha-icon>
        <span>${this._config.title ?? "Wi-Fi"}</span>
        ${wifi?.networks.length
          ? html`<span class="chip">${enabled.length} network${enabled.length === 1 ? "" : "s"}</span>
              <span class="chip">${radios.size} access point${radios.size === 1 ? "" : "s"}</span>`
          : nothing}
        <div class="spacer"></div>
      </div>
      ${this.renderStale(entry)}
      ${body}
      ${wifi ? html`<div class="foot muted small">Live access point and client counts aren't available from the controller's API yet.</div>` : nothing}
    </ha-card>`;
  }

  private _network(n: CmrWifiNetwork, byKey: Map<string, CmrDevice>): TemplateResult {
    const security = securityText(n.authentication);
    const details = [
      security,
      n.vlan_id !== null ? `VLAN ${n.vlan_id}` : null,
      n.fast_roaming ? "Fast roaming" : null,
      n.max_clients !== null ? `up to ${n.max_clients} clients` : null,
    ].filter(Boolean);
    const warnings: string[] = [];
    if (!n.disabled && n.vlan_id === null && (n.mode ?? "ap") === "ap") {
      warnings.push(
        "No VLAN: CMR puts this network in no bridge, so its clients get no network access. Set a VLAN and carry it on the access points' uplink.",
      );
    }
    return html`<div class="item ${n.disabled ? "off" : ""}">
      <ha-icon class="kind" icon=${n.disabled ? "mdi:wifi-off" : n.hidden ? "mdi:wifi-lock" : "mdi:wifi"}></ha-icon>
      <div class="main">
        <div class="title">
          <span class="name">${n.ssid ?? "(no SSID)"}</span>
          ${bandChips(n.bands)}
          ${n.hidden ? html`<span class="chip">Hidden</span>` : nothing}
          ${n.mlo ? html`<span class="chip" title="Multi-Link Operation (Wi-Fi 7)">MLO</span>` : nothing}
          ${n.mode && n.mode !== "ap" ? html`<span class="chip">${n.mode}</span>` : nothing}
          ${n.disabled ? html`<span class="chip">Off</span>` : nothing}
        </div>
        ${details.length || n.comment
          ? html`<div class="muted small" title=${[...n.authentication, ...n.encryption].join(", ")}>
              ${details.join(" · ")}${n.comment ? html`${details.length ? " · " : ""}<i>${n.comment}</i>` : nothing}
            </div>`
          : nothing}
        ${this._targets(n.devices, n.selector, byKey, n.disabled)}
        ${n.disabled ? nothing : warnings.map((w) => html`<div class="warn small"><ha-icon icon="mdi:alert-outline"></ha-icon>${w}</div>`)}
      </div>
    </div>`;
  }

  private _radio(r: CmrWifiRadio, networks: CmrWifiNetwork[], byKey: Map<string, CmrDevice>): TemplateResult {
    const [band, standard] = bandText(r.band);
    const chains = r.chains ? r.chains.split(",").filter(Boolean).length : 0;
    const details = [
      channelText(r.frequency),
      r.width ? r.width.replace(/mhz$/i, " MHz") : null,
      r.tx_power !== null ? `${r.tx_power} dBm` : null,
      chains ? `${chains} chain${chains === 1 ? "" : "s"}` : null,
      r.country,
    ].filter(Boolean);
    const warnings: string[] = [];
    if (!r.disabled && r.frequency && !r.bands.length) {
      warnings.push(
        "No band label: the channel goes to every radio, and a radio of another band is left with no available channel. Add +2ghz, +5ghz or +6ghz to its labels.",
      );
    }
    const covered = networks.some(
      (n) => overlaps(n.bands, r.bands) && n.devices.some((key) => r.devices.includes(key)),
    );
    if (!r.disabled && r.devices.length && !covered) {
      warnings.push("No enabled CMR network selects these radios, so these settings aren't applied.");
    }
    const title = band ? `${band}${standard ? ` · ${standard}` : ""}` : r.bands.length ? r.bands.map((b) => `${b} GHz`).join(", ") : "All radios";
    return html`<div class="item ${r.disabled ? "off" : ""}">
      <ha-icon class="kind" icon="mdi:access-point"></ha-icon>
      <div class="main">
        <div class="title">
          <span class="name">${title}</span>
          ${band ? nothing : bandChips(r.bands)}
          ${r.disabled ? html`<span class="chip">Off</span>` : nothing}
        </div>
        ${details.length || r.comment
          ? html`<div class="muted small">
              ${details.join(" · ")}${r.comment ? html`${details.length ? " · " : ""}<i>${r.comment}</i>` : nothing}
            </div>`
          : nothing}
        ${this._targets(r.devices, r.selector, byKey, r.disabled)}
        ${warnings.map((w) => html`<div class="warn small"><ha-icon icon="mdi:alert-outline"></ha-icon>${w}</div>`)}
      </div>
    </div>`;
  }

  /** The access points an item applies to; devices without radios are counted, not listed. */
  private _targets(keys: string[], selector: string[], byKey: Map<string, CmrDevice>, off: boolean): TemplateResult {
    const devices = keys.map((key) => byKey.get(key)).filter((d): d is CmrDevice => !!d);
    const aps = devices.filter((d) => d.wifi).sort(compareDevices);
    const others = devices.length - aps.length;
    const labels = selector.length ? `labels ${selector.join(", ")}` : "all devices";
    if (!devices.length) {
      return off
        ? html`<div class="muted small">${labels} · selects no device</div>`
        : html`<div class="warn small"><ha-icon icon="mdi:alert-outline"></ha-icon>Its ${labels} select no device.</div>`;
    }
    return html`<div class="aps">
      ${aps.map(
        (d) => html`<button class="ap status-${deviceStatus(d)}" title=${STATUS_LABEL[deviceStatus(d)]}
          @click=${() => moreInfo(this, d.entities.connected)}><i class="dot"></i>${d.identity}</button>`,
      )}
      <span class="muted small">${aps.length ? "" : "No access point: "}${labels}${others
        ? ` · ${others} device${others === 1 ? "" : "s"} without radios`
        : ""}</span>
    </div>`;
  }

  static styles = [
    baseStyles,
    css`
      .section-label { padding: 4px 16px 4px; }
      .items { display: flex; flex-direction: column; gap: 2px; padding: 0 8px 8px; }
      .item { display: flex; gap: 10px; padding: 8px 10px; border-radius: 10px; }
      .item:hover { background: var(--cmr-surface-2); }
      .item.off { opacity: 0.55; }
      .kind { --mdc-icon-size: 20px; color: var(--primary-color); margin-top: 1px; flex: none; }
      .item.off .kind { color: var(--cmr-muted); }
      .main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
      .title { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
      .name { font-weight: 500; font-size: 14px; overflow: hidden; text-overflow: ellipsis; }
      .chip.band { background: color-mix(in srgb, var(--primary-color) 14%, transparent); }
      .aps { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 6px; margin-top: 2px; }
      .ap {
        all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px;
        padding: 1px 8px 1px 6px; border-radius: 999px; border: 1px solid var(--cmr-line);
      }
      .ap:hover { border-color: var(--status, var(--cmr-muted)); }
      .warn { display: flex; gap: 6px; align-items: flex-start; color: var(--cmr-alert); --mdc-icon-size: 15px; line-height: 1.35; }
      .warn ha-icon { flex: none; margin-top: 1px; }
      .none { display: flex; gap: 12px; align-items: center; padding: 8px 16px 14px; --mdc-icon-size: 28px; }
      .none ha-icon { color: var(--cmr-muted); }
      .foot { border-top: 1px solid var(--cmr-line); padding: 8px 16px 10px; }
    `,
  ];
}
