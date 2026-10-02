import { sample, shuffle, type Rng } from '../lib/rng';
import type { CardItem, Exercise, FillItem } from './types';
import { ALL_NOUNS } from '../data/themes';
import { VERBS } from '../data/verbs';
import { GENDER_ART } from '../grammar/articles';
import { POS_LABEL, type Pos } from '../lib/dictionary';

/** Minimal word shape shared by saved words and dictionary hits. */
export interface VocabWord {
  lemma: string;
  pos: string;
  ru?: string;
  en?: string;
}

export const meaning = (w: VocabWord) => [w.ru, w.en].filter(Boolean).join(' · ');
const first = (x?: string) => (x ?? '').split(';')[0].trim();
/** Meaning in a given language ("ru" falls back to nothing, so distractors stay in one language). */
const meaningIn = (w: VocabWord, lang: 'ru' | 'en') => first(lang === 'ru' ? w.ru : w.en);

let POOL: VocabWord[] | null = null;
/** Distractor pool: app nouns and verbs with translations. */
function pool(): VocabWord[] {
  POOL ??= [
    ...ALL_NOUNS.map((n) => ({ lemma: `${GENDER_ART[n.g as 'm' | 'f' | 'n']} ${n.de}`, pos: 'noun', ru: n.ru, en: n.en })),
    ...VERBS.filter((v) => v.level !== 'B1').map((v) => ({ lemma: (v.refl ? 'sich ' : '') + v.inf, pos: 'verb', ru: v.ru, en: v.en })),
  ];
  return POOL;
}

/** Four cards: the German word → pick its meaning. */
export function cardsEx(words: VocabWord[], rng: Rng, opts: { srs?: boolean; extraPool?: VocabWord[] } = {}): Exercise {
  const all = [...(opts.extraPool ?? []), ...pool()];
  const items: CardItem[] = words.map((w) => {
    // all four cards in the same language — Russian when known, otherwise English
    const lang = w.ru ? 'ru' : 'en';
    const shortMeaning = (x: VocabWord) => meaningIn(x, lang);
    const right = shortMeaning(w);
    const samePos = all.filter((x) => x.pos === w.pos && x.lemma !== w.lemma);
    const candidates = shuffle(rng, samePos.length >= 6 ? samePos : all.filter((x) => x.lemma !== w.lemma));
    const wrong: string[] = [];
    for (const c of candidates) {
      const m = shortMeaning(c);
      if (m && m !== right && !wrong.includes(m)) wrong.push(m);
      if (wrong.length === 3) break;
    }
    const options = shuffle(rng, [right, ...wrong]);
    return {
      prompt: w.lemma,
      sub: POS_LABEL[w.pos as Pos] || undefined,
      options,
      answer: options.indexOf(right),
      srs: opts.srs ? `w|${w.lemma}|rec` : undefined,
    };
  });
  return {
    type: 'cards',
    title: 'Что это значит?',
    instruction: 'Выберите правильный перевод.',
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
export function translateEx(words: VocabWord[], opts: { srs?: boolean } = {}): Exercise {
  return {
    type: 'fill',
    title: 'Напишите по-немецки',
    instruction: 'Перевод дан по-русски и по-английски. Существительные — с артиклем (der/die/das).',
    items: words.map(
      (w): FillItem => ({
        parts: [`${meaning(w)} → `, 0],
        answers: [accepted(w.lemma)],
        hint: POS_LABEL[w.pos as Pos] || undefined,
        srs: [opts.srs ? `w|${w.lemma}|prod` : undefined],
      }),
    ),
  };
}

/** A practice set for a list of words: cards first, then typing. */
export function vocabExercises(words: VocabWord[], rng: Rng, opts: { srs?: boolean; maxCards?: number; maxTyping?: number } = {}): Exercise[] {
  const withMeaning = words.filter((w) => w.ru || w.en);
  if (!withMeaning.length) return [];
  const cards = sample(rng, withMeaning, opts.maxCards ?? 10);
  const typing = sample(rng, withMeaning, opts.maxTyping ?? 6);
  return [cardsEx(cards, rng, { srs: opts.srs, extraPool: withMeaning }), translateEx(typing, { srs: opts.srs })];
}
