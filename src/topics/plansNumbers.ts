import { pick, sample, shuffle, type Rng } from '../lib/rng';
import type { Ctx } from '../exercises/context';
import type { ChoiceItem, Exercise, FillItem } from '../exercises/types';
import * as B from '../exercises/builders';
import { canSpeak } from '../lib/speech';
import {
  clockText,
  dateDat,
  dateNom,
  dateText,
  formalTime,
  informalTime,
  informalTimes,
  MONTHS,
  numberWord,
  numberWords,
  ordinalStem,
  priceText,
  priceWord,
  yearWord,
} from '../grammar/numbers';

/*
 * Exercise plans for "Числа и время": numbers and prices, clock times, dates.
 * Everything is generated, so every session has new numbers. Listening tasks are added only when the
 * browser can speak German.
 */

const int = (rng: Rng, from: number, to: number) => from + Math.floor(rng() * (to - from + 1));

/** n distinct values from a generator */
function distinct<T>(rng: Rng, n: number, make: (rng: Rng) => T, key: (x: T) => string = String): T[] {
  const out = new Map<string, T>();
  for (let tries = 0; out.size < n && tries < n * 50; tries++) {
    const x = make(rng);
    if (!out.has(key(x))) out.set(key(x), x);
  }
  return [...out.values()];
}

/** A choice item with the right option first in `options`; the options get shuffled here. */
function choice(rng: Rng, item: Omit<ChoiceItem, 'answer'> & { options: string[] }): ChoiceItem {
  const right = item.options[0];
  const options = shuffle(rng, [...new Set(item.options)]);
  return { ...item, options, answer: options.indexOf(right) };
}

// ---------------------------------------------------------------------------
// numbers

const TENS_WORD = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];

/** Typical wrong spellings of 21–99: tens first (sechzigsieben), swapped digits (sechsundsiebzig), sechszig / siebenzig. */
function wrongTwoDigit(n: number): string[] {
  const t = Math.floor(n / 10);
  const o = n % 10;
  const right = numberWord(n);
  const out = [TENS_WORD[t] + numberWord(o)];
  if (o >= 2 && o !== t) out.push(numberWord(o * 10 + t));
  const misspelled = right.replace('sechzig', 'sechszig').replace('siebzig', 'siebenzig').replace('dreißig', 'dreizig');
  if (misspelled !== right) out.push(misspelled);
  if (out.length < 3) out.push(numberWord(n + (n % 10 === 9 ? -1 : 1)));
  return out.filter((w) => w !== right);
}

/** 21–99, not round, not a double digit (so the swapped number is different) */
const twoDigit = (rng: Rng) => {
  for (;;) {
    const n = int(rng, 21, 99);
    if (n % 10 && n % 11) return n;
  }
};

/** Mixed sizes: two-digit, hundreds, one thousand-something */
// thousands from 2001: 1100–1999 would look like years, which are read differently
const anyNumber = (rng: Rng, k: number) => (k % 3 === 2 ? int(rng, 101, 999) : k === 4 ? int(rng, 2001, 9999) : twoDigit(rng));

const TRICKY = [11, 12, 16, 17, 21, 30, 60, 70, 66, 77, 101, 1000];

function numbersPlan(ctx: Ctx): Exercise[] {
  const { rng } = ctx;
  const ex: Exercise[] = [];

  ex.push(
    B.matchEx(
      'Цифры и слова',
      'Соедините число и слово.',
      sample(rng, TRICKY, 5).map((n) => [String(n), numberWord(n)] as [string, string]),
    ),
  );

  ex.push({
    type: 'choice',
    title: 'Как это пишется?',
    instruction: 'Выберите правильное написание. Помните: сначала единицы, потом десятки.',
    layout: 'list',
    items: distinct(rng, 4, twoDigit).map((n) => choice(rng, { question: String(n), options: [numberWord(n), ...wrongTwoDigit(n).slice(0, 3)] })),
  });

  ex.push({
    type: 'fill',
    title: 'Напишите число словом',
    instruction: 'Одним словом, без пробелов: 21 → einundzwanzig.',
    items: distinct(rng, 5, (r) => anyNumber(r, int(r, 0, 4))).map((n): FillItem => ({ parts: [`${n} → `, 0], answers: [numberWords(n)] })),
  });

  ex.push({
    type: 'fill',
    title: 'Напишите цифрами',
    instruction: 'Прочитайте число и напишите его цифрами.',
    items: distinct(rng, 4, (r) => anyNumber(r, int(r, 0, 3))).map((n): FillItem => ({ parts: [`${numberWord(n)} → `, 0], answers: [[String(n)]] })),
  });

  ex.push({
    type: 'choice',
    title: 'Was kostet das?',
    instruction: 'Как правильно прочитать цену?',
    layout: 'list',
    items: distinct(rng, 4, (r) => int(r, 1, 30) * 100 + twoDigit(r)).map((c) => {
      const e = Math.floor(c / 100);
      const ct = c % 100;
      const swapped = e * 100 + (ct % 10) * 10 + Math.floor(ct / 10);
      return choice(rng, { question: priceText(c), options: [priceWord(c), priceWord(swapped), priceWord((e + 1) * 100 + ct), `${numberWord(e)} Euro ${wrongTwoDigit(ct)[0]}`] });
    }),
  });

  if (canSpeak) {
    ex.push({
      type: 'fill',
      title: 'Слушаем числа',
      instruction: 'Нажмите 🔊, прослушайте число и запишите его цифрами.',
      items: distinct(rng, 4, (r) => anyNumber(r, int(r, 0, 3))).map((n): FillItem => ({ parts: [0], answers: [[String(n)]], audio: numberWord(n) })),
    });
  }
  return ex;
}

// ---------------------------------------------------------------------------
// clock

type Time = { h: number; m: number };
const timeKey = (t: Time) => `${t.h}:${t.m}`;
/** everyday times: 5-minute steps, 1–12 o'clock */
const dayTime = (rng: Rng): Time => ({ h: int(rng, 1, 12), m: pick(rng, [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]) });

/** Times a learner confuses with t: "halb" an hour off, "nach" ↔ "vor", half an hour off. */
function confusable(t: Time): Time[] {
  const wrap = (h: number) => ((h + 11) % 12) + 1;
  return [
    { h: wrap(t.h + 1), m: t.m },
    { h: wrap(t.h - 1), m: t.m },
    { h: t.h, m: (60 - t.m) % 60 },
    { h: t.h, m: (t.m + 30) % 60 },
  ].filter((x) => timeKey(x) !== timeKey(t));
}

/** Wrong phrases for t: phrases of confusable times that don't also describe t */
const wrongPhrases = (rng: Rng, t: Time) => {
  const right = informalTimes(t.h, t.m);
  return shuffle(rng, [...new Set(confusable(t).map((x) => informalTime(x.h, x.m)))].filter((p) => !right.includes(p))).slice(0, 3);
};

const PREP_TIME: { parts: (string | number)[]; answers: string[][]; distractors: string[] }[] = [
  { parts: ['Der Kurs beginnt ', 0, ' neun Uhr.'], answers: [['um']], distractors: ['am', 'im'] },
  { parts: ['Ich arbeite ', 0, ' acht bis vier Uhr.'], answers: [['von']], distractors: ['um', 'am'] },
  { parts: ['Die Bäckerei ist von sieben ', 0, ' zwölf Uhr geöffnet.'], answers: [['bis']], distractors: ['um', 'nach'] },
  { parts: ['Wie ', 0, ' ist es? — Es ist halb drei.'], answers: [['spät']], distractors: ['viel', 'lange'] },
  { parts: [0, ' beginnt der Film? — Um acht.'], answers: [['Wann']], distractors: ['Wie', 'Wo'] },
  { parts: ['Ich komme ', 0, ' acht Uhr, vielleicht etwas später.'], answers: [['gegen']], distractors: ['um', 'bis'] },
  { parts: ['Wie viel ', 0, ' ist es? — Zehn nach vier.'], answers: [['Uhr']], distractors: ['Zeit', 'Stunde'] },
];

function clockPlan(ctx: Ctx): Exercise[] {
  const { rng } = ctx;
  const ex: Exercise[] = [];

  ex.push({
    type: 'choice',
    title: 'Wie spät ist es?',
    instruction: 'Выберите, как это говорят в разговоре. Осторожно с «halb»!',
    layout: 'list',
    items: distinct(rng, 4, dayTime, timeKey).map((t) =>
      // half the times as 24-hour clock: 15:30 is also "halb vier"
      choice(rng, { question: clockText(rng() < 0.5 ? t.h : (t.h + 12) % 24, t.m), options: [informalTime(t.h, t.m), ...wrongPhrases(rng, t)] }),
    ),
  });

  ex.push({
    type: 'choice',
    title: 'Который час?',
    instruction: 'Выберите время цифрами.',
    layout: 'inline',
    items: distinct(rng, 4, (r) => ({ h: int(r, 1, 12), m: pick(r, [15, 20, 25, 30, 35, 40, 45]) }), timeKey).map((t) =>
      choice(rng, {
        question: `Es ist ${informalTime(t.h, t.m)}.`,
        options: [clockText(t.h, t.m), ...shuffle(rng, confusable(t)).slice(0, 3).map((x) => clockText(x.h, x.m))],
      }),
    ),
  });

  ex.push(
    B.matchEx(
      'Часы и слова',
      'Соедините время и фразу.',
      distinct(rng, 4, dayTime, timeKey).map((t) => [clockText(t.h, t.m), informalTime(t.h, t.m)] as [string, string]),
    ),
  );

  ex.push({
    type: 'fill',
    title: 'Официальное время',
    instruction: 'Как это сказали бы на вокзале или по радио? 15:30 → fünfzehn Uhr dreißig.',
    items: distinct(rng, 4, (r) => ({ h: int(r, 1, 23), m: int(r, 0, 59) }), timeKey).map((t): FillItem => ({ parts: [`${clockText(t.h, t.m)} → `, 0], answers: [[formalTime(t.h, t.m)]] })),
  });

  ex.push(
    B.asBank(ctx, {
      type: 'fill',
      title: 'um, von … bis, wann?',
      instruction: 'Вставьте слово.',
      items: sample(rng, PREP_TIME, 5).map((p): FillItem => ({ parts: p.parts, answers: p.answers, distractors: p.distractors })),
    }),
  );

  if (canSpeak) {
    ex.push({
      type: 'choice',
      title: 'Слушаем время',
      instruction: 'Нажмите 🔊 и выберите время.',
      layout: 'inline',
      items: distinct(rng, 4, (r) => ({ h: int(r, 1, 12), m: pick(r, [15, 30, 45, 20, 40]) }), timeKey).map((t) =>
        choice(rng, {
          question: 'Wie spät ist es?',
          audio: `Es ist ${informalTime(t.h, t.m)}.`,
          options: [clockText(t.h, t.m), ...shuffle(rng, confusable(t)).slice(0, 3).map((x) => clockText(x.h, x.m))],
        }),
      ),
    });
  }
  return ex;
}

// ---------------------------------------------------------------------------
// dates

type Day = { d: number; m: number };
const dayKey = (x: Day) => `${x.d}.${x.m}`;
const anyDay = (rng: Rng): Day => {
  const m = int(rng, 0, 11);
  // up to 28 so every month works; the tricky days first: 1., 3., 7., 8.
  return { d: rng() < 0.4 ? pick(rng, [1, 3, 7, 8]) : int(rng, 2, 28), m };
};

const DAT_FRAMES = [
  (x: string) => [`Ich habe am `, 0, ` ${x} Geburtstag.`],
  (x: string) => [`Der Kurs beginnt am `, 0, ` ${x}.`],
  (x: string) => [`Am `, 0, ` ${x} fahren wir nach Berlin.`],
  (x: string) => [`Der Termin ist am `, 0, ` ${x}.`],
];

const PREP_DATE: [string, string][] = [
  ['Montag', 'am'],
  ['Mai', 'im'],
  ['3. Mai', 'am'],
  ['acht Uhr', 'um'],
  ['Sommer', 'im'],
  ['Wochenende', 'am'],
  ['Januar', 'im'],
  ['halb neun', 'um'],
  ['Freitagabend', 'am'],
  ['Winter', 'im'],
];

function datePlan(ctx: Ctx): Exercise[] {
  const { rng } = ctx;
  const ex: Exercise[] = [];

  ex.push({
    type: 'choice',
    title: 'Порядковые числа',
    instruction: 'Выберите правильную форму. Особые: erste, dritte, siebte, achte.',
    layout: 'inline',
    items: distinct(rng, 5, anyDay, dayKey).map((x) => {
      const stem = ordinalStem(x.d);
      // "siebente" is a valid (older) form of "siebte", so it is never offered as a wrong option
      const naive = x.d === 7 ? 'siebete' : numberWord(x.d) + (x.d < 20 ? 'te' : 'ste');
      return choice(rng, { parts: ['Heute ist der ', 0, ` ${MONTHS[x.m]}.`], context: `${x.d}.`, options: [`${stem}e`, naive, `${stem}en`, `${stem}er`] });
    }),
  });

  ex.push({
    type: 'fill',
    title: 'Когда?',
    instruction: 'Напишите порядковое число: «am …ten» или «der …te».',
    items: distinct(rng, 5, anyDay, dayKey).map((x, k): FillItem => {
      const month = MONTHS[x.m];
      const stem = ordinalStem(x.d);
      const forms = (end: string) => [`${stem}${end}`, ...(x.d === 7 ? [`siebent${end}`] : [])];
      return k % 3 === 0
        ? { parts: ['Heute ist der ', 0, ` ${month}.`], answers: [forms('e')], context: `${x.d}.` }
        : { parts: pick(rng, DAT_FRAMES)(month), answers: [forms('en')], context: `${x.d}.` };
    }),
  });

  ex.push({
    type: 'choice',
    title: 'am, im или um?',
    instruction: 'am + день или дата, im + месяц или время года, um + время на часах.',
    layout: 'inline',
    items: sample(rng, PREP_DATE, 6).map(([w, p]) => choice(rng, { parts: [0, ` ${w}`], options: [p, ...['am', 'im', 'um'].filter((x) => x !== p)] })),
  });

  ex.push(
    B.matchEx(
      'Даты',
      'Соедините дату и как её читают.',
      distinct(rng, 4, anyDay, dayKey).map((x) => [dateText(x.d, x.m), dateNom(x.d, x.m)] as [string, string]),
    ),
  );

  ex.push({
    type: 'choice',
    title: 'Годы',
    instruction: 'Как читают год?',
    layout: 'list',
    items: [int(rng, 1950, 1999), int(rng, 1900, 1949), int(rng, 2001, 2030)].map((y) => {
      const t = Math.floor((y % 100) / 10);
      const o = y % 10;
      const swapped = Math.floor(y / 100) * 100 + o * 10 + t;
      // tens before units (neunzehnhundertachtzigsechs), swapped digits, and for 2000+ the English pattern
      const tensFirst = o && t > 1 ? `${numberWord(Math.floor(y / 100))}hundert${TENS_WORD[t]}${numberWord(o)}` : yearWord(y + 2);
      const wrong = [y < 2000 ? tensFirst : `zwanzighundert${numberWord(y % 100)}`, yearWord(swapped !== y ? swapped : y + 1)];
      return choice(rng, { question: String(y), options: [yearWord(y), ...wrong] });
    }),
  });

  if (canSpeak) {
    ex.push({
      type: 'choice',
      title: 'Слушаем даты',
      instruction: 'Нажмите 🔊 и выберите дату.',
      layout: 'inline',
      items: distinct(rng, 4, anyDay, dayKey).map((x) =>
        choice(rng, {
          question: 'Wann?',
          audio: `${dateDat(x.d, x.m)}`,
          options: [dateText(x.d, x.m), dateText(x.d, (x.m + 1) % 12), dateText(x.d === 3 ? 13 : x.d + 10 > 28 ? x.d - 10 : x.d + 10, x.m), dateText(x.d, (x.m + 11) % 12)],
        }),
      ),
    });
  }
  return ex;
}

export const NUMBER_PLANS: Record<string, (ctx: Ctx) => Exercise[]> = {
  zahlen: numbersPlan,
  uhrzeit: clockPlan,
  datum: datePlan,
};
