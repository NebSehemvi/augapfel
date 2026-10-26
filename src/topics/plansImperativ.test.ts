import { describe, expect, it } from 'vitest';
import { IMPERATIV_PLANS, wrongImperatives } from './plansImperativ';
import { VERBS, getVerb } from '../data/verbs';
import { THEMES } from '../data/themes';
import { seeded } from '../lib/rng';
import { IMP_FORMS, hasImperative, imperative, impFinite } from '../grammar/imperative';
import { pickActs } from '../exercises/context';
import type { Ctx } from '../exercises/context';

const du = (k: string) => imperative(getVerb(k), 'du');
const ihr = (k: string) => imperative(getVerb(k), 'ihr');
const sie = (k: string) => imperative(getVerb(k), 'Sie');

describe('Imperativ forms', () => {
  it('du: no pronoun, no -st', () => {
    const want: Record<string, string> = {
      kommen: 'Komm!', machen: 'Mach!', spielen: 'Spiel!', gehen: 'Geh!', stehen: 'Steh!', bleiben: 'Bleib!', schreiben: 'Schreib!',
      trinken: 'Trink!', singen: 'Sing!', zeigen: 'Zeig!', steigen: 'Steig!', tanzen: 'Tanz!', putzen: 'Putz!', schließen: 'Schließ!',
      studieren: 'Studier!', telefonieren: 'Telefonier!', bestellen: 'Bestell!', erklären: 'Erklär!', üben: 'Übe!', reisen: 'Reise!',
    };
    for (const [k, w] of Object.entries(want)) expect(du(k), k).toBe(w);
  });

  it('du: e → i / ie is kept', () => {
    const want: Record<string, string> = {
      nehmen: 'Nimm!', lesen: 'Lies!', geben: 'Gib!', essen: 'Iss!', sehen: 'Sieh!', sprechen: 'Sprich!', helfen: 'Hilf!', treffen: 'Triff!',
      vergessen: 'Vergiss!', empfehlen: 'Empfiehl!', mitnehmen: 'Nimm mit!', vorlesen: 'Lies vor!', fernsehen: 'Sieh fern!', teilnehmen: 'Nimm teil!',
    };
    for (const [k, w] of Object.entries(want)) expect(du(k), k).toBe(w);
  });

  it('du: a → ä loses the umlaut', () => {
    const want: Record<string, string> = {
      fahren: 'Fahr!', schlafen: 'Schlaf!', laufen: 'Lauf!', tragen: 'Trag!', waschen: 'Wasch!', lassen: 'Lass!', anfangen: 'Fang an!',
      abfahren: 'Fahr ab!', einschlafen: 'Schlaf ein!', halten: 'Halte!', einladen: 'Lade ein!',
    };
    for (const [k, w] of Object.entries(want)) expect(du(k), k).toBe(w);
  });

  it('du: -e after -t / -d / -chn / -ffn …', () => {
    const want: Record<string, string> = {
      warten: 'Warte!', arbeiten: 'Arbeite!', finden: 'Finde!', öffnen: 'Öffne!', antworten: 'Antworte!', atmen: 'Atme!', mieten: 'Miete!',
      übernachten: 'Übernachte!', heiraten: 'Heirate!', reden: 'Rede!', entschuldigen: 'Entschuldige dich!', sammeln: 'Sammle!', wandern: 'Wandere!',
      bügeln: 'Bügle!', erinnern: 'Erinnere dich!', vorbereiten: 'Bereite vor!', anmelden: 'Melde dich an!', senden: 'Sende!',
    };
    for (const [k, w] of Object.entries(want)) {
      const v = VERBS.find((x) => x.inf === k && !x.refl) ?? VERBS.find((x) => x.inf === k)!;
      expect(imperative(v, 'du'), k).toBe(w);
    }
  });

  it('sein, haben, werden', () => {
    expect([du('sein'), ihr('sein'), sie('sein')]).toEqual(['Sei!', 'Seid!', 'Seien Sie!']);
    expect([du('haben'), ihr('haben'), sie('haben')]).toEqual(['Hab!', 'Habt!', 'Haben Sie!']);
    expect([du('werden'), ihr('werden'), sie('werden')]).toEqual(['Werde!', 'Werdet!', 'Werden Sie!']);
  });

  it('ihr and Sie', () => {
    expect([ihr('kommen'), sie('kommen')]).toEqual(['Kommt!', 'Kommen Sie!']);
    expect([ihr('nehmen'), sie('nehmen')]).toEqual(['Nehmt!', 'Nehmen Sie!']);
    expect([ihr('essen'), ihr('fahren'), ihr('warten'), ihr('öffnen')]).toEqual(['Esst!', 'Fahrt!', 'Wartet!', 'Öffnet!']);
  });

  it('separable prefix goes to the end, reflexive pronoun after the verb', () => {
    expect([du('aufstehen'), ihr('aufstehen'), sie('aufstehen')]).toEqual(['Steh auf!', 'Steht auf!', 'Stehen Sie auf!']);
    expect(imperative(getVerb('anrufen'), 'du', { c: 'mich' })).toBe('Ruf mich an!');
    expect(imperative(getVerb('spazieren gehen'), 'du')).toBe('Geh spazieren!');
    const refl = getVerb('sich setzen');
    expect([imperative(refl, 'du'), imperative(refl, 'ihr'), imperative(refl, 'Sie')]).toEqual(['Setz dich!', 'Setzt euch!', 'Setzen Sie sich!']);
    expect(imperative(getVerb('sich anziehen'), 'Sie')).toBe('Ziehen Sie sich an!');
    expect(imperative(getVerb('sich beeilen'), 'ihr')).toBe('Beeilt euch!');
  });

  it('bitte and doch mal', () => {
    expect(imperative(getVerb('kommen'), 'du', { particle: 'bitte' })).toBe('Komm bitte!');
    expect(imperative(getVerb('mitkommen'), 'du', { particle: 'doch mal' })).toBe('Komm doch mal mit!');
    expect(imperative(getVerb('öffnen'), 'Sie', { c: 'das Fenster', particle: 'bitte' })).toBe('Öffnen Sie bitte das Fenster!');
    expect(imperative(getVerb('sich setzen'), 'du', { particle: 'bitte' })).toBe('Setz dich bitte!');
  });

  it('every usable verb gets a plausible form', () => {
    for (const v of VERBS.filter(hasImperative)) {
      for (const f of IMP_FORMS) {
        const s = imperative(v, f);
        expect(s, v.inf).toMatch(/^[A-ZÄÖÜ][a-zäöüß]+( [A-Za-zäöüß]+)*!$/);
        expect(s, v.inf).not.toMatch(/undefined/);
        if (f === 'du') expect(s, v.inf).not.toMatch(/(?<!ei|a)st[! ]/);
      }
      const d = impFinite(v, 'du');
      // never the du-present form, never the infinitive
      expect(d, v.inf).not.toBe(v.presDuEr?.[0]);
      expect(d.endsWith('st') && !/(ei|a)st$/.test(d), v.inf).toBe(false);
      expect(d, v.inf).not.toBe(v.base);
      // a → ä verbs lose the umlaut
      if (v.presDuEr && /ä|äu/.test(v.presDuEr[0]) && !/[äö]/.test(v.base)) expect(d, v.inf).not.toMatch(/[äö]/);
    }
  });

  it('distractors never contain the right answer', () => {
    for (const v of VERBS.filter(hasImperative))
      for (const f of IMP_FORMS) expect(wrongImperatives(v, f).map((x) => x.toLowerCase()), `${v.inf} ${f}`).not.toContain(impFinite(v, f).toLowerCase());
  });
});

describe('Imperativ exercises', () => {
  const ctxFor = (theme: Ctx['theme'], seed: number, level: Ctx['level']): Ctx => ({ theme, rng: seeded(seed), level, includeRare: false });

  it('answers are imperatives (verb first, "!")', () => {
    for (const level of ['A1', 'A2'] as const)
      for (const theme of THEMES)
        for (let seed = 1; seed <= 15; seed++) {
          const ex = IMPERATIV_PLANS.imperativ(ctxFor(theme, seed, level));
          for (const e of ex) {
            if (e.type === 'write') {
              for (const a of e.item.answers) expect(a).toMatch(/^[A-ZÄÖÜ].*!$/);
              expect(e.item.cues[0]).toMatch(/^(Du sollst|Ihr sollt|Sie sollen) .*\.$/);
            }
            if (e.type === 'order') {
              expect(e.item.punct).toBe('!');
              for (const a of e.item.answers) expect(a.length).toBe(e.item.chunks.length);
            }
            if (e.type === 'fill') for (const it of e.items) expect(it.answers[0][0]).toMatch(/^[A-ZÄÖÜ]/);
            if (e.type === 'sort') {
              for (const it of e.items) {
                const f = e.categories[it.cat];
                expect(f === 'Sie' ? / Sie\b/.test(it.text) : !/ Sie\b/.test(it.text), it.text).toBe(true);
                if (f === 'ihr') expect(it.text, it.text).toMatch(/^[A-ZÄÖÜ][a-zäöüß]*t\b/);
              }
            }
          }
        }
  });

  it('A1 sessions draw A1 verbs while the theme has enough', () => {
    for (const theme of THEMES) {
      for (let seed = 1; seed <= 10; seed++) {
        const acts = pickActs(ctxFor(theme, seed, 'A1'), 3);
        const a1InTheme = theme.acts.filter((a) => getVerb(a.v).level === 'A1').length;
        if (a1InTheme >= 3) for (const a of acts) expect(getVerb(a.v).level, `${theme.id} ${a.v}`).toBe('A1');
      }
    }
  });
});

