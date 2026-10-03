import { VERBS } from '../data/verbs';
import { ALL_NOUNS } from '../data/themes';
import { COMMON } from '../data/common';
import { nounForm, nounLemma } from '../grammar/articles';
import { PLURALS } from '../data/nouns';
import { praeteritum, present } from '../grammar/conjugate';
import type { Person, Verb } from '../grammar/types';

export type Pos = 'noun' | 'verb' | 'adj' | 'adv' | 'prep' | 'pron' | 'art' | 'conj' | 'num' | 'other';

export interface WordInfo {
  /** dictionary form shown and used as the id of a saved word: "der Apfel", "aufstehen", "groß" */
  lemma: string;
  pos: Pos;
  ru?: string;
  en?: string;
  /** plural for nouns */
  pl?: string | null;
  /** e.g. "Präteritum от gehen" */
  note?: string;
  source: 'text' | 'app' | 'common' | 'wiktionary';
}

/** A per-text glossary entry (also produced by Claude for generated texts). */
export interface GlossEntry {
  lemma: string;
  pos?: string;
  ru?: string;
  en?: string;
  /** plural without article; "" = no plural */
  pl?: string;
  note?: string;
}

// ---------------------------------------------------------------------------
// index of app vocabulary (nouns from themes, all verb forms)

let INDEX: Map<string, WordInfo> | null = null;

function verbDisplay(v: Verb) {
  return (v.refl ? 'sich ' : '') + v.inf;
}

function buildIndex(): Map<string, WordInfo> {
  const idx = new Map<string, WordInfo>();
  const put = (key: string, info: WordInfo) => {
    if (!idx.has(key)) idx.set(key, info);
  };

  for (const n of ALL_NOUNS) {
    const lemma = nounLemma(n);
    const base: WordInfo = { lemma, pos: 'noun', ru: n.ru, en: n.en, pl: n.g === 'pl' ? undefined : n.pl, source: 'app' };
    put(n.de, base);
    if (n.weak) put(n.weak, { ...base, note: `${n.de} (Akk./Dat.)` });
    if (n.pl && n.pl !== n.de) {
      put(n.pl, { ...base, note: 'мн. ч.' });
      put(nounForm(n, 'dat', true), { ...base, note: 'мн. ч., Dativ' });
    }
  }

  // Plain verbs first, so "steht" maps to "stehen" rather than "aufstehen".
  const ordered = [...VERBS.filter((v) => !v.sep && !v.refl), ...VERBS.filter((v) => !v.sep && v.refl), ...VERBS.filter((v) => v.sep)];
  for (const v of ordered) {
    const lemma = verbDisplay(v);
    const base: WordInfo = { lemma, pos: 'verb', ru: v.ru, en: v.en, source: 'app' };
    put(v.inf.toLowerCase(), base);
    if (v.sep && !v.sep.endsWith(' ')) put(v.base, { ...base, note: `часть глагола ${v.inf}` });
    for (let p = 0; p < 6; p++) {
      const pres = present(v, p as Person);
      if (v.sep && !v.sep.endsWith(' ')) {
        put(v.sep + pres, { ...base, note: `Präsens: ${v.inf}` });
        put(pres, { ...base, note: `${v.inf} (приставка «${v.sep}» стоит в конце)` });
      } else put(pres, pres === v.inf ? base : { ...base, note: `Präsens: ${v.inf}` });
      for (const f of praeteritum(v, p as Person)) {
        if (v.sep && !v.sep.endsWith(' ')) {
          put(v.sep + f, { ...base, note: `Präteritum: ${v.inf}` });
          put(f, { ...base, note: `Präteritum: ${v.inf} (приставка «${v.sep}» стоит в конце)` });
        } else put(f, { ...base, note: `Präteritum: ${v.inf}` });
      }
    }
    for (const pp of v.pp) put(pp.toLowerCase(), { ...base, note: `Partizip II: ${v.inf}` });
  }
  return idx;
}

function index() {
  if (!INDEX) INDEX = buildIndex();
  return INDEX;
}

// ---------------------------------------------------------------------------
// tokenising & lookup

export interface Token {
  text: string;
  /** set when the token is a word (letters) */
  word?: string;
}

/** Splits a paragraph into word and non-word tokens; hyphenated words stay together. */
export function tokenize(paragraph: string): Token[] {
  const out: Token[] = [];
  const re = /[\p{L}]+(?:-[\p{L}]+)*/gu;
  let last = 0;
  for (const m of paragraph.matchAll(re)) {
    if (m.index! > last) out.push({ text: paragraph.slice(last, m.index) });
    out.push({ text: m[0], word: m[0] });
    last = m.index! + m[0].length;
  }
  if (last < paragraph.length) out.push({ text: paragraph.slice(last) });
  return out;
}

const NOUN_BY_LEMMA = new Map<string, { pl: string | null }>();

/** Known plural of a noun lemma ("der Sohn" → "Söhne"); null = no plural; undefined = unknown. */
export function pluralOf(lemma: string): string | null | undefined {
  if (!NOUN_BY_LEMMA.size) for (const n of ALL_NOUNS) if (n.g !== 'pl') NOUN_BY_LEMMA.set(nounLemma(n), { pl: n.pl });
  if (PLURALS.has(lemma)) return PLURALS.get(lemma);
  return NOUN_BY_LEMMA.get(lemma)?.pl;
}

function fromGloss(g: GlossEntry): WordInfo {
  const pos = (g.pos as Pos) ?? 'other';
  const pl = g.pl !== undefined ? g.pl || null : pos === 'noun' ? pluralOf(g.lemma) : undefined;
  return { lemma: g.lemma, pos, ru: g.ru, en: g.en, pl, note: g.note, source: 'text' };
}

/** Offline lookup: text glossary → app vocabulary → common words. */
export function lookupLocal(word: string, glossary?: Record<string, GlossEntry>): WordInfo | null {
  if (glossary) {
    const g = glossary[word] ?? glossary[word.toLowerCase()];
    if (g) return fromGloss(g);
  }
  const idx = index();
  const common = (): WordInfo | null => {
    const c = COMMON.get(word.toLowerCase());
    return c ? { lemma: c.lemma, pos: c.pos as Pos, ru: c.ru, en: c.en, pl: c.pos === 'noun' ? pluralOf(c.lemma) : undefined, source: 'common' } : null;
  };
  const exact = idx.get(word);
  if (exact) return exact;
  const capitalized = word[0] !== word[0].toLowerCase();
  // "Schienen", "Waren", "Stimme": a capitalised word is more likely a noun than a verb form
  const c = common();
  if (capitalized && c?.pos === 'noun') return c;
  const lower = idx.get(word.toLowerCase());
  if (lower) return lower;
  if (c) return c;
  if (!capitalized) return idx.get(word[0].toUpperCase() + word.slice(1)) ?? null;
  return null;
}

// ---------------------------------------------------------------------------
// Wiktionary fallback (English definitions, handles inflected forms)

const cache = new Map<string, WordInfo | null>();

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim();
}

const POS_MAP: Record<string, Pos> = { Noun: 'noun', Verb: 'verb', Adjective: 'adj', Adverb: 'adv', Preposition: 'prep', Pronoun: 'pron', Conjunction: 'conj', Article: 'art', Numeral: 'num' };

export async function lookupWiktionary(word: string, follow = true): Promise<WordInfo | null> {
  if (cache.has(word)) return cache.get(word)!;
  const variants = [...new Set([word, word.toLowerCase(), word[0].toUpperCase() + word.slice(1).toLowerCase()])];
  for (const w of variants) {
    try {
      const res = await fetch(`https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(w)}`);
      if (!res.ok) continue;
      const data = (await res.json()) as Record<string, { partOfSpeech: string; language: string; definitions: { definition: string }[] }[]>;
      const de = (data.de ?? []).filter((e) => e.language === 'German');
      if (!de.length) continue;
      const first = de[0];
      const defs = first.definitions.map((d) => stripHtml(d.definition)).filter(Boolean);
      if (!defs.length) continue;
      const formOf = defs[0].match(/of ([\p{L}-]+)\s*$/u);
      // "plural of Schmetterling" → look up the base word once to get its actual meaning
      const base = formOf && follow ? (lookupLocal(formOf[1]) ?? (await lookupWiktionary(formOf[1], false))) : null;
      const info: WordInfo = base
        ? { ...base, note: defs[0] }
        : {
            lemma: formOf ? formOf[1] : w,
            pos: POS_MAP[first.partOfSpeech] ?? 'other',
            en: defs.slice(0, 2).join('; '),
            note: formOf ? defs[0] : undefined,
            source: 'wiktionary',
          };
      cache.set(word, info);
      return info;
    } catch {
      // offline or blocked — fall through
    }
  }
  cache.set(word, null);
  return null;
}

export const POS_LABEL: Record<Pos, string> = {
  noun: 'существительное',
  verb: 'глагол',
  adj: 'прилагательное',
  adv: 'наречие',
  prep: 'предлог',
  pron: 'местоимение',
  art: 'артикль',
  conj: 'союз',
  num: 'числительное',
  other: '',
};

/** Content words worth learning (for "words from this text" practice). */
export function isContentWord(info: WordInfo): boolean {
  return (info.pos === 'noun' || info.pos === 'verb' || info.pos === 'adj') && !!(info.ru || info.en);
}
