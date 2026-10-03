import { pick, sample, shuffle, type Rng } from '../lib/rng';
import type { Progress } from '../lib/progress';
import type { Level } from '../grammar/types';
import { lexKey, LEX_NOUNS, LEX_PRONOUNS, LEX_VERBS, savedEntry, type LexEntry } from '../data/lexicon';
import { CASE_CODES, GOV_LABEL } from '../data/verbGov';
import { cardsEx, germanForm, promptMeaning, type CardDirection } from './vocab';

/*
 * Memrise-style lexicon training:
 * - learn: a few new words — each one is presented first, then tested with cards in both directions;
 * - review: learned words (due first), cards in both directions and typing;
 * - speed: learned words, cards only, a time limit per answer and three lives.
 * Saved words ("⭐ Мои слова") are a scope of their own and are also mixed into every other scope.
 */

export type LexMode = 'learn' | 'review' | 'speed';

export interface LexScope {
  /** nouns, pronouns or the saved words */
  kind: LexEntry['kind'];
  /** theme id / "general" for nouns, pronoun group for pronouns; "all" = everything (ignored for saved words) */
  group: string;
  levels: Level[];
}

export const LEARN_SIZE = 5;
/** saved words among the new words of a round in another scope */
export const LEARN_MINE = 2;
export const REVIEW_SIZE = 10;
export const SPEED_SIZE = 30;
export const SPEED_SECONDS = 10;
export const LIVES = 3;

const DIRS: CardDirection[] = ['de-ru', 'ru-de'];

export interface CardQuestion {
  kind: 'cards';
  entry: LexEntry;
  dir: CardDirection;
  prompt: string;
  sub?: string;
  options: string[];
  answer: number;
  promptLang: 'de' | 'ru';
  optionsLang: 'de' | 'ru';
  /** heading instead of "Что это значит?" / "Как это по-немецки?" */
  label?: string;
  /** a grammar question about the verb instead of its meaning */
  asks?: VerbAspect;
}

export interface TypeQuestion {
  kind: 'type';
  entry: LexEntry;
  prompt: string;
  sub?: string;
  accepted: string[];
}

export type Question = CardQuestion | TypeQuestion;
export type Step = { kind: 'present'; entry: LexEntry } | Question;

/** Saved words with a meaning, oldest first. */
export function myEntries(p: Progress): LexEntry[] {
  return Object.values(p.words)
    .filter((w) => w.ru || w.en)
    .sort((a, b) => a.addedAt - b.addedAt)
    .map(savedEntry);
}

/** Entries of the chosen scope; A1 words come before A2 words (the order in which new words are taught). */
export function scopeEntries(o: LexScope, p: Progress): LexEntry[] {
  if (o.kind === 'mine') return myEntries(p);
  const list = (o.kind === 'noun' ? LEX_NOUNS : o.kind === 'verb' ? LEX_VERBS : LEX_PRONOUNS).filter((e) => e.level && o.levels.includes(e.level) && (o.group === 'all' || e.group === o.group));
  return [...list.filter((e) => e.level === 'A1'), ...list.filter((e) => e.level !== 'A1')];
}

/**
 * What a session draws from: the scope plus the saved words that need attention —
 * new ones (to be learned) and due ones (to be reviewed). Saved words that are learned and not due stay out.
 */
export function sessionEntries(o: LexScope, p: Progress, now = Date.now()): LexEntry[] {
  const entries = scopeEntries(o, p);
  if (o.kind === 'mine') return entries;
  const ids = new Set(entries.map((e) => e.id));
  const extra = myEntries(p).filter((e) => !ids.has(e.id) && (!isLearned(e, p) || isDue(e, p, now)));
  return [...entries, ...extra];
}

export const isMine = (e: LexEntry, p: Progress) => !!p.words[e.lemma];

const srsOf = (e: LexEntry, p: Progress) => DIRS.map((d) => p.srs[lexKey(e, d)]).filter(Boolean);
export const isLearned = (e: LexEntry, p: Progress) => srsOf(e, p).length > 0;
export const isDue = (e: LexEntry, p: Progress, now = Date.now()) => srsOf(e, p).some((x) => x.due <= now);

export function scopeStats(entries: LexEntry[], p: Progress, now = Date.now()) {
  const learned = entries.filter((e) => isLearned(e, p));
  return { total: entries.length, fresh: entries.length - learned.length, learned: learned.length, due: learned.filter((e) => isDue(e, p, now)).length };
}

/**
 * Distractors of the same kind: pronouns for pronouns, lexicon verbs (with their case) for lexicon verbs —
 * so the right card never stands out by having "+ Dat." — nouns otherwise. Saved verbs and adjectives
 * that aren't in the lexicon draw from the app's general word pool.
 */
export function distractorPool(entry: LexEntry | undefined): { extraPool: LexEntry[]; onlyExtraPool?: boolean } {
  if (entry?.pos === 'pron') return { extraPool: LEX_PRONOUNS };
  if (entry?.kind === 'verb') return { extraPool: LEX_VERBS, onlyExtraPool: true };
  return { extraPool: entry?.pos === 'noun' ? LEX_NOUNS : [] };
}

export function cardQuestion(entry: LexEntry, dir: CardDirection, rng: Rng): CardQuestion {
  const ex = cardsEx([entry], rng, { direction: dir, ...distractorPool(entry) });
  if (ex.type !== 'cards') throw new Error('expected cards');
  const it = ex.items[0];
  return { kind: 'cards', entry, dir, prompt: it.prompt, sub: it.sub, options: it.options, answer: it.answer, promptLang: dir === 'de-ru' ? 'de' : 'ru', optionsLang: dir === 'de-ru' ? 'ru' : 'de' };
}

/** What can be asked about a verb besides its meaning: its case, its Perfekt, its preposition. */
export type VerbAspect = 'case' | 'perfekt' | 'prep';

const ASPECT_LABEL: Record<VerbAspect, string> = { case: 'Какой падеж?', perfekt: 'Perfekt?', prep: 'Какой предлог?' };

/** The grammar questions a word has (none for nouns, pronouns and verbs without an object). */
export function verbAspects(e: LexEntry): VerbAspect[] {
  if (e.kind !== 'verb') return [];
  const out: VerbAspect[] = [];
  if (e.govCode && CASE_CODES.includes(e.govCode)) out.push('case');
  if (e.perfekt) out.push('perfekt');
  if (e.prep) out.push('prep');
  return out;
}

export const hasCase = (e: LexEntry) => verbAspects(e).includes('case');

/**
 * "helfen — which case?", "fahren — Perfekt?", "warten — which preposition?"
 * (trains the same direction as de→ru cards: knowing the German word).
 */
export function aspectQuestion(entry: LexEntry, aspect: VerbAspect, rng: Rng): CardQuestion {
  let prompt = entry.lemma;
  let right: string;
  let options: string[];
  if (aspect === 'case') {
    const codes = entry.prep ? (['A', 'D'] as const) : CASE_CODES;
    const labels = codes.map((c) => `+ ${GOV_LABEL[c]}`);
    options = rng() < 0.5 ? labels : [...labels].reverse();
    right = `+ ${GOV_LABEL[entry.govCode!]}`;
  } else if (aspect === 'perfekt') {
    right = entry.perfekt![0];
    options = shuffle(rng, entry.perfekt!);
  } else {
    prompt = `${entry.prep!.verb} ___`;
    right = entry.prep!.prep;
    options = shuffle(rng, [right, ...sample(rng, entry.prep!.wrong, 2)]);
  }
  return {
    kind: 'cards',
    entry,
    dir: 'de-ru',
    label: ASPECT_LABEL[aspect],
    asks: aspect,
    prompt,
    sub: promptMeaning(entry.ru || entry.en),
    options,
    answer: options.indexOf(right),
    promptLang: 'de',
    optionsLang: 'de',
  };
}

/** Russian → type the German word; nouns need their article, the plural may be added; "sich" is optional; a verb's case isn't typed. */
export function typeQuestion(entry: LexEntry): TypeQuestion {
  const base = entry.lemma.replace(/ \(мн\.\)$/, '');
  const accepted = [base, entry.lemma, germanForm(entry), ...(base.startsWith('sich ') ? [base.slice(5)] : [])];
  return { kind: 'type', entry, prompt: promptMeaning(entry.ru || entry.en), sub: entry.ru && entry.en ? promptMeaning(entry.en) : undefined, accepted: [...new Set(accepted)] };
}

/** SRS key a question trains (typing trains the same direction as ru→de cards). */
export const questionKey = (q: Question) => lexKey(q.entry, q.kind === 'type' ? 'ru-de' : q.dir);

/** The same question again, with the cards shuffled anew. */
export const repeatQuestion = (q: Question, rng: Rng): Question =>
  q.kind === 'type' ? q : q.asks ? aspectQuestion(q.entry, q.asks, rng) : cardQuestion(q.entry, q.dir, rng);

const randomDir = (rng: Rng): CardDirection => (rng() < 0.5 ? 'de-ru' : 'ru-de');
const otherDir = (d: CardDirection): CardDirection => (d === 'de-ru' ? 'ru-de' : 'de-ru');

/** The new words of a learning round: up to LEARN_MINE saved words, the rest from the scope, in random order. */
export function learnWords(entries: LexEntry[], p: Progress, rng: Rng): LexEntry[] {
  const fresh = entries.filter((e) => !isLearned(e, p));
  const mine = fresh.filter((e) => isMine(e, p));
  const rest = fresh.filter((e) => !isMine(e, p));
  const mineCount = rest.length ? Math.min(LEARN_MINE, mine.length) : LEARN_SIZE;
  return shuffle(rng, [...mine.slice(0, mineCount), ...rest].slice(0, LEARN_SIZE));
}

/**
 * Learning new words: show word 1, test it; show word 2, test it, test word 1 the other way round; …
 * then a final mixed round (for verbs: their case, Perfekt or preposition). Every word is tested three times.
 */
export function learnSteps(entries: LexEntry[], p: Progress, rng: Rng): Step[] {
  const words = learnWords(entries, p, rng);
  const steps: Step[] = [];
  const firstDir = new Map<LexEntry, CardDirection>();
  words.forEach((w, i) => {
    const d = randomDir(rng);
    firstDir.set(w, d);
    steps.push({ kind: 'present', entry: w }, cardQuestion(w, d, rng));
    if (i > 0) steps.push(cardQuestion(words[i - 1], otherDir(firstDir.get(words[i - 1])!), rng));
  });
  if (words.length) steps.push(cardQuestion(words[words.length - 1], otherDir(firstDir.get(words[words.length - 1])!), rng));
  // the last round asks about a verb's grammar — it was shown on the word's card
  const final = shuffle(rng, words).map((w) => {
    const aspects = verbAspects(w);
    return aspects.length ? aspectQuestion(w, pick(rng, aspects), rng) : cardQuestion(w, randomDir(rng), rng);
  });
  // never ask the same word twice in a row
  if (final.length > 1 && steps.length && final[0].entry === (steps[steps.length - 1] as Question).entry) final.push(final.shift()!);
  return [...steps, ...final];
}

/** Learned words, the ones due (and the weakest) first. */
function reviewOrder(entries: LexEntry[], p: Progress, rng: Rng, now: number): LexEntry[] {
  const learned = shuffle(rng, entries.filter((e) => isLearned(e, p)));
  const score = (e: LexEntry) => {
    const s = srsOf(e, p);
    return (isDue(e, p, now) ? 0 : 1000) + Math.min(...s.map((x) => x.box));
  };
  return learned.sort((a, b) => score(a) - score(b));
}

/** Classic review: cards in both directions, typing and (verbs) case / Perfekt / preposition, one question per word. */
export function reviewQuestions(entries: LexEntry[], p: Progress, rng: Rng, now = Date.now()): Question[] {
  return reviewOrder(entries, p, rng, now)
    .slice(0, REVIEW_SIZE)
    .map((e) => {
      // typing, cards both ways and — for verbs — one of their grammar questions, equally often
      const aspects = verbAspects(e);
      const k = Math.floor(rng() * (aspects.length ? 4 : 3));
      return k === 0 ? typeQuestion(e) : k === 3 ? aspectQuestion(e, pick(rng, aspects), rng) : cardQuestion(e, k === 1 ? 'de-ru' : 'ru-de', rng);
    });
}

/** Speed review: cards only; the learned words are cycled until there are enough questions. */
export function speedQuestions(entries: LexEntry[], p: Progress, rng: Rng, now = Date.now()): CardQuestion[] {
  const words = reviewOrder(entries, p, rng, now);
  const out: CardQuestion[] = [];
  for (let round = 0; words.length && out.length < SPEED_SIZE; round++) {
    const batch = round === 0 ? words : shuffle(rng, words);
    for (const w of batch) {
      if (out.length >= SPEED_SIZE) break;
      if (out.length && out[out.length - 1].entry === w) continue;
      out.push(cardQuestion(w, randomDir(rng), rng));
    }
  }
  return out;
}

/**
 * Review answers that are recorded: a mistake always resets the word; a right answer only moves it up
 * when it was due — otherwise extra reviews would push words far into the future.
 */
export function reviewUpdate(key: string, ok: boolean, p: Progress, now = Date.now()): { key: string; ok: boolean }[] {
  const cur = p.srs[key];
  if (ok && cur && cur.due > now) return [];
  return [{ key, ok }];
}

/** Points in speed review: 10 for the answer plus a bonus for the time left. */
export const speedPoints = (msLeft: number) => 10 + Math.max(0, Math.round(msLeft / 500));
