import type { CmrDevice, CmrEntry, CmrLayout, CmrNode, CmrProduct, HassLike } from "./types";

/** A device as sent: its catalog product by code (the entry carries each product once). */
type WireDevice = Omit<CmrDevice, "product"> & { product: string | null; product_ambiguous?: boolean };

/** An entry as sent: layouts and nodes only when they changed since the last message. */
type WireEntry = Omit<CmrEntry, "layouts" | "nodes" | "devices"> &
  Partial<Pick<CmrEntry, "layouts" | "nodes">> & { devices: WireDevice[]; products?: Record<string, CmrProduct> };

// `error` is set once, with no entries, when the subscription itself failed.
type Listener = (entries: CmrEntry[], error?: string) => void;

function errorText(err: unknown): string {
  return (err as { message?: string })?.message ?? String(err);
}

/**
 * One shared `cmr/subscribe` subscription for all cards on a page.
 * The integration pushes a fresh snapshot after every poll.
 */
class CmrStore {
  private listeners = new Set<Listener>();
  private unsubscribe?: Promise<() => Promise<void>>;
  private latest?: CmrEntry[];
  /** The last layouts and nodes per controller, for messages that leave them out. */
  private topology = new Map<string, { layouts: CmrLayout[]; nodes: CmrNode[] }>();

  subscribe(hass: HassLike, listener: Listener): () => void {
    this.listeners.add(listener);
    if (this.latest) listener(this.latest);
    if (!this.unsubscribe) {
      this.unsubscribe = hass.connection.subscribeMessage<{ entries: WireEntry[] }>(
        (message) => {
          const entries = message.entries.map((entry) => this._hydrate(entry));
          this.latest = entries;
          this.listeners.forEach((fn) => fn(entries));
        },
        { type: "cmr/subscribe" },
      );
      this.unsubscribe.catch((err) => {
        console.error("cmr: subscription failed", err);
        this.unsubscribe = undefined;
        this.listeners.forEach((fn) => fn([], errorText(err)));
      });
    }
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0 && this.unsubscribe) {
        const pending = this.unsubscribe;
        this.unsubscribe = undefined;
        this.latest = undefined;
        this.topology.clear();
        // The subscription may already be gone after a reconnect; that's fine.
        pending.then((unsub) => unsub()).catch(() => undefined);
      }
    };
  }

  /** Back to the shape the cards read: products on the devices, the last layouts and nodes. */
  private _hydrate(wire: WireEntry): CmrEntry {
    const { products = {}, ...entry } = wire;
    const devices: CmrDevice[] = entry.devices.map(({ product, product_ambiguous, ...device }) => ({
      ...device,
      product: product && products[product] ? { ...products[product], ...(product_ambiguous ? { ambiguous: true } : {}) } : null,
    }));
    if (entry.layouts && entry.nodes) {
      this.topology.set(entry.entry_id, { layouts: entry.layouts, nodes: entry.nodes });
      return { ...entry, devices, layouts: entry.layouts, nodes: entry.nodes };
    }
    const kept = this.topology.get(entry.entry_id) ?? { layouts: [], nodes: [] };
    return { ...entry, devices, ...kept };
  }

  /** Resolve with the first snapshot (used by the dashboard strategy). */
  once(hass: HassLike): Promise<CmrEntry[]> {
    if (this.latest) return Promise.resolve(this.latest);
    return new Promise((resolve, reject) => {
      // The listener can fire synchronously, before subscribe() returns.
      let unsubscribe: (() => void) | undefined;
      let done = false;
      unsubscribe = this.subscribe(hass, (entries, error) => {
        if (done) return;
        done = true;
        queueMicrotask(() => unsubscribe?.());
        if (error) reject(new Error(error));
        else resolve(entries);
      });
    });
  }
}

export const cmrStore = new CmrStore();

/** Pick the configured controller, or the first one. */
export function pickEntry(entries: CmrEntry[] | undefined, entryId?: string): CmrEntry | undefined {
  if (!entries?.length) return undefined;
  // A card pinned to one controller never shows another one (e.g. while that
  // controller's entry is still loading after a restart).
  if (entryId) return entries.find((entry) => entry.entry_id === entryId);
  return entries[0];
}

// ----------------------------------------------------------- rule devices

/** Keys of the devices an alert rule's state alert is active on, or why they aren't known. */
export type RuleDevicesState = string[] | "loading" | "error" | "unsupported";

// Shared by every card on the page; a result is good for half a minute.
const ruleDevicesCache = new Map<string, { at: number; keys: string[] }>();
const RULE_DEVICES_TTL = 30_000;

async function fetchRuleDevices(hass: HassLike, entryId: string, ruleId: string): Promise<string[]> {
  const key = `${entryId}/${ruleId}`;
  const hit = ruleDevicesCache.get(key);
  if (hit && Date.now() - hit.at < RULE_DEVICES_TTL) return hit.keys;
  const result = await hass.connection.sendMessagePromise<{ devices: string[] }>({
    type: "cmr/alert_devices",
    entry_id: entryId,
    rule_id: ruleId,
  });
  ruleDevicesCache.set(key, { at: Date.now(), keys: result.devices });
  return result.devices;
}

/**
 * Per-card view of rule device lists: `get()` during render starts the
 * lookup once and reports its state; `onChange` fires when it lands. After
 * `invalidate()` (a new snapshot) the old list stays up while it refreshes.
 */
export class RuleDevices {
  private state = new Map<string, RuleDevicesState>();
  private stale = new Set<string>();

  constructor(private onChange: () => void) {}

  get(hass: HassLike, entryId: string, ruleId: string): RuleDevicesState {
    const key = `${entryId}/${ruleId}`;
    const current = this.state.get(key);
    if (current !== undefined && !this.stale.has(key)) return current;
    this.stale.delete(key);
    if (current === undefined) this.state.set(key, "loading");
    fetchRuleDevices(hass, entryId, ruleId)
      .then((keys) => this.state.set(key, keys))
      .catch((err: { code?: string }) => this.state.set(key, err?.code === "unsupported" ? "unsupported" : "error"))
      .finally(() => this.onChange());
    return this.state.get(key)!;
  }

  invalidate(): void {
    for (const key of this.state.keys()) this.stale.add(key);
  }
}

// ------------------------------------------------------------ job devices

/** One device of an upgrade job: CMR's own state and reason for it. */
export interface JobDevice {
  identity: string;
  address: string | null;
  state: string | null;
  /** CMR's reason, e.g. "no upgrade available" (CMR counts it as a failure). */
  error: string | null;
  current_version: string | null;
  upgrade_version: string | null;
  channel: string | null;
  device_key: string | null;
}

export type JobDevicesState = JobDevice[] | "loading" | "error" | "unsupported";

/**
 * Per-card device lists of opened upgrade jobs. A finished job's list doesn't
 * change; a live one is fetched again whenever its row in the snapshot changes,
 * and the previous list stays up meanwhile.
 */
export class JobDevices {
  private state = new Map<string, { version: string; value: JobDevicesState }>();

  constructor(private onChange: () => void) {}

  get(hass: HassLike, entryId: string, job: Record<string, string>): JobDevicesState {
    const key = `${entryId}/${job.id}`;
    const version = [job.state, job.success, job.start_time, job.end_time].join("|");
    const current = this.state.get(key);
    if (current?.version === version) return current.value;
    const value: JobDevicesState = current?.value ?? "loading";
    this.state.set(key, { version, value });
    hass.connection
      .sendMessagePromise<{ devices: JobDevice[] }>({ type: "cmr/job_devices", entry_id: entryId, job_id: job.id })
      .then((result) => this.state.set(key, { version, value: result.devices }))
      .catch((err: { code?: string }) =>
        this.state.set(key, { version, value: err?.code === "unsupported" ? "unsupported" : "error" }),
      )
      .finally(() => this.onChange());
    return value;
  }
}

/** Cancel an upgrade job, or run a scheduled one now. */
export function jobAction(hass: HassLike, entryId: string, jobId: string, action: "cancel" | "run_next"): Promise<unknown> {
  return hass.connection.sendMessagePromise({ type: "cmr/job_action", entry_id: entryId, job_id: jobId, action });
}

// ------------------------------------------------------------------ events

export interface CmrEvent {
  id: string;
  time: string;
  source: string;
  category: string;
  severity: "info" | "notice" | "warning" | "error";
  title: string;
  message: string;
  topics?: string[];
  data: Record<string, unknown>;
  device_key: string | null;
  device_name: string | null;
  device_id: string | null;
  subject_name?: string;
  /** Set by the integration; older stored events lack it. */
  notable?: boolean;
}

/** Clear a detected issue by hand; it comes back only on new occurrences. */
export function dismissIssue(hass: HassLike, entryId: string, key: string): Promise<unknown> {
  return hass.connection.sendMessagePromise({ type: "cmr/issue_dismiss", entry_id: entryId, key });
}

export interface CmrIssue {
  entry_id: string;
  key: string;
  kind: string;
  severity: string;
  title: string;
  detail: string;
  since: string;
  updated: string;
  count: number;
  device_key: string | null;
  device_name: string | null;
  device_id: string | null;
}

type EventsListener = (events: CmrEvent[], issues: CmrIssue[], error?: string) => void;

/** One `cmr/events/subscribe` feed: recent events plus new ones live. */
class EventsFeed {
  private listeners = new Set<EventsListener>();
  private unsubscribe?: Promise<() => Promise<void>>;
  private events: CmrEvent[] = [];
  private issues: CmrIssue[] = [];
  private loaded = false;

  constructor(private readonly entryId?: string) {}

  subscribe(hass: HassLike, listener: EventsListener): () => void {
    this.listeners.add(listener);
    if (this.loaded) listener(this.events, this.issues);
    if (!this.unsubscribe) {
      this.unsubscribe = hass.connection.subscribeMessage<{ events: CmrEvent[]; issues: CmrIssue[]; reset?: boolean }>(
        (message) => {
          this.events = message.reset ? message.events : [...this.events, ...message.events].slice(-1000);
          this.issues = message.issues;
          this.loaded = true;
          this.listeners.forEach((fn) => fn(this.events, this.issues));
        },
        { type: "cmr/events/subscribe", limit: 1000, ...(this.entryId ? { entry_id: this.entryId } : {}) },
      );
      this.unsubscribe.catch((err) => {
        console.error("cmr: events subscription failed", err);
        this.unsubscribe = undefined;
        this.listeners.forEach((fn) => fn([], [], errorText(err)));
      });
    }
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0 && this.unsubscribe) {
        const pending = this.unsubscribe;
        this.unsubscribe = undefined;
        this.loaded = false;
        this.events = [];
        pending.then((unsub) => unsub()).catch(() => undefined);
      }
    };
  }
}

/** Feeds shared by every events card on the page, one per controller (or all). */
class CmrEventsStore {
  private feeds = new Map<string, EventsFeed>();

  subscribe(hass: HassLike, entryId: string | undefined, listener: EventsListener): () => void {
    const key = entryId ?? "";
    let feed = this.feeds.get(key);
    if (!feed) {
      feed = new EventsFeed(entryId);
      this.feeds.set(key, feed);
    }
    return feed.subscribe(hass, listener);
  }
}

export const cmrEvents = new CmrEventsStore();
