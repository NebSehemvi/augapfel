import { article, nounForm, nounPhrase } from './articles';
import type { Case, Noun } from './types';
import type { Chunk } from './clause';

/** The caller classifies the complement; no guessing from arbitrary German text.
 * clause: after definite objects/time; complement: before a predicate adjective,
 * manner adverb or prepositional phrase. Already negated clauses are rejected.
 */
export function placeNicht(chunks: readonly Chunk[], scope: 'clause' | 'complement' = 'clause'): Chunk[] {
  if (chunks.some((c) => /\b(nicht|kein(?:e|en|em|er|es)?)\b/i.test(c.text))) {
    throw new Error('Clause is already negative');
  }
  const target = scope === 'complement'
    ? chunks.findIndex((c) => c.role === 'c' && c.slot === 'M')
    : chunks.findIndex((c) => c.slot === 'E');
  if (scope === 'complement' && target < 0) throw new Error('Missing middle-field complement');
  const at = target < 0 ? chunks.length : target;
  return [...chunks.slice(0, at), { text: 'nicht', role: 'adv', slot: 'M' }, ...chunks.slice(at)];
}

export type NegationClass =
  | { kind: 'nicht'; scope: 'clause' | 'complement' }
  | { kind: 'kein'; noun: Noun; case: Case; plural: boolean; complement: string };

const PREPOSITION = /^(?:an|am|ans|auf|aus|außer|bei|beim|bis|durch|für|gegen|hinter|im|in|ins|mit|nach|neben|ohne|seit|über|um|unter|von|vom|vor|zu|zum|zur|zwischen) /;
const ADVERB = new Set(['früh', 'spät', 'lange', 'schnell', 'langsam', 'gern', 'gerne', 'gut', 'schlecht', 'müde', 'krank', 'pünktlich', 'leise', 'laut', 'geradeaus', 'viel']);
const DEFINITE = /^(?:der|die|das|den|dem|des|(?:mein|dein|sein|ihr|unser|euer|eur|Ihr|dies|jen)(?:e|en|em|er|es)?) (?:[a-zäöüß]+ )*[A-ZÄÖÜ][\wÄÖÜäöüß-]*$/;

/** Conservative recognition: one noun phrase, a prepositional complement, or a known
 * standalone predicate/adverb. Quantifiers, coordination and mixed objects are skipped.
 * The caller supplies the verb's governed case and the lexicon (no guessed gender).
 */
export function classifyNegation(c: string, nouns: readonly Noun[], nounCase: Case | null): NegationClass | null {
  if (/\b(?:nicht|kein(?:e|en|em|er|es)?|nie|niemals|nichts|niemand(?:en|em)?)\b/i.test(c)) return null;
  if (!c) return { kind: 'nicht', scope: 'clause' };
  if (PREPOSITION.test(c) || ADVERB.has(c)) return { kind: 'nicht', scope: 'complement' };
  if (DEFINITE.test(c) || /^(?:mich|dich|ihn|sie|es|uns|euch|Sie|mir|dir|ihm|ihnen|Ihnen|Anna|Tom|Lena|Max|Paul)$/.test(c)) {
    return { kind: 'nicht', scope: 'clause' };
  }
  if (!nounCase) return null;
  const indefinite = /^(ein(?:e|en|em|er|es)?) (.+)$/.exec(c);
  const text = indefinite ? indefinite[2] : c;
  for (const noun of nouns) {
    // Prefer singular when an indefinite article is present; bare count nouns must be plural.
    for (const plural of indefinite ? [false] : [true, false]) {
      if (plural && !noun.pl && noun.g !== 'pl') continue;
      if (!indefinite && !plural && !noun.mass && noun.pl !== null && noun.g !== 'pl') continue;
      const g = plural ? 'pl' : noun.g;
      if (nounForm(noun, nounCase, plural) !== text) continue;
      if (indefinite && (g === 'pl' || article('indef', g, nounCase) !== indefinite[1])) continue;
      return { kind: 'kein', noun, case: nounCase, plural, complement: nounPhrase('kein', noun, nounCase, plural) };
    }
  }
  return null;
}
