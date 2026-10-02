import { useSyncExternalStore } from 'react';

export interface TopicStat {
  sessions: number;
  /** best score 0..1 */
  best: number;
  /** last score 0..1 */
  last: number;
  lastAt: number;
}

export interface SrsItem {
  box: number;
  due: number;
  seen: number;
  wrong: number;
}

export interface Settings {
  level: 'A1' | 'A2';
  includeRare: boolean;
  lenientUmlauts: boolean;
}

export interface Progress {
  v: 1;
  topics: Record<string, TopicStat>;
  srs: Record<string, SrsItem>;
  recentThemes: string[];
  /** ISO dates (yyyy-mm-dd) with at least one finished session */
  days: string[];
  settings: Settings;
}

const KEY = 'augapfel.progress.v1';
const DAY = 24 * 60 * 60 * 1000;
/** Leitner box intervals in days */
export const INTERVALS = [0, 1, 2, 4, 8, 16, 32];

function empty(): Progress {
  return {
    v: 1,
    topics: {},
    srs: {},
    recentThemes: [],
    days: [],
    settings: { level: 'A1', includeRare: false, lenientUmlauts: true },
  };
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    return migrate(JSON.parse(raw));
  } catch {
    return empty();
  }
}

function migrate(p: Partial<Progress>): Progress {
  const base = empty();
  return {
    ...base,
    ...p,
    settings: { ...base.settings, ...(p.settings ?? {}) },
    topics: p.topics ?? {},
    srs: p.srs ?? {},
    recentThemes: p.recentThemes ?? [],
    days: p.days ?? [],
    v: 1,
  };
}

let state: Progress = load();
const listeners = new Set<() => void>();

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable — keep in memory
  }
}

function set(next: Progress) {
  state = next;
  save();
  listeners.forEach((l) => l());
}

export function getProgress(): Progress {
  return state;
}

export function useProgress(): Progress {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
  );
}

export function updateSettings(patch: Partial<Settings>) {
  set({ ...state, settings: { ...state.settings, ...patch } });
}

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function recordSession(topicId: string, score: number, themeId?: string) {
  const prev = state.topics[topicId];
  const stat: TopicStat = {
    sessions: (prev?.sessions ?? 0) + 1,
    best: Math.max(prev?.best ?? 0, score),
    last: score,
    lastAt: Date.now(),
  };
  const recentThemes = themeId ? [themeId, ...state.recentThemes.filter((t) => t !== themeId)].slice(0, 6) : state.recentThemes;
  const d = today();
  const days = state.days.includes(d) ? state.days : [...state.days, d].slice(-400);
  set({ ...state, topics: { ...state.topics, [topicId]: stat }, recentThemes, days });
}

/**
 * Record an answer for a spaced-repetition item.
 * create=false: only items that already exist or were answered wrong are tracked
 * (so topic sessions only feed mistakes into the review queue).
 */
export function recordSrs(results: { key: string; ok: boolean }[], create: boolean) {
  if (results.length === 0) return;
  const srs = { ...state.srs };
  const now = Date.now();
  for (const { key, ok } of results) {
    const cur = srs[key];
    if (!cur && ok && !create) continue;
    const base: SrsItem = cur ?? { box: 0, due: now, seen: 0, wrong: 0 };
    if (ok) {
      const box = Math.min(base.box + 1, INTERVALS.length - 1);
      srs[key] = { box, due: now + INTERVALS[box] * DAY, seen: base.seen + 1, wrong: base.wrong };
    } else {
      srs[key] = { box: 0, due: now + 5 * 60 * 1000, seen: base.seen + 1, wrong: base.wrong + 1 };
    }
  }
  set({ ...state, srs });
}

export function dueKeys(now = Date.now()): string[] {
  return Object.entries(state.srs)
    .filter(([, v]) => v.due <= now)
    .sort((a, b) => a[1].box - b[1].box || a[1].due - b[1].due)
    .map(([k]) => k);
}

export function streak(): number {
  const set = new Set(state.days);
  let n = 0;
  const d = new Date();
  // today not done yet doesn't break the streak
  if (!set.has(fmt(d))) d.setDate(d.getDate() - 1);
  while (set.has(fmt(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

function fmt(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ---- export / import ----

export function exportProgress(): string {
  return JSON.stringify({ app: 'augapfel', exportedAt: new Date().toISOString(), progress: state }, null, 2);
}

/** Merge imported progress: keeps the better topic stats and the more advanced SRS item. */
export function importProgress(json: string): { topics: number; items: number } {
  const data = JSON.parse(json);
  if (data?.app !== 'augapfel' || !data.progress) throw new Error('Это не файл прогресса Augapfel.');
  const inc = migrate(data.progress);
  const topics = { ...state.topics };
  for (const [k, v] of Object.entries(inc.topics)) {
    const cur = topics[k];
    topics[k] = cur
      ? { sessions: Math.max(cur.sessions, v.sessions), best: Math.max(cur.best, v.best), last: v.lastAt > cur.lastAt ? v.last : cur.last, lastAt: Math.max(cur.lastAt, v.lastAt) }
      : v;
  }
  const srs = { ...state.srs };
  for (const [k, v] of Object.entries(inc.srs)) {
    const cur = srs[k];
    srs[k] = !cur || v.seen > cur.seen ? v : cur;
  }
  const days = [...new Set([...state.days, ...inc.days])].sort();
  set({ ...state, topics, srs, days });
  return { topics: Object.keys(inc.topics).length, items: Object.keys(inc.srs).length };
}

export function resetProgress() {
  set({ ...empty(), settings: state.settings });
}
