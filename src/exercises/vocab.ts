import { sample, shuffle, type Rng } from '../lib/rng';
import type { CardItem, Exercise, FillItem } from './types';
import { ALL_NOUNS } from '../data/themes';
import { VERBS } from '../data/verbs';
import { nounLemma, withPlural } from '../grammar/articles';
import { POS_LABEL, pluralOf, type Pos } from '../lib/dictionary';

/** Minimal word shape shared by saved words, lexicon entries and dictionary hits. */
export interface VocabWord {
  lemma: string;
  pos: string;
  ru?: string;
  en?: string;
  /** plural of a noun (without article); null = none, undefined = unknown */
  pl?: string | null;
  /** case a verb takes, e.g. "Dat." — shown as "helfen + Dat." */
  gov?: string;
}

export const meaning = (w: VocabWord) => [w.ru, w.en].filter(Boolean).join(' · ');
const first = (x?: string) => (x ?? '').split(';')[0].trim();
/** A meaning as a prompt: long dictionary definitions are cut to their first sense. */
export const promptMeaning = (x?: string) => (x && x.length > 40 && x.includes(';') ? first(x) : (x ?? ''));
/** Meaning in a given language ("ru" falls back to nothing, so distractors stay in one language). */
const meaningIn = (w: VocabWord, lang: 'ru' | 'en') => first(lang === 'ru' ? w.ru : w.en);

/** German form as shown on cards: nouns with article and plural ("der Sohn / die Söhne"), verbs with their case ("helfen + Dat."). */
export function germanForm(w: VocabWord): string {
  if (w.gov) return `${w.lemma} + ${w.gov}`;
  if (w.pos !== 'noun') return w.lemma;
  return withPlural(w.lemma, w.pl !== undefined ? w.pl : pluralOf(w.lemma));
}

let POOL: VocabWord[] | null = null;
/** Distractor pool: app nouns and verbs with translations. */
function pool(): VocabWord[] {
  POOL ??= [
    ...ALL_NOUNS.map((n) => ({ lemma: nounLemma(n), pos: 'noun', ru: n.ru, en: n.en, pl: n.g === 'pl' ? undefined : n.pl })),
    ...VERBS.filter((v) => v.level !== 'B1').map((v) => ({ lemma: (v.refl ? 'sich ' : '') + v.inf, pos: 'verb', ru: v.ru, en: v.en })),
  ];
  return POOL;
}

export type CardDirection = 'de-ru' | 'ru-de';

/**
 * Four cards. "de-ru": the German word → pick its meaning; "ru-de": the meaning → pick the German word.
 * Distractors are other words of the same part of speech; none may share the answer's German form or meaning.
 */
export function cardsEx(
  words: VocabWord[],
  rng: Rng,
  opts: { srsKey?: (w: VocabWord) => string; extraPool?: VocabWord[]; onlyExtraPool?: boolean; direction?: CardDirection } = {},
): Exercise {
  const direction = opts.direction ?? 'de-ru';
  const all = opts.onlyExtraPool ? (opts.extraPool ?? []) : [...(opts.extraPool ?? []), ...pool()];
  const items: CardItem[] = words.map((w) => {
    // meanings in one language — Russian when known, otherwise English
    const lang = w.ru ? 'ru' : 'en';
    const mean = (x: VocabWord) => meaningIn(x, lang);
    const face = direction === 'de-ru' ? mean : germanForm;
    const right = face(w);
    const others = all.filter((x) => x.lemma !== w.lemma && germanForm(x) !== germanForm(w) && mean(x) !== mean(w) && mean(x));
    const samePos = others.filter((x) => x.pos === w.pos);
    const candidates = shuffle(rng, samePos.length >= 6 ? samePos : others);
    const wrong: string[] = [];
    for (const c of candidates) {
      const f = face(c);
      if (f && f !== right && !wrong.includes(f)) wrong.push(f);
      if (wrong.length === 3) break;
    }
    const options = shuffle(rng, [right, ...wrong]);
    const key = opts.srsKey?.(w);
    return direction === 'de-ru'
      ? { prompt: germanForm(w), sub: POS_LABEL[w.pos as Pos] || undefined, options, answer: options.indexOf(right), srs: key }
      : { prompt: promptMeaning(w.ru || w.en), sub: w.ru && w.en ? promptMeaning(w.en) : undefined, promptLang: 'ru', optionsLang: 'de', options, answer: options.indexOf(right), srs: key };
  });
  return {
    type: 'cards',
    title: direction === 'de-ru' ? 'Что это значит?' : 'Как это по-немецки?',
    instruction: direction === 'de-ru' ? 'Выберите правильный перевод.' : 'Выберите немецкое слово.',
    items,
  };
}

/** Accepted spellings: nouns need their article; "sich freuen" may be typed as "freuen". */
function accepted(lemma: string): string[] {
  const out = [lemma, lemma.replace(/ \(мн\.\)$/, '')];
  if (lemma.startsWith('sich ')) out.push(lemma.slice(5));
  return [...new Set(out)];
}

/** Russian + English given → type the German word. */
export function translateEx(words: VocabWord[]): Exercise {
  return {
    type: 'fill',
    title: 'Напишите по-немецки',
    instruction: 'Перевод дан по-русски и по-английски. Существительные — с артиклем (der/die/das).',
    items: words.map(
      (w): FillItem => ({
        parts: [`${meaning(w)} → `, 0],
        answers: [accepted(w.lemma)],
        hint: POS_LABEL[w.pos as Pos] || undefined,
      }),
    ),
  };
}

/** A practice set for a list of words: cards first, then typing. */
export function vocabExercises(words: VocabWord[], rng: Rng, opts: { maxCards?: number; maxTyping?: number } = {}): Exercise[] {
  const withMeaning = words.filter((w) => w.ru || w.en);
  if (!withMeaning.length) return [];
  const cards = sample(rng, withMeaning, opts.maxCards ?? 10);
  const typing = sample(rng, withMeaning, opts.maxTyping ?? 6);
  return [cardsEx(cards, rng, { extraPool: withMeaning }), translateEx(typing)];
}
