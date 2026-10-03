import type { Seg } from './types';

/** "Am Abend ___ ich." → ["Am Abend ", 0, " ich."]; null if there isn't exactly one gap. */
export function gapParts(sentence: string): Seg[] | null {
  const pieces = sentence.split(/_{3,}/);
  if (pieces.length !== 2) return null;
  return [pieces[0], 0, pieces[1]].filter((p) => p !== '') as Seg[];
}

const words = (s: string) => (s.toLowerCase().match(/\p{L}+/gu) ?? []);

/**
 * Sanity check for generated gap sentences: exactly one gap, a non-empty answer, and the answer must not
 * already appear elsewhere in the sentence ("Der ___ im Ofen ist heiß" with answer "Ofen" is nonsense).
 */
export function validGap(sentence: string, answer: string): boolean {
  const a = answer.trim();
  if (!a || !gapParts(sentence)) return false;
  const rest = new Set(words(sentence.replace(/_{3,}/, ' ')));
  return !words(a).some((w) => w.length > 2 && rest.has(w));
}
