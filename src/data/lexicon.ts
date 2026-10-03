import type { Level } from '../grammar/types';
import { nounLemma } from '../grammar/articles';
import type { VocabWord } from '../exercises/vocab';
import { THEMES } from './themes';
import { A2_NOUNS, GENERAL_NOUNS } from './nouns';
import { PRONOUNS_LIST, PRONOUN_GROUP_LABEL } from './pronouns';

/** One word of the lexicon: A1/A2 nouns by theme, pronouns by kind, or a word the learner saved ("mine"). */
export interface LexEntry extends VocabWord {
  /** the lemma for nouns and saved words, "pron:<id>" for pronouns */
  id: string;
  kind: 'noun' | 'pron' | 'mine';
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

const BY_ID = new Map([...LEX_NOUNS, ...LEX_PRONOUNS].map((e) => [e.id, e]));

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
  if (kind === 'pron') return PRONOUN_GROUP_LABEL[group as keyof typeof PRONOUN_GROUP_LABEL] ?? group;
  if (group === GENERAL_GROUP.id) return GENERAL_GROUP.label;
  const t = THEMES.find((x) => x.id === group);
  return t ? `${t.emoji} ${t.name.ru}` : group;
}

export const lexKey = (e: LexEntry, dir: 'de-ru' | 'ru-de') => `l|${e.id}|${dir}`;
