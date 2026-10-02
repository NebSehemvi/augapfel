import { defaultRng, pick, sample, shuffle, type Rng } from '../lib/rng';
import { THEMES, getNoun, hasNoun } from '../data/themes';
import type { Theme } from '../data/themes/types';
import { PLANS } from '../topics/plans';
import type { Ctx } from './context';
import type { ChoiceItem, Exercise, FillItem } from './types';
import { formsItem, srsKey, verbLabel, type FormField } from './builders';
import { getVerb, hasVerb, VERBS, verbKey, TABLE_VERBS } from '../data/verbs';
import { PREP_VERBS, ALL_PREPS, findPrepVerb } from '../data/prepVerbs';
import { GENDER_ART } from '../grammar/articles';
import { PRONOUNS } from '../grammar/subjects';
import { render, sentence } from '../grammar/clause';
import type { Level, Verb } from '../grammar/types';
import type { Progress } from '../lib/progress';
import { cardsEx, translateEx as translateWordsEx, vocabExercises, type VocabWord } from './vocab';
import type { ReadingText } from '../data/texts';
import { isContentWord, lookupLocal, tokenize, type WordInfo } from '../lib/dictionary';

export interface Session {
  title: string;
  theme?: Theme;
  exercises: Exercise[];
  /** create SRS entries for every answer (trainer) or only for mistakes (topics) */
  srsCreate: boolean;
}

/** Pick a theme that wasn't used in the last few sessions. */
export function pickTheme(recent: string[], rng: Rng = defaultRng): Theme {
  const fresh = THEMES.filter((t) => !recent.slice(0, 4).includes(t.id));
  return pick(rng, fresh.length ? fresh : THEMES);
}

export function topicSession(topicId: string, progress: Progress, themeId?: string, rng: Rng = defaultRng): Session {
  const theme = themeId ? THEMES.find((t) => t.id === themeId)! : pickTheme(progress.recentThemes, rng);
  const ctx: Ctx = { theme, rng, level: progress.settings.level, includeRare: progress.settings.includeRare };
  const plan = PLANS[topicId];
  // A single bad generation must never kill the session; retry a few times per exercise set.
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      return { title: topicId, theme, exercises: plan(ctx), srsCreate: false };
    } catch (e) {
      console.warn('generation failed, retrying', e);
    }
  }
  throw new Error('Не удалось создать упражнения');
}

// ---------------------------------------------------------------------------
// review (spaced repetition)

export function reviewSession(keys: string[], words: Progress['words'] = {}, rng: Rng = defaultRng): Session {
  const verbForms = new Map<string, Set<FormField>>();
  const genders: string[] = [];
  const plurals: string[] = [];
  const preps: [string, string][] = [];
  const infs: string[] = [];
  const wordRec: VocabWord[] = [];
  const wordProd: VocabWord[] = [];

  for (const key of keys) {
    const [kind, a, b] = key.split('|');
    if (kind === 'v' && hasVerb(a)) {
      if (b === 'inf') infs.push(a);
      else {
        const f = (b === 'pres' ? 'pres3' : b) as FormField;
        if (!verbForms.has(a)) verbForms.set(a, new Set());
        verbForms.get(a)!.add(f);
      }
    } else if (kind === 'n' && hasNoun(a)) {
      if (b === 'g') genders.push(a);
      else if (b === 'pl') plurals.push(a);
    } else if (kind === 'p' && findPrepVerb(a, b)) preps.push([a, b]);
    else if (kind === 'w' && words[a]) (b === 'rec' ? wordRec : wordProd).push(words[a]);
  }

  const exercises: Exercise[] = [];
  const verbEntries = [...verbForms.entries()].slice(0, 12);
  for (let i = 0; i < verbEntries.length; i += 4) {
    exercises.push({
      type: 'forms',
      title: 'Повторение: формы глаголов',
      instruction: 'Напишите формы глагола.',
      items: verbEntries.slice(i, i + 4).map(([k, fields]) => formsItem(getVerb(k), [...fields])),
    });
  }
  if (infs.length) exercises.push(translateEx(infs.slice(0, 8).map(getVerb)));
  if (genders.length) exercises.push(genderEx(genders.slice(0, 10)));
  if (plurals.length) exercises.push(pluralEx(plurals.slice(0, 8)));
  if (preps.length) exercises.push(prepEx(preps.slice(0, 8), rng));
  if (wordRec.length) exercises.push(cardsEx(wordRec.slice(0, 12), rng, { srs: true, extraPool: Object.values(words) }));
  if (wordProd.length) exercises.push(translateWordsEx(wordProd.slice(0, 8), { srs: true }));
  return { title: 'Повторение', exercises: shuffle(rng, exercises), srsCreate: true };
}

function genderEx(nouns: string[]): Exercise {
  return {
    type: 'choice',
    title: 'Повторение: род',
    instruction: 'Выберите артикль.',
    layout: 'inline',
    items: nouns.map((n) => {
      const noun = getNoun(n);
      const options = ['der', 'die', 'das'];
      return { parts: [0, ` ${noun.de}`], options, answer: options.indexOf(GENDER_ART[noun.g as 'm' | 'f' | 'n']), hint: noun.ru, srs: srsKey.gender(n) };
    }),
  };
}

function pluralEx(nouns: string[]): Exercise {
  return {
    type: 'fill',
    title: 'Повторение: множественное число',
    instruction: 'Напишите форму множественного числа.',
    items: nouns.map((n) => {
      const noun = getNoun(n);
      return { parts: [`${GENDER_ART[noun.g as 'm' | 'f' | 'n']} ${noun.de} → die `, 0], answers: [[noun.pl!]], hint: noun.ru, srs: [srsKey.plural(n)] };
    }),
  };
}

function prepEx(pairs: [string, string][], rng: Rng): Exercise {
  return {
    type: 'choice',
    title: 'Повторение: глаголы с предлогами',
    instruction: 'Выберите предлог.',
    layout: 'inline',
    items: pairs.map(([verb, prep]) => prepItem(verb, prep, rng)),
  };
}

function prepItem(verb: string, prep: string, rng: Rng): ChoiceItem {
  const pv = findPrepVerb(verb, prep)!;
  const subj = pick(rng, PRONOUNS);
  const text = sentence(render({ subj, verb: getVerb(verb), tense: 'pres', c: '\u0000' + pv.ex.slice(prep.length) }, 'S'));
  const [before, after] = text.split('\u0000');
  const options = shuffle(rng, [prep, ...sample(rng, ALL_PREPS.filter((p) => p !== prep), 3)]);
  return {
    parts: [before, 0, after],
    options,
    answer: options.indexOf(prep),
    hint: `${verb}; ${pv.ru}`,
    srs: srsKey.prep(verb, prep),
    explain: `${verb} ${prep} + ${pv.case === 'akk' ? 'Akk' : 'Dat'}`,
  };
}

function translateEx(verbs: Verb[]): Exercise {
  return {
    type: 'fill',
    title: 'Как это по-немецки?',
    instruction: 'Напишите немецкий инфинитив.',
    items: verbs.map(
      (v): FillItem => ({
        parts: [`${v.ru} → `, 0],
        answers: [[verbLabel(v), v.inf]],
        hint: v.en,
        srs: [`v|${verbKey(v)}|inf`],
      }),
    ),
  };
}

// ---------------------------------------------------------------------------
// verb trainer

export type TrainerPool = 'table' | 'irregular' | 'regular' | 'separable' | 'modal' | 'prep';
export type TrainerMode = 'forms' | 'praesens' | 'translate';

export interface TrainerOptions {
  pool: TrainerPool;
  mode: TrainerMode;
  levels: Level[];
  count: number;
}

export const POOL_LABEL: Record<TrainerPool, string> = {
  table: 'Таблица сильных глаголов',
  irregular: 'Все сильные и неправильные',
  regular: 'Слабые (правильные)',
  separable: 'С отделяемой приставкой',
  modal: 'Модальные и вспомогательные',
  prep: 'Глаголы с предлогами',
};

export const MODE_LABEL: Record<TrainerMode, string> = {
  forms: 'Präteritum + Partizip II + haben/sein',
  praesens: 'Präsens (er/sie/es)',
  translate: 'Перевод: русский → немецкий',
};

export function trainerVerbs(o: Pick<TrainerOptions, 'pool' | 'levels'>): Verb[] {
  const lv = (v: Verb) => o.levels.includes(v.level);
  switch (o.pool) {
    case 'table':
      return TABLE_VERBS.filter((v) => lv(v) && v.kind !== 'modal' && v.kind !== 'aux');
    case 'irregular':
      return VERBS.filter((v) => lv(v) && (v.kind === 'strong' || v.kind === 'mixed') && !v.refl);
    case 'regular':
      return VERBS.filter((v) => lv(v) && v.kind === 'weak' && !v.refl && v.inf !== 'regnen');
    case 'separable':
      return VERBS.filter((v) => lv(v) && !!v.sep);
    case 'modal':
      return VERBS.filter((v) => lv(v) && (v.kind === 'modal' || v.kind === 'aux'));
    case 'prep':
      return [];
  }
}

function modeFields(mode: TrainerMode, v: Verb): FormField[] {
  if (mode === 'praesens') return ['pres3'];
  if (v.kind === 'modal' && v.inf === 'möchten') return ['praet'];
  return ['praet', 'pp', 'aux'];
}

function modeKey(mode: TrainerMode, v: Verb): string {
  if (mode === 'translate') return `v|${verbKey(v)}|inf`;
  if (mode === 'praesens') return srsKey.pres(v);
  return srsKey.pp(v);
}

/** Order: due items first, then never-seen, then the rest (randomised within groups). */
function prioritise<T>(items: T[], key: (x: T) => string, progress: Progress, rng: Rng): T[] {
  const now = Date.now();
  const due: T[] = [];
  const fresh: T[] = [];
  const rest: T[] = [];
  for (const it of shuffle(rng, items)) {
    const s = progress.srs[key(it)];
    if (!s) fresh.push(it);
    else if (s.due <= now) due.push(it);
    else rest.push(it);
  }
  return [...due, ...fresh, ...rest];
}

export function trainerSession(o: TrainerOptions, progress: Progress, rng: Rng = defaultRng): Session {
  if (o.pool === 'prep') {
    const pvs = prioritise(
      PREP_VERBS.filter((p) => o.levels.includes(p.level)),
      (p) => srsKey.prep(p.verb, p.prep),
      progress,
      rng,
    ).slice(0, o.count);
    const exercises: Exercise[] = [];
    for (let i = 0; i < pvs.length; i += 5) {
      exercises.push({
        type: 'choice',
        title: 'Глаголы с предлогами',
        instruction: 'Выберите предлог.',
        layout: 'inline',
        items: pvs.slice(i, i + 5).map((p) => prepItem(p.verb, p.prep, rng)),
      });
    }
    return { title: 'Тренажёр глаголов', exercises, srsCreate: true };
  }
  const verbs = prioritise(trainerVerbs(o), (v) => modeKey(o.mode, v), progress, rng).slice(0, o.count);
  const exercises: Exercise[] = [];
  const per = o.mode === 'forms' ? 3 : 5;
  for (let i = 0; i < verbs.length; i += per) {
    const chunk = verbs.slice(i, i + per);
    if (o.mode === 'translate') exercises.push(translateEx(chunk));
    else
      exercises.push({
        type: 'forms',
        title: o.mode === 'praesens' ? 'Präsens: er/sie/es' : 'Три формы глагола',
        instruction: o.mode === 'praesens' ? 'Напишите форму 3-го лица ед. ч.' : 'Напишите Präteritum, Partizip II и вспомогательный глагол.',
        items: chunk.map((v) => formsItem(v, modeFields(o.mode, v))),
      });
  }
  return { title: 'Тренажёр глаголов', exercises, srsCreate: true };
}

// ---------------------------------------------------------------------------
// saved words ("Мои слова")

export function wordsSession(progress: Progress, rng: Rng = defaultRng): Session {
  const now = Date.now();
  const list = Object.values(progress.words);
  const score = (w: VocabWord) => {
    const a = progress.srs[`w|${w.lemma}|rec`];
    const b = progress.srs[`w|${w.lemma}|prod`];
    const due = [a, b].filter((x) => !x || x.due <= now).length;
    return due * 10 - Math.min(a?.box ?? 0, b?.box ?? 0) + rng();
  };
  const chosen = [...list].sort((x, y) => score(y) - score(x)).slice(0, 12);
  return { title: 'Мои слова', exercises: vocabExercises(chosen, rng, { srs: true, maxCards: 12, maxTyping: 8 }), srsCreate: true };
}

// ---------------------------------------------------------------------------
// reading texts

/** Unique content words (nouns, verbs, adjectives) of a text, resolved offline. */
export function textWords(text: ReadingText): WordInfo[] {
  const seen = new Map<string, WordInfo>();
  for (const p of text.paragraphs)
    for (const tok of tokenize(p)) {
      if (!tok.word) continue;
      const info = lookupLocal(tok.word, text.glossary);
      if (info && isContentWord(info) && !seen.has(info.lemma) && (info.pos !== 'noun' || /^(der|die|das) /.test(info.lemma))) seen.set(info.lemma, info);
    }
  return [...seen.values()];
}

export function textSession(text: ReadingText, progress: Progress, rng: Rng = defaultRng): Session {
  const exercises: Exercise[] = [];
  if (text.questions.length) {
    exercises.push({
      type: 'choice',
      title: 'Понимание текста',
      instruction: 'Ответьте на вопросы по тексту.',
      layout: 'list',
      items: text.questions.map((q) => {
        const options = shuffle(rng, q.options);
        return { question: q.q, options, answer: options.indexOf(q.options[q.answer]) };
      }),
    });
  }
  if (text.fill?.length) {
    exercises.push({
      type: 'bank',
      title: 'Слова из текста',
      instruction: 'Перетащите слова в пропуски. Лишние слова останутся.',
      items: text.fill.map((f) => {
        const [before, after = ''] = f.sentence.split('___');
        return { parts: [before, 0, after], answers: [f.answer], hint: f.hint_ru };
      }),
      bank: shuffle(rng, text.fill.flatMap((f) => [f.answer, f.wrong[0] ?? f.answer])),
    });
  }
  const words = textWords(text).map((w) => ({ ...w, saved: !!progress.words[w.lemma] }));
  exercises.push(...vocabExercises(words, rng, { maxCards: 8, maxTyping: 5 }));
  return { title: text.title, exercises, srsCreate: false };
}
