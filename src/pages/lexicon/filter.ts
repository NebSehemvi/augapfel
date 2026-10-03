import type { Level } from '../../grammar/types';
import type { LexScope } from '../../exercises/lexiconGame';

/** Which part of the lexicon is shown and trained. */
export type LexFilter = LexScope;

const KEY = 'augapfel.lexiconFilter';

/** The last filter is remembered on this device, so coming back from a game keeps the theme. */
export function loadFilter(level: Level): LexFilter {
  try {
    const f = JSON.parse(localStorage.getItem(KEY) ?? 'null') as LexFilter | null;
    if (f && ['noun', 'verb', 'pron', 'mine'].includes(f.kind) && typeof f.group === 'string' && Array.isArray(f.levels) && f.levels.length) return f;
  } catch {
    // no storage — use the default
  }
  return { kind: 'noun', group: 'all', levels: level === 'A1' ? ['A1'] : ['A1', 'A2'] };
}

export function saveFilter(f: LexFilter) {
  try {
    localStorage.setItem(KEY, JSON.stringify(f));
  } catch {
    // ignore
  }
}

export const scopeQuery = (f: LexFilter) => new URLSearchParams({ kind: f.kind, group: f.group, levels: f.levels.join(',') }).toString();
