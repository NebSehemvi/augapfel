import { useSyncExternalStore } from 'react';

/** Tracks which localStorage keys failed to save (quota, private mode), so the UI can warn the learner. */
let failed: ReadonlySet<string> = new Set();
const listeners = new Set<() => void>();

export function reportSave(key: string, ok: boolean) {
  if (ok === !failed.has(key)) return;
  const next = new Set(failed);
  if (ok) next.delete(key);
  else next.add(key);
  failed = next;
  listeners.forEach((l) => l());
}

export function saveFailed(): boolean {
  return failed.size > 0;
}

export function useSaveFailed(): boolean {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    saveFailed,
  );
}
