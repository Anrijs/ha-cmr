import { css, html, nothing, type PropertyDeclarations, type TemplateResult } from "lit";
import { JobDevices, jobAction, type JobDevice } from "./data";
import { CmrEntryCard, ENTRY_FIELD, baseStyles, deviceIcon, deviceStatus, labelsFrom, moreInfo, navigate, viewPath } from "./shared";
import type { CmrDevice, CmrEntry } from "./types";

interface UpgradesConfig {
  type: string;
  entry_id?: string;
  title?: string;
  jobs?: number;
  /** Dashboard views to link into (the strategy sets `devices`). */
  views?: { devices?: string };
}

// Above this many devices a rule step lists version transitions, not icons.
const SUMMARY_FROM = 12;

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
// Jobs that removing stops or cancels; run-next only applies to scheduled ones.
const CANCELLABLE = new Set([...RUNNING, "scheduled"]);
const UNDERWAY = new Set(["processing", "version check", "waiting devices"]);
// Upgrade channels; any other `channel` on a job is a pinned version.
const CHANNELS = new Set(["long-term", "stable", "testing", "development"]);

type JobAction = "cancel" | "run_next";

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
  static properties: PropertyDeclarations = {
    _open: { state: true },
    _confirm: { state: true },
    _outcome: { state: true },
  };

  /** Id of the job whose devices are shown. */
  declare _open: string;
  /** A job action waiting for its confirmation. */
  declare _confirm?: { job: string; action: JobAction };
  /** The last action's result per job: "busy", or a sentence. */
  declare _outcome: Record<string, string>;
  private _jobDevices = new JobDevices(() => this.requestUpdate());

  constructor() {
    super();
    this._open = "";
    this._outcome = {};
  }

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
              <div class="jobs">${jobs.map((job) => this._job(entry, job))}</div>`
          : nothing}
      </ha-card>
    `;
  }

  private _job(entry: CmrEntry, job: Record<string, string>): TemplateResult {
    const status = jobStatus(job);
    const cls = status === "failed" ? "failed" : RUNNING.has(status) ? "running" : status === "scheduled" ? "scheduled" : status === "done" ? "done" : "other";
    const when = status === "scheduled" && job.starts_in
      ? `starts in ${startsIn(job.starts_in)}`
      : `${job.schedule_time ?? ""}${job.run_time ? ` · took ${job.run_time}` : ""}`;
    const open = !!job.id && this._open === job.id;
    const toggle = () => {
      if (!job.id) return;
      this._open = open ? "" : job.id;
      this._confirm = undefined;
    };
    return html`<div class="job js-${cls} ${job.id ? "opens" : ""} ${open ? "open" : ""}" role="button" tabindex="0"
        aria-expanded=${open ? "true" : "false"} @click=${toggle}
        @keydown=${(e: KeyboardEvent) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), toggle())}>
        <ha-icon icon=${JOB_ICON[status] ?? "mdi:circle-outline"} title=${status}></ha-icon>
        <div class="what">
          <div><span class="mono">${job.channel ?? "?"}</span> → ${split(job.labels).join(", ") || "all"}
            ${RUNNING.has(status) ? html`<span class="chip update">${status}</span>` : nothing}</div>
          <div class="muted small">${when}</div>
        </div>
        <div class="ok mono">${job.success || (status === "scheduled" ? "" : "–")}</div>
        ${job.id ? html`<ha-icon class="chev" icon=${open ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>` : nothing}
      </div>
      ${open ? this._jobDetail(entry, job, status) : nothing}`;
  }

  /** A job's devices with CMR's state and reason, and what can be done with it. */
  private _jobDetail(entry: CmrEntry, job: Record<string, string>, status: string): TemplateResult {
    const devices = this._jobDevices.get(this.hass, entry.entry_id, job);
    const byKey = new Map(entry.devices.map((d) => [d.key, d]));
    let list: TemplateResult;
    if (devices === "loading") list = html`<div class="muted small">Loading the job's devices…</div>`;
    else if (devices === "unsupported") list = html`<div class="muted small">This controller can't list a job's devices.</div>`;
    else if (devices === "error") list = html`<div class="muted small">The job's devices couldn't be read.</div>`;
    else if (!devices.length) {
      list = html`<div class="muted small">${status === "scheduled"
        ? "The controller lists the devices when the job starts."
        : "No devices."}</div>`;
    } else {
      const finished = !CANCELLABLE.has(job.state ?? "scheduled");
      const pinned = !!job.channel && !CHANNELS.has(job.channel);
      list = html`${devices.map((d) => this._jobDevice(d, byKey.get(d.device_key ?? ""), finished))}
        ${devices.some((d) => d.error === "no upgrade available")
          ? html`<div class="muted small note">CMR counts <i>no upgrade available</i> as a failed upgrade: the
              device already ran the target version, or that version's packages weren't found.
              ${pinned
                ? html`This job pins <span class="mono">${job.channel}</span>, and the controller installs a pinned
                    version only from packages it already has (its packages directory or cache). An upgrade through
                    the device's channel downloads them.`
                : nothing}</div>`
          : nothing}`;
    }
    const state = job.state ?? "scheduled";
    const actions: JobAction[] = [];
    if (entry.actions && this.hass.user?.is_admin) {
      if (state === "scheduled") actions.push("run_next");
      if (CANCELLABLE.has(state)) actions.push("cancel");
    }
    const outcome = this._outcome[job.id];
    const confirm = this._confirm?.job === job.id ? this._confirm.action : undefined;
    return html`<div class="job-detail">
      ${list}
      ${confirm
        ? html`<div class="confirm">
            <span>${confirm === "run_next"
              ? "Run this job now? It starts as a new job, and this one stays scheduled."
              : UNDERWAY.has(state)
                ? "Stop this job? Devices not upgraded yet are marked cancelled; an install already under way can still finish when its device reboots."
                : "Cancel this job?"}</span>
            <button class="pill on" @click=${() => this._act(entry, job.id, confirm)}>
              ${confirm === "run_next" ? "Run now" : "Cancel job"}</button>
            <button class="pill" @click=${() => (this._confirm = undefined)}>Back</button>
          </div>`
        : actions.length && outcome !== "busy"
          ? html`<div class="actions">
              ${actions.map((action) => html`<button class="pill" @click=${() => (this._confirm = { job: job.id, action })}>
                ${action === "run_next" ? "Run now" : "Cancel job"}</button>`)}
            </div>`
          : nothing}
      ${outcome ? html`<div class="muted small">${outcome === "busy" ? "Sending…" : outcome}</div>` : nothing}
    </div>`;
  }

  private _jobDevice(d: JobDevice, device: CmrDevice | undefined, finished: boolean): TemplateResult {
    // The controller restarts during its own upgrade, so its row in a finished
    // job stays "rebooting"; running the target version means it upgraded.
    const restarted = finished && !d.error && d.state === "rebooting"
      && !!d.upgrade_version && d.current_version === d.upgrade_version;
    const kind = d.error ? "failed" : d.state === "done" || restarted ? "done" : d.state === "cancelled" ? "other" : "running";
    const icon = { failed: "mdi:alert-circle", done: "mdi:check-circle", other: "mdi:cancel", running: "mdi:progress-clock" }[kind];
    const versions = d.upgrade_version && d.upgrade_version !== d.current_version
      ? `${d.current_version ?? "?"} → ${d.upgrade_version}`
      : (d.current_version ?? "");
    return html`<div class="jd js-${kind}">
      <ha-icon icon=${icon}></ha-icon>
      ${device?.entities.update
        ? html`<button class="name" @click=${() => moreInfo(this, device.entities.update)}>${d.identity}</button>`
        : html`<span class="name">${d.identity}</span>`}
      <span class="mono muted">${versions}</span>
      <span class="chip">${restarted ? "upgraded" : (d.state ?? "?")}</span>
      ${d.error ? html`<span class="reason">${d.error}</span>` : nothing}
      ${restarted ? html`<span class="muted small">restarted before the job could record it</span>` : nothing}
    </div>`;
  }

  private async _act(entry: CmrEntry, jobId: string, action: JobAction): Promise<void> {
    this._confirm = undefined;
    this._outcome = { ...this._outcome, [jobId]: "busy" };
    let text: string;
    try {
      await jobAction(this.hass, entry.entry_id, jobId, action);
      text = action === "run_next" ? "Started as a new job." : "Job removed; the list updates on the next poll.";
    } catch (err) {
      text = (err as { message?: string })?.message ?? String(err);
    }
    this._outcome = { ...this._outcome, [jobId]: text };
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
                ${group.devices.length > SUMMARY_FROM
                  ? this._summary(group.devices)
                  : html`<div class="devs">
                      ${group.devices.map(
                        (d) => html`<button class="dev status-${deviceStatus(d)}" title="${d.identity} · ${d.version}"
                          @click=${() => moreInfo(this, d.entities.update)}><ha-icon icon=${deviceIcon(d)}></ha-icon></button>`,
                      )}
                      ${group.devices.length ? nothing : html`<span class="muted small">none</span>`}
                    </div>`}
              </div>
            `,
          )}
        </div>
      </div>
    `;
  }

  /** "306× 7.24.2 → 7.24.5 · 48× 7.24.5": a large step by version transition, most devices first. */
  private _summary(devices: CmrDevice[]): TemplateResult {
    const rows = new Map<string, { from: string; to?: string; count: number }>();
    let offline = 0;
    for (const d of devices) {
      if (!d.connected && !d.controller) offline++;
      const from = d.version ?? "?";
      const to = d.update_available ? (d.available_version ?? undefined) : undefined;
      const key = `${from}\u0000${to ?? ""}`;
      const row = rows.get(key) ?? { from, to, count: 0 };
      row.count++;
      rows.set(key, row);
    }
    const devicesView = this._config.views?.devices;
    return html`<div class="summary">
      ${[...rows.values()]
        .sort((a, b) => b.count - a.count || a.from.localeCompare(b.from))
        .map((row) => {
          const text = html`<b>${row.count}×</b> <span class="mono">${row.from}${row.to ? ` → ${row.to}` : ""}</span>`;
          const cls = `trans ${row.to ? "status-update" : "status-ok"}`;
          return devicesView
            ? html`<button class=${cls} title="Show these devices"
                @click=${() => navigate(viewPath(devicesView, { cmr_version: row.from }))}>${text}</button>`
            : html`<span class=${cls}>${text}</span>`;
        })}
      ${offline ? html`<span class="trans status-offline"><b>${offline}</b> offline</span>` : nothing}
    </div>`;
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
      .summary { display: flex; flex-wrap: wrap; gap: 4px; }
      .trans {
        all: unset; font-size: 12px; padding: 2px 8px; border-radius: 999px; white-space: nowrap;
        background: color-mix(in srgb, var(--status) 14%, transparent);
      }
      button.trans { cursor: pointer; }
      button.trans:hover { background: color-mix(in srgb, var(--status) 24%, transparent); }
      .section { padding: 4px 16px 4px; }
      .jobs { padding: 0 8px 10px; }
      .job { display: flex; align-items: center; gap: 10px; padding: 6px 8px; border-radius: 10px; font-size: 13px; }
      .job ha-icon { --mdc-icon-size: 20px; }
      .job.opens { cursor: pointer; }
      .job.opens:hover, .job.open { background: var(--cmr-surface-2); }
      .job .chev { color: var(--cmr-muted); --mdc-icon-size: 18px; }
      .job-detail { margin: 2px 8px 8px 38px; display: grid; gap: 4px; font-size: 12.5px; }
      .jd { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; }
      .jd ha-icon { --mdc-icon-size: 16px; }
      .jd .name { all: unset; font-weight: 500; }
      .jd button.name { cursor: pointer; }
      .jd button.name:hover { text-decoration: underline; }
      .jd .reason { color: var(--cmr-alert); }
      .js-done.jd ha-icon { color: var(--cmr-ok); }
      .js-failed.jd ha-icon { color: var(--cmr-alert); }
      .js-running.jd ha-icon { color: var(--cmr-update); }
      .js-other.jd ha-icon { color: var(--cmr-muted); }
      .note { margin-top: 2px; }
      .actions, .confirm { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 4px; }
      .confirm span { flex: 1 1 220px; }
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
