import { describe, expect, it } from 'vitest';
import { NUMBER_PLANS, reviewNumbers } from './plansNumbers';
import { THEMES } from '../data/themes';
import { seeded } from '../lib/rng';
import type { Exercise } from '../exercises/types';
import { describe as describeKey } from '../pages/review/describe';
import { topicSession } from '../exercises/session';
import { getProgress } from '../lib/progress';

const keysOf = (ex: Exercise): string[] =>
  ex.type === 'fill' ? ex.items.flatMap((i) => (i.srs ?? []).filter((k): k is string => !!k)) : ex.type === 'choice' ? ex.items.flatMap((i) => (i.srs ? [i.srs] : [])) : [];

describe('Числа и время in Повторение', () => {
  it('every review key of a topic task comes back as a review task for the same item', () => {
    for (const [id, plan] of Object.entries(NUMBER_PLANS))
      for (let seed = 1; seed <= 15; seed++) {
        const keys = plan({ theme: THEMES[0], rng: seeded(seed), level: 'A1', includeRare: false }).flatMap(keysOf);
        expect(keys.length, id).toBeGreaterThan(5);
        for (const key of keys) {
          expect(key, id).toMatch(/^z\|[nptfdy]\|/);
          const review = reviewNumbers([key], seeded(seed));
          expect(review.length, key).toBe(1);
          expect(review.flatMap(keysOf), key).toEqual([key]);
          expect(describeKey(key), key).not.toBe(key);
        }
      }
  });

  it('skips broken keys and reads dates with the month counted from 1', () => {
    expect(reviewNumbers(['z|n|abc', 'z|t|25:00', 'z|d|40.2', 'z|q|1'], seeded(1))).toEqual([]);
    expect(describeKey('z|d|3.4')).toBe('3.5. — дата');
    expect(describeKey('z|t|3:30')).toBe('3:30 — время');
    expect(describeKey('z|p|349')).toBe('3,49 € — цена');
  });

  it('number topics have no vocabulary theme, other topics keep theirs', () => {
    expect(topicSession('uhrzeit', getProgress(), undefined, seeded(1)).theme).toBeUndefined();
    expect(topicSession('akkusativ', getProgress(), undefined, seeded(1)).theme).toBeDefined();
  });
});
