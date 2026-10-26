import type { Ctx, Act } from '../exercises/context';
import { pickActs, pickSubject, spec } from '../exercises/context';
import type { ChoiceItem, Exercise, FillItem } from '../exercises/types';
import { sortEx } from '../exercises/builders';
import { render, sentence, type ClauseSpec, type Chunk } from '../grammar/clause';
import { classifyNegation, placeNicht, type NegationClass } from '../grammar/negation';
import { cap, subjectLabel } from '../grammar/subjects';
import type { Case } from '../grammar/types';
import { ALL_NOUNS } from '../data/themes';
import { VERB_GOV } from '../data/verbGov';
import { getVerb } from '../data/verbs';
import { pick, scramble, shuffle } from '../lib/rng';

// Last-resort activities for themes with too few classifiable complements.
export const NICHT_CASES = [
  { v: 'kaufen', c: 'den Apfel' },
  { v: 'kommen', time: 'heute' },
  { v: 'fahren', c: 'nach Berlin', before: true },
  { v: 'sein', c: 'müde', before: true },
  { v: 'aufstehen', c: 'früh', before: true },
  { v: 'kennen', c: 'Anna' },
  { v: 'finden', c: 'meinen Schlüssel' },
  { v: 'arbeiten', time: 'heute' },
  { v: 'sprechen', c: 'schnell', before: true },
  { v: 'anrufen', c: 'meinen Bruder' },
] as const;

export function classifyAct(a: Act): NegationClass | null {
  if (a.verb.kind === 'modal') return null;
  const gov = VERB_GOV.get(a.v);
  const nounCase: Case | null = gov === 'N' ? 'nom' : gov === 'D' ? 'dat' : ['A', 'AI', 'DA'].includes(gov ?? '') ? 'akk' : null;
  const result = classifyNegation(a.c, ALL_NOUNS, nounCase);
  // Article-initial time phrases such as "die ganze Nacht" are not objects.
  if (result?.kind === 'nicht' && result.scope === 'clause' && a.c && !nounCase) return null;
  return result;
}

export interface NegationExample {
  positive: string;
  negative: string;
  chunks: Chunk[];
  classification: NegationClass;
  spec: ClauseSpec;
  hint: string;
  source: Act;
}

function example(ctx: Ctx, a: Act, classification: NegationClass, index: number): NegationExample {
  const subj = pickSubject(ctx);
  const mode = index % 3;
  const s = spec(a, subj, mode === 1 ? 'perf' : 'pres', {
    ...(mode === 2 ? { modal: getVerb('können') } : {}),
  });
  const positive = render(s, 'S');
  const negative = classification.kind === 'nicht'
    ? placeNicht(positive, classification.scope)
    : render({ ...s, c: classification.complement }, 'S');
  return { positive: sentence(positive), negative: sentence(negative), chunks: negative, classification, spec: s, hint: `${a.ru} · ${subjectLabel(subj)}`, source: a };
}

/** Both exercise families share the same classified thematic activity pool. */
export function negationExamples(ctx: Ctx): { nicht: NegationExample[]; kein: NegationExample[] } {
  const select = (kind: NegationClass['kind']) => pickActs(ctx, 6, (a) => classifyAct(a)?.kind === kind);
  const nichtActs = select('nicht');
  // Last resort only: pickActs first exhausts the theme and its general fallback pool.
  for (const x of NICHT_CASES) {
    if (nichtActs.length >= 6) break;
    if (nichtActs.some((a) => a.v === x.v)) continue;
    nichtActs.push({ v: x.v, c: 'c' in x ? x.c : '', ru: '', verb: getVerb(x.v) });
  }
  const nicht = nichtActs.map((a, i) => example(ctx, a, classifyAct(a)!, i));
  const kein = select('kein').map((a, i) => example(ctx, a, classifyAct(a)!, i));
  return { nicht, kein };
}

function gap(e: NegationExample): { parts: (string | number)[]; right: string } {
  const match = /\b(nicht|kein(?:e|en|em|er|es)?)\b/.exec(e.negative)!;
  return { parts: [e.negative.slice(0, match.index), 0, e.negative.slice(match.index + match[0].length)], right: match[0] };
}

function negationPlan(ctx: Ctx): Exercise[] {
  const { nicht, kein } = negationExamples(ctx);
  const choice = (parts: ChoiceItem['parts'], right: string, alternatives: string[]): ChoiceItem => {
    const options = shuffle(ctx.rng, [right, ...alternatives]);
    return { parts, options, answer: options.indexOf(right) };
  };
  const fills: FillItem[] = kein.map((e) => {
    const { parts, right } = gap(e);
    const c = e.classification;
    return { parts, answers: [[right]], hint: e.hint, context: c.kind === 'kein' ? `${c.case.toUpperCase()} · ${c.plural ? 'мн. ч.' : c.noun.g}` : undefined };
  });
  fills.push({ parts: ['Ich spreche mit ', 0, ' Mann.'], answers: [['keinem']], context: 'Dativ · m', hint: 'мужчина' });
  const choices = [...nicht.slice(0, 3), ...kein.slice(0, 3)].map((e) => {
    const { parts, right } = gap(e);
    return {
      ...choice(parts, right, [right === 'nicht' ? 'kein' : 'nicht']),
      hint: e.hint,
      explain: e.classification.kind === 'kein'
        ? 'Неопределённый артикль или существительное без артикля: kein с окончанием по роду и падежу.'
        : 'Определённое дополнение, признак или предложная группа: nicht.',
    };
  });
  const ex: Exercise[] = [
    { type: 'choice', title: 'nicht или kein?', instruction: 'Выберите отрицание в нейтральном смысле, без противопоставления.', layout: 'inline', items: shuffle(ctx.rng, choices) },
    { type: 'fill', title: 'Окончания kein', instruction: 'Впишите подходящую форму kein.', items: fills },
    sortEx('nicht или kein?', 'Каким словом выражено отрицание?', ['nicht', 'kein'], shuffle(ctx.rng, [
      ...nicht.slice(0, 3).map((e) => ({ text: e.negative, cat: 0 })),
      ...kein.slice(0, 3).map((e) => ({ text: e.negative, cat: 1 })),
    ])),
    { type: 'choice', title: 'ja / nein / doch', instruction: 'Ответ уже дан полностью. Выберите подходящее вводное слово.', layout: 'inline', items: [
      ['Kommst du nicht? — ', 'Doch', ', ich komme.'],
      ['Kommst du nicht? — ', 'Nein', ', ich komme nicht.'],
      ['Kommst du? — ', 'Ja', ', ich komme.'],
      ['Hast du kein Auto? — ', 'Doch', ', ich habe ein Auto.'],
      ['Hast du kein Auto? — ', 'Nein', ', ich habe kein Auto.'],
      ['Hast du ein Auto? — ', 'Ja', ', ich habe ein Auto.'],
    ].map(([a, right, b]) => {
      const options = shuffle(ctx.rng, ['Ja', 'Nein', 'Doch']);
      return { parts: [a, 0, b], options, answer: options.indexOf(right) };
    }) },
  ];
  // Parallel phrases keep corrections meaningful without combining arbitrary theme nouns.
  const corrections = [
    ['Ich fahre nicht nach Berlin, ', ' nach Bonn.'],
    ['Ich trinke keinen Kaffee, ', ' Tee.'],
    ['Das ist kein Apfel, ', ' eine Birne.'],
  ];
  // The selected pool has distinct verbs; look for a second complement for the same
  // thematic verb directly, rather than inventing an object it cannot take.
  const themed = kein.find((e) => ctx.theme.acts.some((a) => a.v === e.source.v && a.c !== e.source.c && classifyAct({ ...a, verb: getVerb(a.v) })?.kind === 'kein'));
  if (themed) {
    const other = pick(ctx.rng, ctx.theme.acts.filter((a) => a.v === themed.source.v && a.c !== themed.source.c && classifyAct({ ...a, verb: getVerb(a.v) })?.kind === 'kein'));
    const s = { ...themed.spec, tense: 'pres' as const, modal: undefined };
    const c = themed.classification;
    if (c.kind === 'kein') corrections[1] = [sentence(render({ ...s, c: c.complement }, 'S')).slice(0, -1) + ', ', ` ${other.c}.`];
  }
  ex.push({ type: 'choice', title: 'nicht / kein … sondern', instruction: 'Исправьте отрицаемую информацию: «не …, а …».', layout: 'inline', items: shuffle(ctx.rng, corrections).map(([a, b]) => choice([a, 0, b], 'sondern', ['aber', 'denn'])) });
  for (const e of nicht.slice(0, 3)) {
    const canonical = e.chunks.map((c) => c.text);
    const chunks = scramble(ctx.rng, canonical);
    const used = new Set<number>();
    const answer = canonical.map((text) => {
      const index = chunks.findIndex((c, i) => c === text && !used.has(i));
      used.add(index);
      return index;
    });
    ex.push({ type: 'order', title: 'Место nicht', instruction: `Начните с «${cap(canonical[0])}». Составьте нейтральное отрицательное предложение.`, item: { chunks, answers: [answer], fixedFirst: answer[0], punct: '.', hint: e.hint } });
  }
  for (const e of [nicht[3], nicht[4], kein[3]]) ex.push({ type: 'write', title: 'Скажите с отрицанием', instruction: 'Отрицайте предложение целиком, без противопоставления.', item: { cues: [e.positive], task: 'Сохраните начало и остальные слова; добавьте nicht или замените артикль на kein.', answers: [e.negative], hint: e.hint } });
  return ex;
}

export const NEGATION_PLANS: Record<string, (ctx: Ctx) => Exercise[]> = { negation: negationPlan };
