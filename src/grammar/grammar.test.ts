import { describe, expect, it } from 'vitest';
import { getVerb, VERBS, hasVerb, verbKey } from '../data/verbs';
import { praeteritum, present, presentMain } from './conjugate';
import { clauseText, clauseTexts, mainSub, subFirst } from './clause';
import { PRONOUNS, NAMED } from './subjects';
import { nounPhrase, pluralType } from './articles';
import { THEMES, GENERAL, getNoun, hasNoun } from '../data/themes';
import { PREP_VERBS, findPrepVerb } from '../data/prepVerbs';
import type { Person } from './types';

const ich = PRONOUNS[0];
const du = PRONOUNS[1];
const er = PRONOUNS[2];
const wir = PRONOUNS[4];
const ihr = PRONOUNS[5];
const anna = NAMED[0];

const all = (key: string) => ([0, 1, 2, 3, 4, 5] as Person[]).map((p) => present(getVerb(key), p));
const allPraet = (key: string) => ([0, 1, 2, 3, 4, 5] as Person[]).map((p) => praeteritum(getVerb(key), p)[0]);

describe('present tense', () => {
  it('regular', () => {
    expect(all('machen')).toEqual(['mache', 'machst', 'macht', 'machen', 'macht', 'machen']);
    expect(all('arbeiten')).toEqual(['arbeite', 'arbeitest', 'arbeitet', 'arbeiten', 'arbeitet', 'arbeiten']);
    expect(all('öffnen')).toEqual(['öffne', 'öffnest', 'öffnet', 'öffnen', 'öffnet', 'öffnen']);
    expect(all('tanzen')).toEqual(['tanze', 'tanzt', 'tanzt', 'tanzen', 'tanzt', 'tanzen']);
    expect(all('sammeln')).toEqual(['sammle', 'sammelst', 'sammelt', 'sammeln', 'sammelt', 'sammeln']);
    expect(all('wandern')).toEqual(['wandere', 'wanderst', 'wandert', 'wandern', 'wandert', 'wandern']);
    expect(all('feiern')).toEqual(['feiere', 'feierst', 'feiert', 'feiern', 'feiert', 'feiern']);
    expect(all('lernen')).toEqual(['lerne', 'lernst', 'lernt', 'lernen', 'lernt', 'lernen']);
  });
  it('stem-changing', () => {
    expect(all('fahren')).toEqual(['fahre', 'fährst', 'fährt', 'fahren', 'fahrt', 'fahren']);
    expect(all('essen')).toEqual(['esse', 'isst', 'isst', 'essen', 'esst', 'essen']);
    expect(all('halten')).toEqual(['halte', 'hältst', 'hält', 'halten', 'haltet', 'halten']);
    expect(all('nehmen')).toEqual(['nehme', 'nimmst', 'nimmt', 'nehmen', 'nehmt', 'nehmen']);
    expect(all('heißen')).toEqual(['heiße', 'heißt', 'heißt', 'heißen', 'heißt', 'heißen']);
    expect(all('finden')).toEqual(['finde', 'findest', 'findet', 'finden', 'findet', 'finden']);
    expect(all('sein')).toEqual(['bin', 'bist', 'ist', 'sind', 'seid', 'sind']);
    expect(presentMain(getVerb('aufstehen'), 1)).toBe('stehst auf');
    expect(presentMain(getVerb('abfahren'), 2)).toBe('fährt ab');
  });
});

describe('präteritum & partizip', () => {
  it('forms', () => {
    expect(allPraet('machen')).toEqual(['machte', 'machtest', 'machte', 'machten', 'machtet', 'machten']);
    expect(allPraet('gehen')).toEqual(['ging', 'gingst', 'ging', 'gingen', 'gingt', 'gingen']);
    expect(allPraet('finden')).toEqual(['fand', 'fandest', 'fand', 'fanden', 'fandet', 'fanden']);
    expect(allPraet('arbeiten')).toEqual(['arbeitete', 'arbeitetest', 'arbeitete', 'arbeiteten', 'arbeitetet', 'arbeiteten']);
    expect(allPraet('sein')).toEqual(['war', 'warst', 'war', 'waren', 'wart', 'waren']);
    expect(allPraet('können')).toEqual(['konnte', 'konntest', 'konnte', 'konnten', 'konntet', 'konnten']);
    expect(allPraet('essen')[1]).toBe('aßest');
    expect(getVerb('arbeiten').pp[0]).toBe('gearbeitet');
    expect(getVerb('einkaufen').pp[0]).toBe('eingekauft');
    expect(getVerb('besuchen').pp[0]).toBe('besucht');
    expect(getVerb('studieren').pp[0]).toBe('studiert');
    expect(getVerb('Staub saugen').pp[0]).toBe('Staub gesaugt');
    expect(getVerb('kennenlernen').pp[0]).toBe('kennengelernt');
    expect(getVerb('gehören').pp[0]).toBe('gehört');
    expect(getVerb('anprobieren').pp[0]).toBe('anprobiert');
    expect(getVerb('übernachten').pp[0]).toBe('übernachtet');
  });
});

describe('clause word order', () => {
  const backen = { subj: ich, verb: getVerb('backen'), c: 'einen Kuchen', time: 'am Abend' };
  it('inversion & Satzklammer', () => {
    expect(clauseText({ ...backen, tense: 'perf' }, 'T')).toBe('Am Abend habe ich einen Kuchen gebacken.');
    expect(clauseText({ ...backen, tense: 'perf' }, 'S')).toBe('Ich habe am Abend einen Kuchen gebacken.');
    expect(clauseText({ ...backen, tense: 'pres' }, 'Y')).toBe('Backe ich am Abend einen Kuchen?');
    expect(clauseText({ ...backen, subj: du, tense: 'pres', lead: 'Wann' }, 'W')).toBe('Wann backst du einen Kuchen?');
    expect(clauseText({ ...backen, tense: 'pres', modal: getVerb('wollen') }, 'T')).toBe('Am Abend will ich einen Kuchen backen.');
  });
  it('separable & reflexive', () => {
    const auf = { subj: anna, verb: getVerb('aufstehen'), c: 'früh', time: 'am Montag' };
    expect(clauseText({ ...auf, tense: 'pres' }, 'S')).toBe('Anna steht am Montag früh auf.');
    expect(clauseText({ ...auf, tense: 'perf' }, 'T')).toBe('Am Montag ist Anna früh aufgestanden.');
    expect(clauseText({ ...auf, tense: 'pres', lead: 'weil' }, 'SUB')).toBe('Weil Anna am Montag früh aufsteht.');
    const freuen = { subj: wir, verb: getVerb('sich freuen'), c: 'auf den Urlaub', time: 'heute' };
    expect(clauseText({ ...freuen, tense: 'pres' }, 'T')).toBe('Heute freuen wir uns auf den Urlaub.');
    expect(clauseText({ ...freuen, tense: 'perf', lead: 'dass' }, 'SUB')).toBe('Dass wir uns heute auf den Urlaub gefreut haben.');
    const spaz = { subj: ihr, verb: getVerb('spazieren gehen'), c: 'im Park', tense: 'pres' as const };
    expect(clauseText(spaz, 'S')).toBe('Ihr geht im Park spazieren.');
    expect(clauseText({ ...spaz, lead: 'weil' }, 'SUB')).toBe('Weil ihr im Park spazieren geht.');
  });
  it('variants are accepted', () => {
    const texts = clauseTexts({ subj: er, verb: getVerb('schwimmen'), c: 'im See', time: 'gestern', tense: 'perf' }, 'S');
    expect(texts).toContain('Er ist gestern im See geschwommen.');
    expect(texts).toContain('Er hat gestern im See geschwommen.');
    expect(texts).toContain('Er ist im See gestern geschwommen.');
  });
  it('compound sentences', () => {
    const main = { subj: ich, verb: getVerb('kochen'), c: 'eine Suppe', tense: 'pres' as const };
    const sub = { subj: ich, verb: getVerb('haben'), c: 'Hunger', tense: 'pres' as const, lead: 'wenn' };
    expect(subFirst(sub, main).texts[0]).toBe('Wenn ich Hunger habe, koche ich eine Suppe.');
    expect(mainSub(main, { ...sub, lead: 'weil' }).texts[0]).toBe('Ich koche eine Suppe, weil ich Hunger habe.');
  });
});

describe('articles & nouns', () => {
  it('declension', () => {
    expect(nounPhrase('indef', getNoun('Apfel'), 'akk')).toBe('einen Apfel');
    expect(nounPhrase('def', getNoun('Kollege'), 'dat')).toBe('dem Kollegen');
    expect(nounPhrase('def', getNoun('Kind'), 'dat', true)).toBe('den Kindern');
    expect(nounPhrase('kein', getNoun('Tasse'), 'akk')).toBe('keine Tasse');
    expect(nounPhrase('mein', getNoun('Bruder'), 'dat')).toBe('meinem Bruder');
  });
  it('plural types', () => {
    expect(pluralType(getNoun('Bruder'))).toBe('-/¨-');
    expect(pluralType(getNoun('Apfel'))).toBe('-/¨-');
    expect(pluralType(getNoun('Stadt'))).toBe('-e/¨-e');
    expect(pluralType(getNoun('Haus'))).toBe('-er/¨-er');
    expect(pluralType(getNoun('Oma'))).toBe('-s');
    expect(pluralType(getNoun('Freundin'))).toBe('-(e)n');
    expect(pluralType(getNoun('Museum'))).toBe(null);
  });
});

describe('data integrity', () => {
  it('verb keys are unique', () => {
    const keys = VERBS.map(verbKey);
    expect(new Set(keys).size).toBe(keys.length);
  });
  const allActs = [...THEMES.flatMap((t) => t.acts.map((a) => ({ ...a, t: t.id }))), ...GENERAL.map((a) => ({ ...a, t: 'general' }))];
  it('activities reference known verbs and prep verbs', () => {
    for (const a of allActs) {
      expect(hasVerb(a.v), `${a.t}: ${a.v}`).toBe(true);
      if (a.prep) {
        const prep = a.c.split(' ')[0];
        expect(findPrepVerb(a.v, prep), `${a.t}: ${a.v} ${prep}`).toBeTruthy();
      }
    }
  });
  it('pairs, frames, spots reference known verbs and nouns', () => {
    for (const t of THEMES) {
      for (const p of [...t.causes, ...t.contras]) {
        expect(hasVerb(p.a[0]), `${t.id}: ${p.a[0]}`).toBe(true);
        expect(hasVerb(p.b[0]), `${t.id}: ${p.b[0]}`).toBe(true);
      }
      for (const f of t.frames) {
        expect(hasVerb(f.v), `${t.id}: ${f.v}`).toBe(true);
        expect(hasNoun(f.n), `${t.id}: ${f.n}`).toBe(true);
      }
      for (const s of t.spots ?? []) expect(hasNoun(s.n), `${t.id}: ${s.n}`).toBe(true);
      for (const s of t.things ?? []) expect(hasNoun(s.n), `${t.id}: ${s.n}`).toBe(true);
    }
  });
  it('prep verbs reference known verbs', () => {
    for (const pv of PREP_VERBS) expect(hasVerb(pv.verb), pv.verb).toBe(true);
  });
  it('every theme has enough material', () => {
    for (const t of THEMES) {
      expect(t.acts.length, t.id).toBeGreaterThanOrEqual(20);
      expect(t.acts.filter((a) => a.prep).length, t.id).toBeGreaterThanOrEqual(4);
      expect(t.causes.length, t.id).toBeGreaterThanOrEqual(4);
      expect(t.contras.length, t.id).toBeGreaterThanOrEqual(3);
      expect(t.frames.length, t.id).toBeGreaterThanOrEqual(9);
      expect(t.nouns.length, t.id).toBeGreaterThanOrEqual(14);
    }
  });
});
