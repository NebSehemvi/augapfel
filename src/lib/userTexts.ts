import { useSyncExternalStore } from 'react';
import type { ReadingText } from '../data/texts';
import { BUILTIN_TEXTS } from '../data/texts';

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
  } catch {
    // storage full
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

function isText(t: unknown): t is ReadingText {
  const x = t as ReadingText;
  return !!x && typeof x.id === 'string' && typeof x.title === 'string' && Array.isArray(x.paragraphs) && x.paragraphs.every((p) => typeof p === 'string');
}

/** Adds imported texts that aren't on this device yet (matched by id). Returns how many were added. */
export function mergeUserTexts(incoming: unknown): number {
  if (!Array.isArray(incoming)) return 0;
  const have = new Set(texts.map((t) => t.id));
  const fresh = incoming
    .filter(isText)
    .filter((t) => !have.has(t.id))
    .map((t) => ({ ...t, glossary: t.glossary ?? {}, questions: t.questions ?? [], generated: true }));
  if (fresh.length) save([...texts, ...fresh].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)));
  return fresh.length;
}

export function findText(id: string): ReadingText | undefined {
  return BUILTIN_TEXTS.find((t) => t.id === id) ?? texts.find((t) => t.id === id);
}
