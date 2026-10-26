import { useSyncExternalStore } from 'react';
import type { ReadingText } from '../data/texts';
import { BUILTIN_TEXTS } from '../data/texts';
import { reportSave } from './saveStatus';

/** Texts generated with Claude, stored on this device. */
const KEY = 'augapfel.texts.v1';

function load(): ReadingText[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

let texts = load();
const listeners = new Set<() => void>();

function save(next: ReadingText[]) {
  texts = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(texts));
    reportSave(KEY, true);
  } catch {
    // storage full or unavailable — kept in memory, the learner is warned (see saveStatus)
    reportSave(KEY, false);
  }
  listeners.forEach((l) => l());
}

export function useUserTexts(): ReadingText[] {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => texts,
  );
}

export function addUserText(t: ReadingText) {
  save([t, ...texts]);
}

export function deleteUserText(id: string) {
  save(texts.filter((t) => t.id !== id));
}

export function getUserTexts(): ReadingText[] {
  return texts;
}

/** Adds already validated imported texts that aren't on this device yet (matched by id). Returns how many were added. */
export function mergeUserTexts(incoming: ReadingText[] | undefined): number {
  if (!incoming) return 0;
  const have = new Set(texts.map((t) => t.id));
  const fresh = incoming
    .filter((t) => !have.has(t.id))
    .map((t) => ({ ...t, theme: t.theme ?? 'custom', level: t.level ?? 'A1', glossary: t.glossary ?? {}, questions: t.questions ?? [], generated: true }));
  if (fresh.length) save([...texts, ...fresh].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)));
  return fresh.length;
}

export function findText(id: string): ReadingText | undefined {
  return BUILTIN_TEXTS.find((t) => t.id === id) ?? texts.find((t) => t.id === id);
}
