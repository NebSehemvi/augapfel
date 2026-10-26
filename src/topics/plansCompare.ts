import { sample, shuffle, type Rng } from '../lib/rng';
import type { Ctx } from '../exercises/context';
import type { ChoiceItem, Exercise, FillItem } from '../exercises/types';
import * as B from '../exercises/builders';
import { ADJECTIVES, getAdjective, hasAdjective, type Adjective } from '../data/adjectives';

/*
 * "Vergleiche": so … wie (equal) and comparative + als (different), plus a little superlative.
 * Sentences come from frames below; mistakes on comparative forms go to Повторение as "c|alt".
 */

export const compKey = (a: Adjective) => `c|${a.base}`;

interface Frame {
  a: string;
  verb: string;
  adj: string;
  b: string;
  /** word that goes with the adjective: "Gitarre" (spielt besser Gitarre als …), "auf" (steht früher auf als …) */
  mid?: string;
  /** the word stands before "so … wie" in the equal form: "Ich trinke Tee so gern wie Kaffee." */
  midFirst?: boolean;
  /** a fact: only "-er als" is true (an Auto is faster than a bike) */
  fact?: boolean;
}

const FRAMES: Frame[] = [
  { a: 'Mein Bruder', verb: 'ist', adj: 'alt', b: 'ich' },
  { a: 'Anna', verb: 'ist', adj: 'groß', b: 'ihre Mutter' },
  { a: 'Tom', verb: 'ist', adj: 'jung', b: 'seine Kollegin' },
  { a: 'Die Jacke', verb: 'ist', adj: 'teuer', b: 'der Mantel' },
  { a: 'Das Hemd', verb: 'ist', adj: 'billig', b: 'das T-Shirt' },
  { a: 'Mein Zimmer', verb: 'ist', adj: 'klein', b: 'dein Zimmer' },
  { a: 'Der Film', verb: 'ist', adj: 'interessant', b: 'das Buch' },
  { a: 'Heute', verb: 'ist es', adj: 'warm', b: 'gestern' },
  { a: 'Lena', verb: 'läuft', adj: 'schnell', b: 'ihr Freund' },
  { a: 'Paul', verb: 'spielt', adj: 'gut', mid: 'Gitarre', b: 'Max' },
  { a: 'Ich', verb: 'trinke', adj: 'gern', mid: 'Tee', midFirst: true, b: 'Kaffee' },
  { a: 'Meine Schwester', verb: 'liest', adj: 'viel', b: 'ich' },
  { a: 'Der Bus', verb: 'ist', adj: 'langsam', b: 'die U-Bahn' },
  { a: 'Unsere Wohnung', verb: 'ist', adj: 'hell', b: 'eure Wohnung' },
  { a: 'Der Koffer', verb: 'ist', adj: 'schwer', b: 'die Tasche' },
  { a: 'Die Straße', verb: 'ist', adj: 'laut', b: 'der Hof' },
  { a: 'Mein Vater', verb: 'steht', adj: 'früh', mid: 'auf', b: 'meine Mutter' },
  { a: 'Ich', verb: 'arbeite', adj: 'lang', b: 'mein Kollege' },
  { a: 'Dieses Café', verb: 'ist', adj: 'gemütlich', b: 'das Restaurant' },
  { a: 'Der Kaffee hier', verb: 'ist', adj: 'gut', b: 'im Büro' },
  { a: 'Max', verb: 'kocht', adj: 'gut', b: 'seine Frau' },
  { a: 'Mein Handy', verb: 'ist', adj: 'alt', b: 'dein Handy' },
  { a: 'Wir', verb: 'gehen', adj: 'oft', mid: 'ins Kino', b: 'unsere Freunde' },
  { a: 'Ein Auto', verb: 'ist', adj: 'schnell', b: 'ein Fahrrad', fact: true },
  { a: 'Ein Elefant', verb: 'ist', adj: 'schwer', b: 'eine Katze', fact: true },
  { a: 'Der Winter', verb: 'ist', adj: 'kalt', b: 'der Sommer', fact: true },
  { a: 'Berlin', verb: 'ist', adj: 'groß', b: 'Hamburg', fact: true },
  { a: 'Die Zugspitze', verb: 'ist', adj: 'hoch', b: 'der Brocken', fact: true },
  { a: 'Im Juli', verb: 'ist es', adj: 'heiß', b: 'im April', fact: true },
];

type Rel = 'more' | 'equal';

/** The sentence with the comparison word replaced by `gap` (a gap index) or written out. */
function sentence(f: Frame, rel: Rel, opts: { adjGap?: number; wordGap?: number } = {}): (string | number)[] {
  const adj = getAdjective(f.adj);
  const form = rel === 'more' ? adj.comp : adj.base;
  const adjPart: (string | number)[] = opts.adjGap !== undefined ? [opts.adjGap] : [form];
  const word: (string | number)[] = opts.wordGap !== undefined ? [opts.wordGap] : [rel === 'more' ? 'als' : 'wie'];
  const mid = f.mid ? [` ${f.mid}`] : [];
  const parts: (string | number)[] =
    rel === 'more'
      ? [`${f.a} ${f.verb} `, ...adjPart, ...mid, ' ', ...word, ` ${f.b}.`]
      : f.midFirst
        ? [`${f.a} ${f.verb} ${f.mid} so `, ...adjPart, ' ', ...word, ` ${f.b}.`]
        : [`${f.a} ${f.verb} so `, ...adjPart, ...mid, ' ', ...word, ` ${f.b}.`];
  // join neighbouring strings
  return parts.reduce<(string | number)[]>((out, p) => {
    if (typeof p === 'string' && typeof out[out.length - 1] === 'string') out[out.length - 1] += p;
    else out.push(p);
    return out;
  }, []);
}

const text = (parts: (string | number)[]) => parts.join('');

/** All correct ways to write the comparison (the object may also stand before the adjective: "spielt Gitarre besser als"). */
function sentences(f: Frame, rel: Rel): string[] {
  const out = [text(sentence(f, rel))];
  if (f.mid && f.mid !== 'auf') {
    const adj = getAdjective(f.adj);
    out.push(rel === 'more' ? `${f.a} ${f.verb} ${f.mid} ${adj.comp} als ${f.b}.` : `${f.a} ${f.verb} ${f.mid} so ${adj.base} wie ${f.b}.`);
    if (rel === 'equal') out.push(`${f.a} ${f.verb} so ${adj.base} ${f.mid} wie ${f.b}.`);
  }
  return [...new Set(out)];
}

const relFor = (rng: Rng, f: Frame): Rel => (f.fact || rng() < 0.5 ? 'more' : 'equal');

/** Typical wrong comparatives: no umlaut (alter), doubled ending (älterer), "mehr alt", teuerer. */
export function wrongComparatives(a: Adjective): string[] {
  const out = [a.base + 'er', a.comp + 'er', `mehr ${a.base}`];
  if (a.base.endsWith('er')) out.push(a.base + 'er'); // teuerer
  return [...new Set(out)].filter((w) => w !== a.comp);
}

/** "alt → am ältesten" with wrong forms */
function superlativeItem(rng: Rng, a: Adjective): ChoiceItem {
  const right = `am ${a.sup}`;
  const noUmlaut = `am ${a.base}${/[sßzt]$/.test(a.base) ? 'esten' : 'sten'}`;
  const options = shuffle(rng, [...new Set([right, noUmlaut, `am ${a.comp}`, `am meisten ${a.base}`])]);
  return { question: `${a.base} → ?`, options, answer: options.indexOf(right) };
}

/** "Mein Bruder ist ___ als ich. (alt)" → älter */
const compFillItem = (f: Frame): FillItem => {
  const a = getAdjective(f.adj);
  return { parts: sentence(f, 'more', { adjGap: 0 }), answers: [[a.comp]], context: `(${a.base})`, srs: [compKey(a)], distractors: wrongComparatives(a) };
};

function comparePlan(ctx: Ctx): Exercise[] {
  const { rng } = ctx;
  const ex: Exercise[] = [];

  ex.push({
    type: 'choice',
    title: 'wie или als?',
    instruction: '«so … wie» — одинаково, «-er als» — больше или меньше.',
    layout: 'inline',
    items: sample(rng, FRAMES, 6).map((f) => {
      const rel = relFor(rng, f);
      const options = ['als', 'wie'];
      return { parts: sentence(f, rel, { wordGap: 0 }), options, answer: rel === 'more' ? 0 : 1 };
    }),
  });

  ex.push({
    type: 'fill',
    title: 'Сравнительная степень',
    instruction: 'Напишите прилагательное в сравнительной степени. Не забудьте умлаут: alt → älter.',
    items: sample(rng, FRAMES, 5).map(compFillItem),
  });

  ex.push(
    B.matchEx(
      'Особые формы',
      'Соедините прилагательное и его сравнительную степень.',
      sample(
        rng,
        ADJECTIVES.filter((a) => ['gut', 'viel', 'gern', 'hoch', 'nah', 'teuer', 'oft'].includes(a.base)),
        5,
      ).map((a) => [a.base, a.comp] as [string, string]),
    ),
  );

  ex.push(B.asBank(ctx, { type: 'fill', title: 'Выберите форму', instruction: '', items: sample(rng, FRAMES, 5).map(compFillItem) }));

  for (const f of sample(rng, FRAMES, 2)) {
    const rel = relFor(rng, f);
    ex.push({
      type: 'write',
      title: 'Напишите сравнение',
      instruction: 'Составьте предложение из частей.',
      item: {
        cues: [f.a, f.verb, f.adj + (f.mid ? ` (${f.mid})` : ''), f.b],
        task: rel === 'more' ? 'Больше или меньше: «-er als».' : 'Одинаково: «so … wie».',
        answers: sentences(f, rel),
        hint: `${getAdjective(f.adj).ru}`,
      },
    });
  }

  ex.push({
    type: 'choice',
    title: 'Превосходная степень',
    instruction: 'am + прилагательное + -sten: am schnellsten, am ältesten.',
    layout: 'list',
    items: sample(
      rng,
      ADJECTIVES.filter((a) => a.base !== 'oft'),
      4,
    ).map((a) => superlativeItem(rng, a)),
  });

  return ex;
}

/** Повторение of comparative forms: "alt → ___" */
export function reviewComparatives(keys: string[]): Exercise[] {
  const items: FillItem[] = keys
    .map((k) => k.split('|')[1])
    .filter(hasAdjective)
    .map((base) => {
      const a = getAdjective(base);
      return { parts: [`${a.base} → `, 0], answers: [[a.comp]], srs: [compKey(a)], hint: a.ru };
    });
  return items.length ? [{ type: 'fill', title: 'Повторение: сравнительная степень', instruction: 'Напишите сравнительную степень: alt → älter.', items: items.slice(0, 8) }] : [];
}

export const COMPARE_PLANS: Record<string, (ctx: Ctx) => Exercise[]> = { vergleiche: comparePlan };
