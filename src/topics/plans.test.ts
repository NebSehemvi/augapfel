import { describe, expect, it } from 'vitest';
import { PLANS } from './plans';
import { THEMES } from '../data/themes';
import { seeded } from '../lib/rng';
import type { Exercise } from '../exercises/types';
import type { Ctx } from '../exercises/context';

function texts(ex: Exercise): string[] {
  switch (ex.type) {
    case 'fill':
      return ex.items.flatMap((i) => [i.parts.map((p) => (typeof p === 'number' ? '_' : p)).join(''), ...i.answers.flat()]);
    case 'choice':
      return ex.items.flatMap((i) => [...(i.parts ?? []).map(String), i.question ?? '', ...i.options]);
    case 'order':
      return ex.item.chunks;
    case 'table':
      return ex.item.chunks.map((c) => c.text);
    case 'match':
      return ex.pairs.flat();
    case 'sort':
      return ex.items.map((i) => i.text);
    case 'conj':
      return ex.rows.flatMap((r) => r.answers);
    case 'write':
      return [...ex.item.cues, ...ex.item.answers];
    case 'snake':
      return ex.sentences;
    case 'forms':
      return ex.items.flatMap((i) => i.fields.flatMap((f) => f.answers));
    case 'bank':
      return [...ex.bank, ...ex.items.flatMap((i) => i.answers)];
  }
}

function validate(ex: Exercise, where: string) {
  for (const t of texts(ex)) {
    expect(t, where).not.toMatch(/undefined|null|NaN/);
    expect(t.includes('\u0000'), where).toBe(false);
    expect(t, where).not.toMatch(/ {2}/);
  }
  switch (ex.type) {
    case 'fill':
      expect(ex.items.length, where).toBeGreaterThan(0);
      for (const it of ex.items) {
        const gaps = it.parts.filter((p) => typeof p === 'number').length;
        expect(gaps, where).toBe(it.answers.length);
        for (const a of it.answers) expect(a.length, where).toBeGreaterThan(0);
      }
      break;
    case 'choice':
      expect(ex.items.length, where).toBeGreaterThan(0);
      for (const it of ex.items) {
        expect(it.answer, `${where} ${JSON.stringify(it)}`).toBeGreaterThanOrEqual(0);
        expect(new Set(it.options).size, `${where} ${JSON.stringify(it.options)}`).toBe(it.options.length);
      }
      break;
    case 'order':
      expect(ex.item.answers.length, where).toBeGreaterThan(0);
      for (const a of ex.item.answers) expect([...a].sort().join(), where).toBe(ex.item.chunks.map((_, i) => i).sort().join());
      break;
    case 'match':
      expect(ex.pairs.length, where).toBeGreaterThanOrEqual(3);
      expect(new Set(ex.pairs.map((p) => p[0])).size, where).toBe(ex.pairs.length);
      expect(new Set(ex.pairs.map((p) => p[1])).size, `${where} ${JSON.stringify(ex.pairs)}`).toBe(ex.pairs.length);
      break;
    case 'sort':
      expect(ex.items.length, where).toBeGreaterThan(3);
      for (const it of ex.items) expect(it.cat, where).toBeLessThan(ex.categories.length);
      break;
    case 'write':
      expect(ex.item.answers.length, where).toBeGreaterThan(0);
      break;
    case 'table':
      expect(ex.item.chunks.length, where).toBeGreaterThan(2);
      break;
    case 'bank':
      expect(ex.items.length, where).toBeGreaterThan(0);
      for (const it of ex.items) expect(ex.bank, where).toContain(it.answers[0]);
      break;
  }
}

describe('topic plans', () => {
  for (const [id, plan] of Object.entries(PLANS)) {
    it(`${id} generates valid exercises for every theme`, () => {
      for (const theme of THEMES) {
        for (let seed = 1; seed <= 15; seed++) {
          const ctx: Ctx = { theme, rng: seeded(seed * 7919 + theme.id.length), level: 'A2', includeRare: false };
          const exs = plan(ctx);
          exs.forEach((ex, i) => validate(ex, `${id}/${theme.id}/seed ${seed}/#${i} ${ex.type}`));
        }
      }
    });
  }
});

describe('samples (printed for review)', () => {
  it('prints', () => {
    if (!process.env.SAMPLES) return;
    const out: string[] = [];
    for (const [id, plan] of Object.entries(PLANS)) {
      const theme = THEMES[(id.length * 3) % THEMES.length];
      const exs = plan({ theme, rng: seeded(42), level: 'A2', includeRare: false });
      out.push(`\n=== ${id} (${theme.id})`);
      for (const ex of exs) {
        out.push(`-- ${ex.type}: ${ex.title}`);
        if (ex.type === 'fill') ex.items.forEach((i) => out.push(`   ${i.parts.map((p) => (typeof p === 'number' ? `[${i.answers[p][0]}]` : p)).join('')}  (${i.hint ?? ''})`));
        if (ex.type === 'choice') ex.items.forEach((i) => out.push(`   ${(i.parts ?? [i.question]).map((p) => (typeof p === 'number' ? `[${i.options[i.answer]}]` : p)).join('')}  {${i.options.join('|')}}`));
        if (ex.type === 'order') out.push(`   ${ex.item.answers.map((a) => a.map((k) => ex.item.chunks[k]).join(' ')).join('  ||  ')}`);
        if (ex.type === 'table') out.push(`   ${ex.item.hint}  :: ${ex.item.chunks.map((c) => `${c.text}@${c.col}`).join(', ')}`);
        if (ex.type === 'write') out.push(`   ${ex.item.cues.join(' – ')} [${ex.item.task}] => ${ex.item.answers.join('  ||  ')}`);
        if (ex.type === 'match') ex.pairs.forEach((p) => out.push(`   ${p[0]} ↔ ${p[1]}`));
        if (ex.type === 'sort') out.push(`   ${ex.items.map((i) => `${i.text}→${ex.categories[i.cat]}`).join('; ')}`);
        if (ex.type === 'conj') out.push(`   ${ex.verb}: ${ex.rows.map((r) => `${r.label} ${r.answers.join('/')}`).join(', ')}`);
        if (ex.type === 'snake') out.push(`   ${ex.sentences.join(' ')}`);
        if (ex.type === 'forms') ex.items.forEach((i) => out.push(`   ${i.prompt}: ${i.fields.map((f) => f.answers.join('/')).join(', ')}`));
      }
    }
    console.log(out.join('\n'));
  });
});
