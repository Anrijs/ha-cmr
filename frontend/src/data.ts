import type { CmrEntry, HassLike } from "./types";

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

  subscribe(hass: HassLike, listener: Listener): () => void {
    this.listeners.add(listener);
    if (this.latest) listener(this.latest);
    if (!this.unsubscribe) {
      this.unsubscribe = hass.connection.subscribeMessage<{ entries: CmrEntry[] }>(
        (message) => {
          this.latest = message.entries;
          this.listeners.forEach((fn) => fn(message.entries));
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
        // The subscription may already be gone after a reconnect; that's fine.
        pending.then((unsub) => unsub()).catch(() => undefined);
      }
    };
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
  return entries.find((entry) => entry.entry_id === entryId) ?? entries[0];
}

// ----------------------------------------------------------- rule devices

/** Keys of the devices an alert rule fires on, or why they aren't known. */
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

export interface CmrIssue {
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
