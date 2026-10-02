import type { ArticleType } from '../../grammar/articles';
import type { Case, Gender, Noun } from '../../grammar/types';

export interface Activity {
  /** verb key, e.g. "aufstehen", "sich freuen" */
  v: string;
  /** complement (objects / adverbials), already inflected */
  c: string;
  ru: string;
  /** complement starts with the verb's governed preposition (denken an …) */
  prep?: boolean;
  /** …and the prepositional object is a person (→ "auf wen?" instead of "worauf?") */
  person?: boolean;
}

/** A clause without subject/time: [verb key, complement] */
export type Clause = [string, string];

export interface Pair {
  a: Clause;
  b: Clause;
}

export interface Frame {
  v: string;
  /** noun (looked up in the global noun list) */
  n: string;
  p?: string;
  /** explicit case when there is no fixed-case preposition */
  case?: Case;
  pre?: string;
  post?: string;
  arts?: ArticleType[];
  plural?: boolean;
}

export interface Spot {
  p: string;
  n: string;
}

export interface Thing {
  n: string;
  /** stellen/stehen (s) or legen/liegen (l) */
  pos: 's' | 'l';
}

export interface Theme {
  id: string;
  emoji: string;
  name: { ru: string; de: string; en: string };
  nouns: Noun[];
  acts: Activity[];
  times?: string[];
  pastTimes?: string[];
  /** a, weil b  /  b, deshalb a */
  causes: Pair[];
  /** a. Trotzdem b. */
  contras: Pair[];
  frames: Frame[];
  spots?: Spot[];
  things?: Thing[];
}

// ---- compact parsers ----

/** "g|de|pl|ru|en" per line; g: m/f/n, "*" = uncountable, "w" = weak masculine (oblique = plural) */
export function nouns(src: string): Noun[] {
  return src
    .trim()
    .split('\n')
    .map((line) => {
      const [gRaw, de, pl, ru, en] = line.trim().split('|');
      const g = gRaw.replace(/[*w]/g, '') as Exclude<Gender, 'pl'>;
      const n: Noun = { de, g, pl: pl === '-' ? null : pl, ru, en };
      if (gRaw.includes('*')) n.mass = true;
      if (gRaw.includes('w')) n.weak = pl;
      return n;
    });
}

/** "verb|complement|ru|flags" per line; flags: p = prepositional object, pp = …which is a person */
export function acts(src: string): Activity[] {
  return src
    .trim()
    .split('\n')
    .map((line) => {
      const [v, c, ru, flags = ''] = line.trim().split('|');
      const a: Activity = { v, c, ru };
      if (flags.startsWith('p')) a.prep = true;
      if (flags === 'pp') a.person = true;
      return a;
    });
}

/** "verb|c >> verb|c" per line */
export function pairs(src: string): Pair[] {
  return src
    .trim()
    .split('\n')
    .map((line) => {
      const [a, b] = line.split('>>').map((s) => s.trim().split('|') as Clause);
      return { a, b };
    });
}

/** "p:Noun" separated by commas */
export function spots(src: string): Spot[] {
  return src.split(',').map((s) => {
    const [p, n] = s.trim().split(':');
    return { p, n };
  });
}

/** "Noun:s" separated by commas */
export function things(src: string): Thing[] {
  return src.split(',').map((s) => {
    const [n, pos] = s.trim().split(':');
    return { n, pos: pos as 's' | 'l' };
  });
}
