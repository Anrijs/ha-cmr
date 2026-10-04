import { css, html, nothing, type TemplateResult } from "lit";
import { CmrEntryCard, ENTRY_FIELD, baseStyles, deviceIcon, deviceStatus, labelsFrom, moreInfo } from "./shared";
import type { CmrDevice, CmrEntry } from "./types";

interface UpgradesConfig {
  type: string;
  entry_id?: string;
  title?: string;
  jobs?: number;
}

// Controller job states (plus "failed" for a done job that didn't upgrade everything).
const JOB_ICON: Record<string, string> = {
  done: "mdi:check-circle",
  failed: "mdi:close-circle",
  processing: "mdi:progress-upload",
  "version check": "mdi:magnify",
  "waiting devices": "mdi:timer-sand",
  queued: "mdi:tray-full",
  "queued (busy)": "mdi:tray-full",
  scheduled: "mdi:calendar-clock",
  cancelled: "mdi:cancel",
};
const RUNNING = new Set(["processing", "version check", "waiting devices", "queued", "queued (busy)"]);

function split(value: string | undefined): string[] {
  return (value ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}

/** A finished job with `success` below "n/n" failed on some device. */
function jobStatus(job: Record<string, string>): string {
  const [ok, total] = (job.success ?? "").split("/").map(Number);
  if (job.state === "done" && total && ok < total) return "failed";
  return job.state ?? "scheduled";
}

/** "6d2h" → "6d 2h", for the controller's starts-in value. */
function startsIn(value: string | undefined): string {
  return (value ?? "").replace(/([a-z])(\d)/g, "$1 $2");
}

export class CmrUpgradesCard extends CmrEntryCard<UpgradesConfig> {
  setConfig(config: UpgradesConfig): void {
    this._config = { jobs: 5, ...config };
  }

  static getConfigForm() {
    return {
      schema: [
        ENTRY_FIELD,
        { name: "title", selector: { text: {} } },
        { name: "jobs", selector: { number: { min: 0, max: 30, mode: "box" } } },
      ],
      computeLabel: labelsFrom({ entry_id: "Controller", title: "Title", jobs: "Recent jobs to show" }),
    };
  }

  getGridOptions() {
    return { columns: "full", rows: "auto", min_columns: 4 };
  }

  getCardSize(): number {
    return 6;
  }

  protected render(): TemplateResult {
    const entry = this._entry;
    if (!entry) return this.renderWaiting();

    const updates = entry.devices.filter((d) => d.update_available).length;
    // The controller's built-in "default" rule only matters while it covers a device.
    const rules = entry.upgrade_rules.filter(
      (rule) => rule.dynamic !== "true" || entry.devices.some((d) => d.upgrade_rule === rule.name),
    );
    // Schedule times are "YYYY-MM-DD HH:MM:SS", so they sort as text.
    const jobs = [...entry.upgrade_jobs]
      .sort((a, b) => (b.schedule_time ?? "").localeCompare(a.schedule_time ?? ""))
      .slice(0, this._config.jobs ?? 5);

    return html`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:update"></ha-icon>
          <span>${this._config.title ?? "Upgrades"}</span>
          ${updates
            ? html`<span class="chip update">${updates} available</span>`
            : html`<span class="chip">up to date</span>`}
        </div>
        ${this.renderStale(entry)}

        ${rules.length
          ? rules.map((rule) => this._rule(entry, rule))
          : html`<div class="empty small">No upgrade rules. Devices are checked against their channel only.</div>`}

        ${jobs.length
          ? html`<div class="section section-label">Recent jobs</div>
              <div class="jobs">
                ${jobs.map((job) => {
                  const status = jobStatus(job);
                  const cls = status === "failed" ? "failed" : RUNNING.has(status) ? "running" : status === "scheduled" ? "scheduled" : status === "done" ? "done" : "other";
                  const when = status === "scheduled" && job.starts_in
                    ? `starts in ${startsIn(job.starts_in)}`
                    : `${job.schedule_time ?? ""}${job.run_time ? ` · took ${job.run_time}` : ""}`;
                  return html`<div class="job js-${cls}">
                    <ha-icon icon=${JOB_ICON[status] ?? "mdi:circle-outline"} title=${status}></ha-icon>
                    <div class="what">
                      <div><span class="mono">${job.channel ?? "?"}</span> → ${split(job.labels).join(", ") || "all"}
                        ${RUNNING.has(status) ? html`<span class="chip update">${status}</span>` : nothing}</div>
                      <div class="muted small">${when}</div>
                    </div>
                    <div class="ok mono">${job.success || (status === "scheduled" ? "" : "–")}</div>
                  </div>`;
                })}
              </div>`
          : nothing}
      </ha-card>
    `;
  }

  private _rule(entry: CmrEntry, rule: Record<string, string>): TemplateResult {
    const members = entry.devices.filter((d) => d.upgrade_rule === rule.name);
    const steps = split(rule.order);
    const groups: { label: string; devices: CmrDevice[] }[] = steps.length
      ? steps.map((label) => ({ label, devices: members.filter((d) => d.labels.includes(label)) }))
      : [{ label: split(rule.labels).join(", ") || "all", devices: members }];
    const placed = new Set(groups.flatMap((g) => g.devices.map((d) => d.key)));
    const rest = members.filter((d) => !placed.has(d.key));
    if (rest.length) groups.push({ label: "other", devices: rest });

    return html`
      <div class="rule">
        <div class="rule-head">
          <b>${rule.name}</b>
          <span class="muted small">
            ${[rule.channel && `channel ${rule.channel}`, rule.strategy, rule.fail_policy && `on failure: ${rule.fail_policy}`]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </div>
        ${rule.comment ? html`<div class="muted small comment">${rule.comment}</div>` : nothing}
        <div class="pipeline">
          ${groups.map(
            (group, i) => html`
              ${i ? html`<ha-icon class="arrow" icon="mdi:chevron-right"></ha-icon>` : nothing}
              <div class="step">
                <div class="step-label"><span class="n">${i + 1}</span>${group.label}</div>
                <div class="devs">
                  ${group.devices.map(
                    (d) => html`<button class="dev status-${deviceStatus(d)}" title="${d.identity} · ${d.version}"
                      @click=${() => moreInfo(this, d.entities.update)}><ha-icon icon=${deviceIcon(d)}></ha-icon></button>`,
                  )}
                  ${group.devices.length ? nothing : html`<span class="muted small">none</span>`}
                </div>
              </div>
            `,
          )}
        </div>
      </div>
    `;
  }

  static styles = [
    baseStyles,
    css`
      .rule { margin: 0 12px 10px; padding: 10px 12px; border-radius: 12px; background: var(--cmr-surface-2); }
      .rule-head { display: flex; flex-wrap: wrap; gap: 4px 10px; align-items: baseline; }
      .comment { margin-top: 2px; }
      .pipeline { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 4px; margin-top: 10px; }
      .arrow { color: var(--cmr-muted); flex: none; --mdc-icon-size: 18px; }
      .step { flex: 1 0 auto; min-width: 84px; padding: 6px 8px; border-radius: 10px; background: var(--cmr-surface); border: 1px solid var(--cmr-line); }
      .step-label { font-size: 12px; font-weight: 500; display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
      .n { width: 16px; height: 16px; border-radius: 50%; display: grid; place-items: center; font-size: 10px; background: var(--primary-color); color: var(--text-primary-color, #fff); }
      .devs { display: flex; gap: 4px; flex-wrap: wrap; }
      .dev {
        all: unset; cursor: pointer; width: 26px; height: 26px; border-radius: 8px; display: grid; place-items: center;
        background: color-mix(in srgb, var(--status) 14%, transparent); color: var(--status); --mdc-icon-size: 16px;
      }
      .section { padding: 4px 16px 4px; }
      .jobs { padding: 0 8px 10px; }
      .job { display: flex; align-items: center; gap: 10px; padding: 6px 8px; border-radius: 10px; font-size: 13px; }
      .job ha-icon { --mdc-icon-size: 20px; }
      .js-done ha-icon { color: var(--cmr-ok); }
      .js-failed ha-icon { color: var(--cmr-alert); }
      .js-running ha-icon { color: var(--cmr-update); }
      .js-scheduled ha-icon { color: var(--cmr-pending); }
      .js-other ha-icon { color: var(--cmr-muted); }
      .what { flex: 1; min-width: 0; }
      .ok { font-size: 12px; color: var(--cmr-muted); }
    `,
  ];
}
