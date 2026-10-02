import type { Seg } from '../exercises/types';

/** Russian plural form: plural(5, 'день', 'дня', 'дней') → 'дней' */
export function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

/** Fill the gaps of a sentence with given answers (for solutions / mistakes list). */
export function fillParts(parts: Seg[], answers: string[]): string {
  return parts.map((p) => (typeof p === 'number' ? answers[p] : p)).join('');
}
