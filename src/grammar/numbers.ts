/*
 * German numbers, prices, clock times and dates as words.
 * Everything is lowercase and written together, as in German spelling ("dreihundertvierundzwanzig").
 */

const ONES = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'];
const TEENS = ['zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
const TENS = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];

/** 1–99 inside a bigger number: "ein" instead of "eins" before "und" (einundzwanzig). */
function under100(n: number): string {
  if (n < 10) return ONES[n];
  if (n < 20) return TEENS[n - 10];
  const t = TENS[Math.floor(n / 10)];
  const o = n % 10;
  return o ? `${o === 1 ? 'ein' : ONES[o]}und${t}` : t;
}

/** 0–9999 as a word: 1 → "eins", 21 → "einundzwanzig", 101 → "hunderteins", 1990 → "eintausendneunhundertneunzig". */
export function numberWord(n: number, opts: { ein?: boolean } = {}): string {
  if (!Number.isInteger(n) || n < 0 || n > 9999) throw new Error(`numberWord: ${n}`);
  if (n === 0) return 'null';
  const th = Math.floor(n / 1000);
  const h = Math.floor((n % 1000) / 100);
  const rest = n % 100;
  // "hundert" / "tausend" without "ein" is the everyday form; opts.ein gives "einhundert"
  const lead = (k: number, word: string) => (k ? (k === 1 ? (opts.ein ? 'ein' : '') : under100(k)) + word : '');
  return lead(th, 'tausend') + lead(h, 'hundert') + (rest ? under100(rest) : '');
}

/** All accepted spellings of a number: with and without "ein" before hundert/tausend. */
export function numberWords(n: number): string[] {
  return [...new Set([numberWord(n), numberWord(n, { ein: true })])];
}

/** Years: 1100–1999 are said in hundreds (neunzehnhundertneunundachtzig), others like numbers (zweitausendvierundzwanzig). */
export function yearWord(y: number): string {
  if (y >= 1100 && y < 2000) return under100(Math.floor(y / 100)) + 'hundert' + (y % 100 ? under100(y % 100) : '');
  return numberWord(y, { ein: true });
}

// ---------------------------------------------------------------------------
// prices

/** 3.49 → "3,49 €" */
export const priceText = (cents: number) => `${Math.floor(cents / 100)},${String(cents % 100).padStart(2, '0')} €`;

/** 349 → "drei Euro neunundvierzig"; 100 → "ein Euro"; 50 → "fünfzig Cent" */
export function priceWord(cents: number): string {
  const e = Math.floor(cents / 100);
  const c = cents % 100;
  if (!e) return `${numberWord(c)} Cent`;
  const euros = `${e === 1 ? 'ein' : numberWord(e)} Euro`;
  return c ? `${euros} ${under100(c)}` : euros;
}

// ---------------------------------------------------------------------------
// clock

/** "15:30" */
export const clockText = (h: number, m: number) => `${h}:${String(m).padStart(2, '0')}`;

/** Official time: 15:30 → "fünfzehn Uhr dreißig", 1:00 → "ein Uhr". */
export function formalTime(h: number, m: number): string {
  const hours = h === 1 ? 'ein' : numberWord(h);
  return m ? `${hours} Uhr ${numberWord(m)}` : `${hours} Uhr`;
}

/** The hour as said in everyday time (1–12): 13 → "eins", 0 → "zwölf". */
const hour12 = (h: number) => numberWord(((h + 11) % 12) + 1);

/**
 * Everyday time for minutes in 5-minute steps: "Viertel nach drei", "halb vier" (= 3:30!), "zehn vor vier".
 * :20 / :40 also have the "zehn vor/nach halb" variants — they come second.
 */
export function informalTimes(h: number, m: number): string[] {
  if (m % 5) throw new Error(`informalTimes: ${m}`);
  const now = hour12(h);
  const next = hour12(h + 1);
  switch (m) {
    case 0:
      return [now];
    case 15:
      return [`Viertel nach ${now}`];
    case 30:
      return [`halb ${next}`];
    case 45:
      return [`Viertel vor ${next}`];
    case 20:
      return [`zwanzig nach ${now}`, `zehn vor halb ${next}`];
    case 25:
      return [`fünf vor halb ${next}`];
    case 35:
      return [`fünf nach halb ${next}`];
    case 40:
      return [`zwanzig vor ${next}`, `zehn nach halb ${next}`];
    default:
      return m < 30 ? [`${numberWord(m)} nach ${now}`] : [`${numberWord(60 - m)} vor ${next}`];
  }
}

export const informalTime = (h: number, m: number) => informalTimes(h, m)[0];

// ---------------------------------------------------------------------------
// dates

export const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

/** Ordinal stem: 1 → "erst", 3 → "dritt", 7 → "siebt", 8 → "acht", 20 → "zwanzigst". */
export function ordinalStem(n: number): string {
  if (n === 1) return 'erst';
  if (n === 3) return 'dritt';
  if (n === 7) return 'siebt';
  if (n === 8) return 'acht';
  return numberWord(n) + (n < 20 ? 't' : 'st');
}

/** "der dritte Mai" (Heute ist …) / "am dritten Mai" (Wann …?) */
export const dateNom = (d: number, month: number) => `der ${ordinalStem(d)}e ${MONTHS[month]}`;
export const dateDat = (d: number, month: number) => `am ${ordinalStem(d)}en ${MONTHS[month]}`;

/** "3.5." */
export const dateText = (d: number, month: number) => `${d}.${month + 1}.`;
