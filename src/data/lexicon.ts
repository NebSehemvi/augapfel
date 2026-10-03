import type { Level } from '../grammar/types';
import { nounLemma } from '../grammar/articles';
import type { VocabWord } from '../exercises/vocab';
import { THEMES } from './themes';
import { A2_NOUNS, GENERAL_NOUNS } from './nouns';
import { PRONOUNS_LIST, PRONOUN_GROUP_LABEL } from './pronouns';
import { VERBS, verbKey } from './verbs';
import { ALL_PREPS, PREP_VERBS } from './prepVerbs';
import { GOV_LABEL, VERB_GOV, type GovCode } from './verbGov';
import { needsE, pres3, weakStem } from '../grammar/conjugate';
import type { Verb } from '../grammar/types';

/** One word of the lexicon: A1/A2 nouns by theme, pronouns and verbs by kind, or a word the learner saved ("mine"). */
export interface LexEntry extends VocabWord {
  /** the lemma for nouns, verbs and saved words ("der Sohn", "anrufen", "warten auf"), "pron:<id>" for pronouns */
  id: string;
  kind: 'noun' | 'pron' | 'verb' | 'mine';
  /** verbs: the case the verb takes */
  govCode?: GovCode;
  /** verbs: "fährt · ist gefahren" */
  forms?: string;
  /** verbs whose Perfekt isn't obvious: four "aux + participle" options, the first one is right */
  perfekt?: string[];
  /** verbs with a fixed preposition: the verb, its preposition and the wrong prepositions to offer */
  prep?: { verb: string; prep: string; wrong: string[] };
  /** unknown for saved words that aren't in the lexicon */
  level?: Level;
  /** theme id or "general" for nouns, pronoun group for pronouns, "mine" for saved words */
  group: string;
}

export const GENERAL_GROUP = { id: 'general', label: '📌 Общие слова' };
export const MINE_GROUP = { id: 'mine', label: '⭐ Мои слова' };

function buildNouns(): LexEntry[] {
  const seen = new Set<string>();
  const out: LexEntry[] = [];
  const add = (group: string, list: typeof GENERAL_NOUNS) => {
    for (const n of list) {
      if (seen.has(n.de)) continue;
      seen.add(n.de);
      const lemma = nounLemma(n);
      out.push({ id: lemma, kind: 'noun', lemma, pos: 'noun', ru: n.ru, en: n.en, pl: n.g === 'pl' ? undefined : n.pl, level: A2_NOUNS.has(n.de) ? 'A2' : 'A1', group });
    }
  };
  for (const t of THEMES) add(t.id, t.nouns);
  add(GENERAL_GROUP.id, GENERAL_NOUNS);
  return out;
}

export const LEX_NOUNS: LexEntry[] = buildNouns();

export const LEX_PRONOUNS: LexEntry[] = PRONOUNS_LIST.map((p) => ({
  id: `pron:${p.id}`,
  kind: 'pron',
  lemma: p.de,
  pos: 'pron',
  ru: p.ru,
  en: p.en,
  level: p.level,
  group: p.group,
}));

export const VERB_GROUP_LABEL = {
  strong: '💪 Сильные и неправильные',
  weak: '🔧 Правильные',
  sep: '✂️ С отделяемой приставкой',
  refl: '🪞 Возвратные',
  modal: '🧩 Модальные и вспомогательные',
  prep: '🔗 С предлогом',
} as const;
type VerbGroup = keyof typeof VERB_GROUP_LABEL;

function verbGroup(v: Verb): VerbGroup {
  if (v.kind === 'modal' || v.kind === 'aux') return 'modal';
  if (v.refl) return 'refl';
  if (v.sep) return 'sep';
  return v.kind === 'weak' ? 'weak' : 'strong';
}

/** "ist gefahren", "hat sich angezogen" */
const perfektOf = (v: Verb, aux = v.aux[0], pp = v.pp[0]) => `${aux === 'sein' ? 'ist' : 'hat'}${v.refl ? ' sich' : ''} ${pp}`;

export const verbForms = (v: Verb) => `${pres3(v)} · ${perfektOf(v)}`;

/** A plausible wrong Partizip II: "gefahrt" for gefahren, "gereisen" for gereist, "gebesucht" for besucht. */
function wrongParticiple(v: Verb): string {
  const pp = v.pp[0];
  const sep = v.sep ?? '';
  if (pp.endsWith('en')) {
    // the weak ending on the real participle's shape: ge- only where the real one has it (gegangen → gegeht, bekommen → bekommt)
    // inseparable prefixes take no ge- (bekommen, gefallen); in gehen/geben "ge" is part of the stem
    const inseparable = /^(be|emp|ent|er|ge(?![hb])|miss|ver|zer)/.test(v.base);
    const hasGe = pp.slice(sep.length).startsWith('ge') && !inseparable;
    const stem = weakStem(v.base);
    return sep + (hasGe ? 'ge' : '') + stem + (needsE(stem) ? 'et' : 't');
  }
  if (!pp.includes('ge')) return 'ge' + pp;
  return pp.replace(/e?t$/, 'en');
}

/**
 * Perfekt options for verbs where it has to be learned: a strong/mixed participle, "sein", or no "ge-".
 * Verbs that take both haben and sein (joggen) and modal verbs are left out.
 */
function perfektOptions(v: Verb): string[] | undefined {
  if (v.kind === 'modal' || v.aux.length > 1) return undefined;
  const tricky = v.kind !== 'weak' || v.aux[0] === 'sein' || !v.pp[0].includes('ge');
  if (!tricky) return undefined;
  const wrongPp = wrongParticiple(v);
  if (wrongPp === v.pp[0]) return undefined;
  const other = v.aux[0] === 'sein' ? 'haben' : 'sein';
  return [perfektOf(v), perfektOf(v, other), perfektOf(v, v.aux[0], wrongPp), perfektOf(v, other, wrongPp)];
}

function buildVerbs(): LexEntry[] {
  const verbs: LexEntry[] = VERBS.filter((v) => v.level !== 'B1' && VERB_GOV.has(verbKey(v))).map((v) => {
    const code = VERB_GOV.get(verbKey(v))!;
    return {
      id: verbKey(v),
      kind: 'verb',
      lemma: verbKey(v),
      pos: 'verb',
      ru: v.ru,
      en: v.en,
      gov: GOV_LABEL[code] || undefined,
      govCode: code,
      forms: verbForms(v),
      perfekt: perfektOptions(v),
      level: v.level as Level,
      group: verbGroup(v),
    };
  });
  const preps: LexEntry[] = PREP_VERBS.filter((p) => p.level !== 'B1').map((p) => {
    const code: GovCode = p.case === 'akk' ? 'A' : 'D';
    const verb = p.display ?? p.verb;
    const lemma = `${verb} ${p.prep}`;
    // never offer a preposition the verb also takes (sich freuen auf / über)
    const taken = PREP_VERBS.filter((x) => x.verb === p.verb).map((x) => x.prep);
    const wrong = ALL_PREPS.filter((x) => !taken.includes(x));
    return { id: lemma, kind: 'verb', lemma, pos: 'verb', ru: p.ru, en: p.en, gov: GOV_LABEL[code], govCode: code, prep: { verb, prep: p.prep, wrong }, level: p.level as Level, group: 'prep' };
  });
  return [...verbs, ...preps];
}

/** A1/A2 verbs with their case, and verbs with a fixed preposition ("warten auf + Akk."). */
export const LEX_VERBS: LexEntry[] = buildVerbs();

const BY_ID = new Map([...LEX_NOUNS, ...LEX_PRONOUNS, ...LEX_VERBS].map((e) => [e.id, e]));

/** A lexicon word, or a saved word (saved words are keyed by lemma, like lexicon nouns). */
export function getLexEntry(id: string, saved?: Record<string, VocabWord>): LexEntry | undefined {
  return BY_ID.get(id) ?? (saved?.[id] ? savedEntry(saved[id]) : undefined);
}

/** A saved word as a lexicon entry: the lexicon noun itself when it is one, otherwise a "mine" entry. */
export function savedEntry(w: VocabWord): LexEntry {
  return BY_ID.get(w.lemma) ?? { id: w.lemma, kind: 'mine', lemma: w.lemma, pos: w.pos, ru: w.ru, en: w.en, pl: w.pl, group: MINE_GROUP.id };
}

export const inLexicon = (id: string) => BY_ID.has(id);

/** Group headings for the lexicon list. */
export function groupLabel(kind: LexEntry['kind'], group: string): string {
  if (kind === 'mine' || group === MINE_GROUP.id) return MINE_GROUP.label;
  if (kind === 'verb') return VERB_GROUP_LABEL[group as VerbGroup] ?? group;
  if (kind === 'pron') return PRONOUN_GROUP_LABEL[group as keyof typeof PRONOUN_GROUP_LABEL] ?? group;
  if (group === GENERAL_GROUP.id) return GENERAL_GROUP.label;
  const t = THEMES.find((x) => x.id === group);
  return t ? `${t.emoji} ${t.name.ru}` : group;
}

export const lexKey = (e: LexEntry, dir: 'de-ru' | 'ru-de') => `l|${e.id}|${dir}`;
