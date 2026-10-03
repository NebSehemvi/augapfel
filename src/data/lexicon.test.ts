import { describe, expect, it } from 'vitest';
import { LEX_NOUNS, LEX_PRONOUNS, LEX_VERBS } from './lexicon';
import { VERBS, verbKey } from './verbs';
import { VERB_GOV } from './verbGov';
import { articleQuestions, aspectQuestion, cardQuestion, dictationQuestion, hasCase, isLearned, listenQuestion, verbAspects, learnSteps, learnWords, LEARN_MINE, LEARN_SIZE, reviewQuestions, reviewUpdate, scopeEntries, sessionEntries, speedQuestions, SPEED_SIZE, typeQuestion } from '../exercises/lexiconGame';
import type { SavedWord } from '../lib/progress';
import { genderOf } from '../grammar/articles';
import { germanForm } from '../exercises/vocab';
import { validGap } from '../exercises/gaps';
import { BUILTIN_TEXTS } from './texts';
import { lookupLocal, tokenize } from '../lib/dictionary';
import { getProgress } from '../lib/progress';
import { seeded } from '../lib/rng';

describe('lexicon', () => {
  it('has A1 and A2 nouns with translations and plural info', () => {
    expect(LEX_NOUNS.length).toBeGreaterThan(300);
    expect(LEX_NOUNS.filter((e) => e.level === 'A2').length).toBeGreaterThan(50);
    for (const e of LEX_NOUNS) {
      expect(e.ru, e.id).toBeTruthy();
      expect(e.lemma, e.id).toMatch(/^(der|die|das) /);
    }
    expect(germanForm(LEX_NOUNS.find((e) => e.lemma === 'der Sohn')!)).toBe('der Sohn / die Söhne');
    expect(germanForm(LEX_NOUNS.find((e) => e.lemma === 'die Milch')!)).toBe('die Milch');
    expect(germanForm(LEX_NOUNS.find((e) => e.lemma.startsWith('die Eltern'))!)).toBe('die Eltern (мн.)');
  });

  for (const kind of ['noun', 'pron', 'verb'] as const)
    for (const direction of ['ru-de', 'de-ru'] as const)
      it(`${kind} cards ${direction}: 4 different options, exactly one fits`, () => {
        const entries = kind === 'noun' ? LEX_NOUNS : kind === 'verb' ? LEX_VERBS : LEX_PRONOUNS;
        for (let seed = 1; seed <= 3; seed++)
          for (const e of entries) {
            const item = cardQuestion(e, direction, seeded(seed));
            expect(new Set(item.options).size, item.prompt).toBe(4);
            expect(item.answer).toBeGreaterThanOrEqual(0);
            // no wrong option may also be a correct answer for the prompt (e.g. "uns" = нас and нам)
            const matching = item.options.filter((o) =>
              entries.some((x) => (direction === 'ru-de' ? (x.ru ?? '') === item.prompt && germanForm(x) === o : germanForm(x) === item.prompt && (x.ru ?? '').split(';')[0].trim() === o)),
            );
            expect(matching.length, `${item.prompt}: ${item.options.join(' | ')}`).toBe(1);
          }
      });
});

describe('verbs', () => {
  it('every A1/A2 verb has its case, and every case entry is a real verb', () => {
    const keys = new Set(VERBS.map(verbKey));
    expect([...VERB_GOV.keys()].filter((k) => !keys.has(k))).toEqual([]);
    expect(VERBS.filter((v) => v.level !== 'B1' && !VERB_GOV.has(verbKey(v))).map(verbKey)).toEqual([]);
  });

  it('shows verbs with their case and asks for it', () => {
    const byId = (id: string) => LEX_VERBS.find((e) => e.id === id)!;
    expect(germanForm(byId('helfen'))).toBe('helfen + Dat.');
    expect(germanForm(byId('anrufen'))).toBe('anrufen + Akk.');
    expect(germanForm(byId('geben'))).toBe('geben + Dat. + Akk.');
    expect(germanForm(byId('gehen'))).toBe('gehen');
    expect(germanForm(byId('warten auf'))).toBe('warten auf + Akk.');
    expect(byId('helfen').forms).toBe('hilft · hat geholfen');
    for (const e of LEX_VERBS.filter(hasCase)) {
      const q = aspectQuestion(e, 'case', seeded(1));
      expect(q.options[q.answer], e.id).toBe(`+ ${e.gov}`);
      expect(q.options.length).toBe(e.group === 'prep' ? 2 : 3);
    }
    expect(hasCase(byId('gehen'))).toBe(false);
    expect(hasCase(byId('können'))).toBe(false);
  });

  it('asks the Perfekt of verbs where it has to be learned, with exactly one right option', () => {
    const byId = (id: string) => LEX_VERBS.find((e) => e.id === id)!;
    expect(byId('fahren').perfekt).toEqual(['ist gefahren', 'hat gefahren', 'ist gefahrt', 'hat gefahrt']);
    expect(byId('besuchen').perfekt?.[0]).toBe('hat besucht');
    expect(byId('aufstehen').perfekt?.[0]).toBe('ist aufgestanden');
    expect(byId('machen').perfekt).toBeUndefined(); // hat gemacht — regular
    expect(byId('joggen').perfekt).toBeUndefined(); // haben and sein both fine
    for (const e of LEX_VERBS.filter((x) => x.perfekt)) {
      expect(new Set(e.perfekt).size, e.id).toBe(4);
      const q = aspectQuestion(e, 'perfekt', seeded(2));
      expect(q.options[q.answer], e.id).toBe(e.perfekt![0]);
    }
  });

  it('asks the preposition without offering another one the verb also takes', () => {
    const freuen = LEX_VERBS.find((e) => e.id === 'sich freuen auf')!;
    expect(verbAspects(freuen)).toEqual(['case', 'prep']);
    for (let seed = 1; seed <= 20; seed++) {
      const q = aspectQuestion(freuen, 'prep', seeded(seed));
      expect(q.prompt).toBe('sich freuen ___');
      expect(q.options[q.answer]).toBe('auf');
      expect(q.options).not.toContain('über');
      expect(new Set(q.options).size).toBe(3);
    }
  });
});

describe('plurals in texts', () => {
  it('every noun with an article in the built-in texts has known plural information', () => {
    const missing = new Set<string>();
    for (const t of BUILTIN_TEXTS)
      for (const p of t.paragraphs)
        for (const tok of tokenize(p)) {
          const info = tok.word && lookupLocal(tok.word, t.glossary);
          if (info && info.pos === 'noun' && /^(der|die|das) /.test(info.lemma) && !info.lemma.endsWith('(мн.)') && info.pl === undefined) missing.add(info.lemma);
        }
    expect([...missing].join(", ")).toBe("");
  });
});

describe('generated gap sentences', () => {
  it('rejects gaps whose answer already appears in the sentence', () => {
    expect(validGap('Der ___ im Ofen ist heiß.', 'Ofen')).toBe(false);
    expect(validGap('Der ___ ist heiß.', 'Ofen')).toBe(true);
    expect(validGap('Ich ___ heute.', '')).toBe(false);
    expect(validGap('Zwei ___ Lücken ___.', 'x')).toBe(false);
    expect(validGap('Wir ___ in die Stadt.', 'fahren')).toBe(true);
  });
});

describe('lexicon modes', () => {
  const scope = { kind: 'noun' as const, group: 'all', levels: ['A1' as const, 'A2' as const] };
  const empty = () => ({ ...getProgress(), srs: {}, words: {} });
  const entries = scopeEntries(scope, empty());

  it('learn: each new word is presented before it is tested, then tested three times in both directions', () => {
    const steps = learnSteps(entries, empty(), seeded(4));
    const presented = steps.filter((x) => x.kind === 'present').map((x) => x.entry);
    expect(presented.length).toBe(LEARN_SIZE);
    expect(presented.every((e) => e.level === 'A1')).toBe(true);
    for (const w of presented) {
      const first = steps.findIndex((x) => x.entry === w);
      expect(steps[first].kind).toBe('present');
      const tests = steps.filter((x) => x.kind === 'cards' && x.entry === w);
      expect(tests.length).toBe(3);
      expect(new Set(tests.map((x) => (x.kind === 'cards' ? x.dir : '')))).toEqual(new Set(['de-ru', 'ru-de']));
    }
    for (let k = 1; k < steps.length; k++) if (steps[k].kind !== 'present') expect(steps[k].entry === steps[k - 1].entry && steps[k - 1].kind !== 'present').toBe(false);
  });

  it('learn skips words that were already learned', () => {
    const p = empty();
    p.srs[`l|${entries[0].id}|de-ru`] = { box: 1, due: 0, seen: 1, wrong: 0 };
    expect(isLearned(entries[0], p)).toBe(true);
    expect(learnSteps(entries, p, seeded(1)).some((x) => x.entry === entries[0])).toBe(false);
  });

  it('reviews only use learned words, due ones first; speed review is cards only', () => {
    const p = empty();
    const now = Date.now();
    entries.slice(0, 20).forEach((e, k) => (p.srs[`l|${e.id}|ru-de`] = { box: 2, due: k < 3 ? now - 1 : now + 1e9, seen: 1, wrong: 0 }));
    const qs = reviewQuestions(entries, p, seeded(2), now);
    expect(qs.length).toBe(10);
    expect(qs.slice(0, 3).map((q) => q.entry.id).sort()).toEqual(entries.slice(0, 3).map((e) => e.id).sort());
    expect(qs.every((q) => entries.slice(0, 20).includes(q.entry))).toBe(true);
    const speed = speedQuestions(entries, p, seeded(3), now);
    expect(speed.length).toBe(SPEED_SIZE);
    expect(speed.every((q) => q.kind === 'cards')).toBe(true);
    expect(speedQuestions(entries, empty(), seeded(3), now)).toEqual([]);
  });

  it('typing accepts the noun with its article (plural optional)', () => {
    const q = typeQuestion(LEX_NOUNS.find((e) => e.lemma === 'der Sohn')!);
    expect(q.accepted).toEqual(['der Sohn', 'der Sohn / die Söhne']);
  });

  it('a right answer to a word that is not due yet does not move it up', () => {
    const p = empty();
    p.srs.k = { box: 2, due: Date.now() + 1e6, seen: 1, wrong: 0 };
    expect(reviewUpdate('k', true, p)).toEqual([]);
    expect(reviewUpdate('k', false, p)).toEqual([{ key: 'k', ok: false }]);
  });

  const saved = (lemma: string, pos: string, ru: string, addedAt: number): SavedWord => ({ lemma, pos, ru, en: '', addedAt });
  const withWords = () => {
    const p = empty();
    p.words = {
      googeln: saved('googeln', 'verb', 'гуглить', 1),
      schnell: saved('schnell', 'adj', 'быстро', 2),
      'sich freuen': saved('sich freuen', 'verb', 'радоваться', 3),
      'der Sohn': saved('der Sohn', 'noun', 'сын', 4),
    };
    return p;
  };

  it('saved words are a scope of their own; a saved lexicon noun is the same entry', () => {
    const p = withWords();
    const mine = scopeEntries({ kind: 'mine', group: 'all', levels: ['A1'] }, p);
    expect(mine.map((e) => e.id)).toEqual(['googeln', 'schnell', 'sich freuen', 'der Sohn']);
    expect(mine.find((e) => e.id === 'der Sohn')).toBe(LEX_NOUNS.find((e) => e.id === 'der Sohn'));
    expect(mine[0].kind).toBe('mine');
    expect(mine[2].kind).toBe('verb');
    for (const e of mine)
      for (const dir of ['de-ru', 'ru-de'] as const) {
        const q = cardQuestion(e, dir, seeded(1));
        expect(new Set(q.options).size, e.id).toBe(4);
      }
    expect(typeQuestion(mine[2]).accepted).toContain('freuen');
  });

  it(`learning in another scope mixes in at most ${LEARN_MINE} new saved words`, () => {
    const p = withWords();
    const pron = { kind: 'pron' as const, group: 'all', levels: ['A1' as const, 'A2' as const] };
    for (let seed = 1; seed <= 5; seed++) {
      const words = learnWords(sessionEntries(pron, p), p, seeded(seed));
      expect(words.length).toBe(LEARN_SIZE);
      expect(words.filter((e) => p.words[e.lemma]).length).toBe(LEARN_MINE);
      expect(words.filter((e) => p.words[e.lemma]).map((e) => e.id)).toEqual(expect.arrayContaining(['googeln', 'schnell']));
    }
    // learned saved words come back in other scopes only when due
    const now = Date.now();
    p.srs['l|googeln|de-ru'] = { box: 1, due: now + 1e6, seen: 1, wrong: 0 };
    p.srs['l|schnell|de-ru'] = { box: 1, due: now - 1, seen: 1, wrong: 0 };
    const ids = sessionEntries(pron, p, now).map((e) => e.id);
    expect(ids).not.toContain('googeln');
    expect(ids).toContain('schnell');
  });
});

describe('genders and listening', () => {
  it('reads the gender of a noun as shown in the app', () => {
    expect(genderOf('der Sohn / die Söhne')).toBe('der');
    expect(genderOf('die Milch')).toBe('die');
    expect(genderOf('das Kind / die Kinder')).toBe('das');
    expect(genderOf('die Eltern (мн.)')).toBe('pl');
    expect(genderOf('die')).toBeNull(); // a pronoun, not a noun
    expect(genderOf('helfen + Dat.')).toBeNull();
  });

  it('articles round: der/die/das in a fixed order, the noun without its article, no plural-only nouns', () => {
    const qs = articleQuestions(LEX_NOUNS, seeded(3));
    expect(qs.length).toBe(30);
    for (const q of qs) {
      expect(q.options).toEqual(['der', 'die', 'das']);
      expect(q.entry.lemma).toBe(`${q.options[q.answer]} ${q.prompt}`);
    }
    expect(articleQuestions(LEX_NOUNS.filter((e) => e.lemma.endsWith('(мн.)')), seeded(1))).toEqual([]);
  });

  it('listening reads the singular with its article and hides nothing it then accepts', () => {
    const sohn = LEX_NOUNS.find((e) => e.id === 'der Sohn')!;
    const l = listenQuestion(sohn, seeded(1));
    expect(l.spoken).toBe('der Sohn');
    expect(l.options[l.answer]).toBe('сын');
    const d = dictationQuestion(LEX_NOUNS.find((e) => e.lemma.startsWith('die Eltern'))!);
    expect(d.spoken).toBe('die Eltern');
    expect(d.accepted).toContain('die Eltern');
    expect(dictationQuestion(LEX_VERBS.find((e) => e.id === 'helfen')!).spoken).toBe('helfen');
  });

  it('classic review uses listening only when a voice is available', () => {
    const p = { ...getProgress(), words: {}, srs: {} as Record<string, { box: number; due: number; seen: number; wrong: number }> };
    LEX_NOUNS.slice(0, 10).forEach((e) => (p.srs[`l|${e.id}|de-ru`] = { box: 1, due: 0, seen: 1, wrong: 0 }));
    const kinds = (audio: boolean) =>
      Array.from({ length: 20 }, (_, s) => reviewQuestions(LEX_NOUNS, p, seeded(s + 1), Date.now(), audio)).flat().filter((q) => q.listen).length;
    expect(kinds(false)).toBe(0);
    expect(kinds(true)).toBeGreaterThan(0);
  });
});

