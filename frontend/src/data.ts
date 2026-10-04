import type { CmrEntry, HassLike } from "./types";

type Listener = (entries: CmrEntry[]) => void;

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
    return new Promise((resolve) => {
      // The listener can fire synchronously, before subscribe() returns.
      let unsubscribe: (() => void) | undefined;
      let done = false;
      unsubscribe = this.subscribe(hass, (entries) => {
        if (done) return;
        done = true;
        queueMicrotask(() => unsubscribe?.());
        resolve(entries);
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
  device_id: string | null;
}

type EventsListener = (events: CmrEvent[], issues: CmrIssue[]) => void;

/** Shared `cmr/events/subscribe`: recent events plus new ones live. */
class CmrEventsStore {
  private listeners = new Set<EventsListener>();
  private unsubscribe?: Promise<() => Promise<void>>;
  private events: CmrEvent[] = [];
  private issues: CmrIssue[] = [];
  private loaded = false;

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
        { type: "cmr/events/subscribe", limit: 1000 },
      );
      this.unsubscribe.catch((err) => {
        console.error("cmr: events subscription failed", err);
        this.unsubscribe = undefined;
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

export const cmrEvents = new CmrEventsStore();
