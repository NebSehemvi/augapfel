import { describe, expect, it } from 'vitest';
import { COMPARE_PLANS, reviewComparatives, wrongComparatives } from './plansCompare';
import { ADJECTIVES, getAdjective } from '../data/adjectives';
import { THEMES } from '../data/themes';
import { seeded } from '../lib/rng';
import { describe as describeKey } from '../pages/review/describe';

describe('Vergleiche', () => {
  it('knows the comparative and superlative forms', () => {
    const forms = (b: string) => [getAdjective(b).comp, `am ${getAdjective(b).sup}`];
    expect(forms('alt')).toEqual(['älter', 'am ältesten']);
    expect(forms('gut')).toEqual(['besser', 'am besten']);
    expect(forms('teuer')).toEqual(['teurer', 'am teuersten']);
    expect(forms('gern')).toEqual(['lieber', 'am liebsten']);
    expect(getAdjective('klein').irregular).toBe(false);
    expect(getAdjective('groß').irregular).toBe(true);
    for (const a of ADJECTIVES) expect(wrongComparatives(a), a.base).not.toContain(a.comp);
    expect(wrongComparatives(getAdjective('teuer'))).toContain('teuerer');
  });

  it('"als" after a comparative, "wie" after so …; facts only as comparatives', () => {
    for (let seed = 1; seed <= 30; seed++) {
      const ex = COMPARE_PLANS.vergleiche({ theme: THEMES[0], rng: seeded(seed), level: 'A1', includeRare: false });
      const wieAls = ex[0];
      if (wieAls.type !== 'choice') throw new Error('expected choice');
      for (const it of wieAls.items) {
        const s = it.parts!.map((p) => (typeof p === 'number' ? '_' : p)).join('');
        expect(it.options[it.answer], s).toBe(s.includes(' so ') ? 'wie' : 'als');
        if (/Elefant|Auto|Winter|Berlin|Zugspitze|Juli/.test(s)) expect(it.options[it.answer], s).toBe('als');
      }
      for (const e of ex)
        if (e.type === 'write') {
          for (const a of e.item.answers) expect(a, JSON.stringify(e.item)).toMatch(/ (als|wie) /);
          expect(e.item.answers.every((a) => a.includes(' als ')) || e.item.answers.every((a) => a.includes(' so ') && a.includes(' wie ')), JSON.stringify(e.item)).toBe(true);
        }
    }
  });

  it('comparative mistakes come back in Повторение', () => {
    const [ex] = reviewComparatives(['c|alt', 'c|gut', 'c|unknown']);
    if (ex.type !== 'fill') throw new Error('expected fill');
    expect(ex.items.map((i) => i.answers[0][0])).toEqual(['älter', 'besser']);
    expect(describeKey('c|alt')).toBe('alt → älter');
    expect(reviewComparatives(['c|unknown'])).toEqual([]);
  });
});
