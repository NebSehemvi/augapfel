import { describe, expect, it } from 'vitest';
import { article, nounPhrase } from '../grammar/articles';
import { classifyNegation, placeNicht } from '../grammar/negation';
import { render, sentence, type ClauseSpec, type Order } from '../grammar/clause';
import { getVerb } from '../data/verbs';
import type { Ctx } from '../exercises/context';
import type { Exercise } from '../exercises/types';
import { ALL_NOUNS, THEMES } from '../data/themes';
import { seeded } from '../lib/rng';
import { NEGATION_PLANS, classifyAct, negationExamples } from './plansNegation';

describe('kein declension', () => {
  const expected = { m: ['kein', 'keinen', 'keinem'], f: ['keine', 'keine', 'keiner'], n: ['kein', 'kein', 'keinem'], pl: ['keine', 'keine', 'keinen'] };
  for (const g of ['m', 'f', 'n', 'pl'] as const)
    for (const [i, c] of (['nom', 'akk', 'dat'] as const).entries())
      it(`${g}/${c}`, () => expect(article('kein', g, c)).toBe(expected[g][i]));
  it('inflects the noun too, including weak and dative plural nouns', () => {
    const child = { de: 'Kind', g: 'n' as const, pl: 'Kinder', ru: '', en: '' };
    expect(nounPhrase('kein', child, 'dat', true)).toBe('keinen Kindern');
    expect(nounPhrase('kein', { ...child, de: 'Auto', pl: 'Autos' }, 'dat', true)).toBe('keinen Autos');
    expect(nounPhrase('kein', { ...child, de: 'Mensch', g: 'm', weak: 'Menschen' }, 'akk')).toBe('keinen Menschen');
    expect(nounPhrase('kein', { ...child, de: 'Wasser', pl: null, mass: true }, 'akk')).toBe('kein Wasser');
    expect(nounPhrase('kein', { ...child, de: 'Apfel', g: 'm', pl: 'Äpfel' }, 'nom', true)).toBe('keine Äpfel');
  });
});

describe('nicht placement on classified clause chunks', () => {
  const subj = { de: 'ich', person: 0 as const, pronoun: true };
  const spec = (v: string, extra: Partial<ClauseSpec> = {}): ClauseSpec => ({ subj, verb: getVerb(v), tense: 'pres', ...extra });
  const cases: [ClauseSpec, Order, 'clause' | 'complement', string][] = [
    [spec('kaufen', { c: 'den Apfel' }), 'S', 'clause', 'Ich kaufe den Apfel nicht.'],
    [spec('kommen', { time: 'heute' }), 'S', 'clause', 'Ich komme heute nicht.'],
    [spec('fahren', { c: 'nach Berlin' }), 'S', 'complement', 'Ich fahre nicht nach Berlin.'],
    [spec('sein', { c: 'müde' }), 'S', 'complement', 'Ich bin nicht müde.'],
    [spec('aufstehen', { c: 'früh' }), 'S', 'complement', 'Ich stehe nicht früh auf.'],
    [spec('anrufen', { c: 'meinen Bruder' }), 'S', 'clause', 'Ich rufe meinen Bruder nicht an.'],
    [spec('kennen', { c: 'Anna' }), 'S', 'clause', 'Ich kenne Anna nicht.'],
    [spec('sprechen', { c: 'schnell' }), 'S', 'complement', 'Ich spreche nicht schnell.'],
    [spec('kommen', { time: 'heute', modal: getVerb('können') }), 'S', 'clause', 'Ich kann heute nicht kommen.'],
    [spec('arbeiten', { time: 'heute', tense: 'perf' }), 'S', 'clause', 'Ich habe heute nicht gearbeitet.'],
    [spec('kommen', { tense: 'perf' }), 'S', 'clause', 'Ich bin nicht gekommen.'],
    [spec('kommen', { tense: 'fut' }), 'S', 'clause', 'Ich werde nicht kommen.'],
    [spec('arbeiten', { time: 'heute' }), 'T', 'clause', 'Heute arbeite ich nicht.'],
    [spec('kommen'), 'Y', 'clause', 'Komme ich nicht?'],
    [spec('arbeiten', { lead: 'weil', tense: 'perf' }), 'SUB', 'clause', 'Weil ich nicht gearbeitet habe.'],
    [spec('aufstehen', { lead: 'weil' }), 'SUB', 'clause', 'Weil ich nicht aufstehe.'],
    [spec('sich beeilen'), 'S', 'clause', 'Ich beeile mich nicht.'],
    [spec('fahren', { time: 'heute', c: 'nach Berlin' }), 'S', 'complement', 'Ich fahre heute nicht nach Berlin.'],
  ];
  for (const [s, order, scope, want] of cases) it(want, () => {
    const chunks = render(s, order);
    const original = structuredClone(chunks);
    expect(sentence(placeNicht(chunks, scope), order === 'Y' ? '?' : '.')).toBe(want);
    expect(chunks).toEqual(original);
  });
  it('rejects double negation and missing scope targets', () => {
    expect(() => placeNicht(render(spec('haben', { c: 'keinen Apfel' }), 'S'))).toThrow();
    expect(() => placeNicht(render(spec('kommen'), 'S'), 'complement')).toThrow();
    expect(() => placeNicht(placeNicht(render(spec('kommen'), 'S')))).toThrow();
  });
});

describe('activity classification', () => {
  const classify = (c: string, nounCase: 'nom' | 'akk' | 'dat' = 'akk') => classifyNegation(c, ALL_NOUNS, nounCase);
  it('recognizes definite, possessive, demonstrative, name and pronoun objects', () => {
    for (const c of ['den Apfel', 'die neuen Wörter', 'meinen Schlüssel', 'euren Bruder', 'dieses Buch', 'Anna', 'ihn', 'Ihnen']) {
      expect(classify(c), c).toEqual({ kind: 'nicht', scope: 'clause' });
    }
  });
  it('recognizes prepositions, contractions and standalone predicates', () => {
    for (const c of ['nach Berlin', 'im Wohnzimmer', 'zum Arzt', 'für die Familie', 'auf einen Berg', 'müde', 'schnell', 'früh']) {
      expect(classify(c), c).toEqual({ kind: 'nicht', scope: 'complement' });
    }
  });
  it('maps indefinite and bare nouns to declined kein phrases', () => {
    for (const [c, nounCase, want] of [
      ['einen Apfel', 'akk', 'keinen Apfel'], ['eine Suppe', 'akk', 'keine Suppe'],
      ['ein Buch', 'akk', 'kein Buch'], ['ein Mann', 'nom', 'kein Mann'],
      ['einem Mann', 'dat', 'keinem Mann'], ['einer Frau', 'dat', 'keiner Frau'],
      ['einem Kind', 'dat', 'keinem Kind'], ['Kindern', 'dat', 'keinen Kindern'],
      ['Äpfel', 'akk', 'keine Äpfel'], ['Wasser', 'akk', 'kein Wasser'],
      ['Musik', 'akk', 'keine Musik'], ['einen Jungen', 'akk', 'keinen Jungen'],
    ] as const) {
      const result = classify(c, nounCase);
      expect(result?.kind, c).toBe('kein');
      if (result?.kind === 'kein') expect(result.complement, c).toBe(want);
    }
  });
  it('skips unrecognized, complex, quantified and already negative complements', () => {
    for (const c of ['ein unbekanntes Ding', 'einen Glorp', 'ein Apfel', 'Brot und Käse', 'ein Glas Wasser', 'dem Kind einen Apfel', 'viel Tee', 'die Stadt gut', 'heute Gäste', 'keine Zeit', 'den Schlüssel nicht', 'nichts', 'nie', 'niemanden']) {
      expect(classify(c), c).toBeNull();
    }
  });
});

function completed(ex: Exercise): string[] {
  if (ex.type === 'choice') return ex.items.map((i) => i.parts?.map((p) => typeof p === 'number' ? i.options[i.answer] : p).join('') ?? '');
  if (ex.type === 'fill') return ex.items.map((i) => i.parts.map((p) => typeof p === 'number' ? i.answers[p][0] : p).join(''));
  if (ex.type === 'sort') return ex.items.map((i) => i.text);
  if (ex.type === 'write') return ex.item.answers;
  if (ex.type === 'order') return ex.item.answers.map((a) => a.map((i) => ex.item.chunks[i]).join(' ') + ex.item.punct);
  return [];
}

const context = (theme: Ctx['theme'], seed: number, level: Ctx['level']): Ctx => ({ theme, level, rng: seeded(seed), includeRare: false });

describe('negation exercises', () => {
  it('agrees in case/gender and places a single negative across all themes, levels and seeds', () => {
    const endings = { m: ['kein', 'keinen', 'keinem'], f: ['keine', 'keine', 'keiner'], n: ['kein', 'kein', 'keinem'], pl: ['keine', 'keine', 'keinen'] };
    for (const level of ['A1', 'A2'] as const) for (const theme of THEMES) for (let seed = 1; seed <= 15; seed++) {
      const { nicht, kein } = negationExamples(context(theme, seed, level));
      expect(nicht.length).toBe(6);
      expect(kein.length).toBe(6);
      for (const e of nicht) {
        expect(e.negative.match(/\bnicht\b/g), e.negative).toHaveLength(1);
        expect(e.negative).not.toMatch(/\bkein(?:e|en|em|er|es)?\b/);
        const negIndex = e.chunks.findIndex((c) => c.text === 'nicht');
        const endIndex = e.chunks.findIndex((c) => c.slot === 'E');
        if (endIndex >= 0) expect(negIndex, e.negative).toBeLessThan(endIndex);
        if (e.classification.kind === 'nicht' && e.classification.scope === 'complement') {
          expect(e.chunks[negIndex + 1].role, e.negative).toBe('c');
        } else {
          expect(e.chunks.slice(negIndex + 1).every((c) => c.slot === 'E'), e.negative).toBe(true);
        }
      }
      for (const e of kein) {
        const c = e.classification;
        expect(c.kind).toBe('kein');
        if (c.kind !== 'kein') continue;
        const g = c.plural ? 'pl' : c.noun.g;
        const expected = endings[g][['nom', 'akk', 'dat'].indexOf(c.case)];
        expect(e.negative.match(/\bkein(?:e|en|em|er|es)?\b/g), e.negative).toEqual([expected]);
        expect(e.negative).not.toMatch(/\bnicht\b/);
      }
      const exs = NEGATION_PLANS.negation(context(theme, seed, level));
      expect(new Set(exs.map((e) => e.type))).toEqual(new Set(['choice', 'fill', 'sort', 'order', 'write']));
      for (const e of exs) for (const text of completed(e)) {
        expect(text).not.toMatch(/\bnicht ein(?:e|en|em|er|es)? [A-ZÄÖÜ]/);
        expect(text).not.toMatch(/\bes gibt\b/i);
        // A question and its answer are separate clauses, each with its own negation.
        for (const clause of text.split(/[.!?]/)) {
          expect((clause.match(/\b(?:nicht|kein(?:e|en|em|er|es)?)\b/g) ?? []).length, text).toBeLessThanOrEqual(1);
        }
      }
      const correction = exs.find((e) => e.title === 'nicht / kein … sondern');
      expect(correction?.type).toBe('choice');
      if (correction?.type === 'choice') for (const i of correction.items) expect(i.options[i.answer]).toBe('sondern');
    }
  });
  it('uses varied subjects, thematic verbs, and Perfekt / modal brackets', () => {
    for (const theme of THEMES) {
      const subjects = new Set<string>();
      for (let seed = 1; seed <= 5; seed++) {
        const { nicht, kein } = negationExamples(context(theme, seed, 'A1'));
        expect(nicht.some((e) => theme.acts.some((a) => a.v === e.source.v && a.c === e.source.c))).toBe(true);
        expect(nicht.some((e) => e.spec.tense === 'perf')).toBe(true);
        expect(nicht.some((e) => e.spec.modal)).toBe(true);
        for (const e of [...nicht, ...kein]) subjects.add(e.spec.subj.de);
        const eligibleA1 = new Set(theme.acts.filter((a) => getVerb(a.v).level === 'A1' && classifyAct({ ...a, verb: getVerb(a.v) })?.kind === 'nicht').map((a) => a.v));
        if (eligibleA1.size >= 6) for (const e of nicht) expect(e.spec.verb.level).toBe('A1');
      }
      expect(subjects.size).toBeGreaterThan(3);
    }
  });
  it('prints three items per exercise for three themes', () => {
    if (!process.env.SAMPLES) return;
    for (const id of ['food', 'family', 'travel']) {
      const theme = THEMES.find((t) => t.id === id)!;
      console.log(`\n=== ${id} ===`);
      for (const e of NEGATION_PLANS.negation(context(theme, 42, 'A1'))) {
        console.log(`${e.type}: ${e.title}\n${completed(e).slice(0, 3).join('\n')}`);
      }
    }
  });
});
