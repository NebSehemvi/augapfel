import { chance, int, pick, sample, scramble, shuffle } from '../lib/rng';
import type { Chunk, ClauseSpec, Order, Tense } from '../grammar/clause';
import { clauseTexts, joinChunks, punctFor, render, renderAll, sentence, subFirst, mainSub, verbParts } from '../grammar/clause';
import { REFL_AKK, praeteritum, present } from '../grammar/conjugate';
import { getVerb, verbKey } from '../data/verbs';
import type { Person, Subject, Verb } from '../grammar/types';
import { cap, NAMED, PRONOUNS, subjectLabel } from '../grammar/subjects';
import type { ArticleType } from '../grammar/articles';
import { article, contract, GENDER_ART, nounForm, prepCase } from '../grammar/articles';
import { getNoun, getTheme } from '../data/themes';
import type { Frame, Pair } from '../data/themes/types';
import type { Ctx, Act } from './context';
import { clauseAct, MODALS, pickActs, pickSubject, pickSubjects, pickTime, pickTimes, spec, TENSE_LABEL } from './context';
import type { ChoiceItem, Exercise, FillItem, FormsItem, OrderItem, Seg } from './types';
import { ALL_PREPS, daForm, findPrepVerb, woForm } from '../data/prepVerbs';

// ---------------------------------------------------------------------------
// helpers

export const verbLabel = (v: Verb) => (v.refl ? 'sich ' : '') + v.inf;

export const srsKey = {
  pres: (v: Verb) => `v|${verbKey(v)}|pres`,
  praet: (v: Verb) => `v|${verbKey(v)}|praet`,
  pp: (v: Verb) => `v|${verbKey(v)}|pp`,
  aux: (v: Verb) => `v|${verbKey(v)}|aux`,
  gender: (n: string) => `n|${n}|g`,
  plural: (n: string) => `n|${n}|pl`,
  prep: (verb: string, prep: string) => `p|${verb}|${prep}`,
};

/** Shape of Partizip II: 0 = ge…t/ge…en, 1 = prefix-ge-… (aufgestanden), 2 = without ge- (besucht, studiert); null = other */
export function ppType(v: Verb): 0 | 1 | 2 | null {
  const pp = v.pp[0];
  if (v.kind === 'modal' || v.kind === 'aux' || /^ge/.test(v.base)) return null;
  if (v.sep) return v.sep.endsWith(' ') ? null : pp.startsWith(v.sep + 'ge') ? 1 : null;
  return pp.startsWith('ge') ? 0 : 2;
}

const irregularPres = (v: Verb) => !!(v.presDuEr || v.presFull);
const irregularPraet = (v: Verb) => v.kind !== 'weak';

/** Build gap parts from chunks; gapOf returns gap index for a chunk or -1. */
function partsFrom(chunks: Chunk[], gapOf: (c: Chunk) => number, punct: string, lead = ''): Seg[] {
  const parts: Seg[] = [];
  let buf = lead;
  chunks.forEach((c, i) => {
    const g = gapOf(c);
    const text = i === 0 && !lead ? cap(c.text) : c.text;
    if (g >= 0) {
      parts.push(buf + (buf && !buf.endsWith(' ') ? ' ' : ''));
      parts.push(g);
      buf = ' ';
    } else {
      buf += (buf && !buf.endsWith(' ') ? ' ' : '') + text;
    }
  });
  parts.push(buf + punct);
  return parts.filter((p) => p !== '');
}

function orderItemFrom(ctx: Ctx, variants: Chunk[][], opts: { fixFirst?: boolean; hint?: string; punct: string; solution?: string }): OrderItem {
  const canon = variants[0];
  const perm = scramble(ctx.rng, canon.map((_, i) => i));
  const chunks = perm.map((i) => canon[i].text);
  const toIdx = (seq: Chunk[]): number[] | null => {
    const used = new Set<number>();
    const out: number[] = [];
    for (const c of seq) {
      const k = chunks.findIndex((t, j) => t === c.text && !used.has(j));
      if (k < 0) return null;
      used.add(k);
      out.push(k);
    }
    return out.length === chunks.length ? out : null;
  };
  let answers = variants.map(toIdx).filter((x): x is number[] => !!x);
  let fixedFirst: number | undefined;
  if (opts.fixFirst) {
    fixedFirst = answers[0][0];
    answers = answers.filter((a) => a[0] === fixedFirst);
  }
  const uniq = [...new Map(answers.map((a) => [a.join(','), a])).values()];
  return { chunks, answers: uniq, fixedFirst, punct: opts.punct, hint: opts.hint, solution: opts.solution };
}

function pickOrder(ctx: Ctx, order: 'S' | 'T' | 'mix', hasTime: boolean): Order {
  if (!hasTime) return 'S';
  if (order === 'mix') return chance(ctx.rng, 0.5) ? 'T' : 'S';
  return order;
}

function pickModal(ctx: Ctx, tense: Tense): Verb {
  const pool = tense === 'praet' ? MODALS.filter((m) => m !== 'möchten') : MODALS;
  return getVerb(pick(ctx.rng, pool));
}

/** Present/Präteritum/Perfekt "answer" form for tables: "stehe auf", "freue mich", "bin aufgestanden" */
export function tableForm(v: Verb, p: Person, tense: Tense): string[] {
  const refl = v.refl ? ' ' + REFL_AKK[p] : '';
  if (tense === 'perf') {
    return v.aux.map((a) => `${present(getVerb(a), p)}${refl} ${v.pp[0]}`);
  }
  const fins = tense === 'praet' ? praeteritum(v, p) : [present(v, p)];
  return fins.map((f) => `${f}${refl}${v.sep ? ' ' + v.sep.trim() : ''}`);
}

export const PERSON_LABELS = ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie/Sie'];

// ---------------------------------------------------------------------------
// verb forms in sentences

interface FillVerbOpts {
  tense: Tense;
  n?: number;
  pred?: (a: Act) => boolean;
  modal?: boolean;
  order?: 'S' | 'T' | 'mix';
  title?: string;
  instruction?: string;
}

export function fillVerb(ctx: Ctx, o: FillVerbOpts): Exercise {
  const n = o.n ?? 5;
  const acts = pickActs(ctx, n, o.pred);
  const subjects = pickSubjects(ctx, n);
  const items: FillItem[] = acts.map((act, i) => {
    const subj = subjects[i];
    const time = chance(ctx.rng, 0.75) ? pickTime(ctx, o.tense) : undefined;
    const order = pickOrder(ctx, o.order ?? 'mix', !!time);
    const modal = o.modal ? pickModal(ctx, o.tense) : undefined;
    const s = spec(act, subj, o.tense, { time, modal });
    const parts = verbParts(s);
    const chunks = render(s, order);
    const gapEnd = !modal && (o.tense === 'perf' || !!act.verb.sep);
    const answers: string[][] = [parts.finite];
    const srs: (string | undefined)[] = [];
    if (modal) srs.push(undefined);
    else if (o.tense === 'perf') srs.push(srsKey.aux(act.verb));
    else if (o.tense === 'praet') srs.push(irregularPraet(act.verb) ? srsKey.praet(act.verb) : undefined);
    else srs.push(irregularPres(act.verb) ? srsKey.pres(act.verb) : undefined);
    if (gapEnd) {
      answers.push(o.tense === 'perf' ? act.verb.pp : [parts.end!]);
      srs.push(o.tense === 'perf' && irregularPraet(act.verb) ? srsKey.pp(act.verb) : undefined);
    }
    const hintVerb = modal ? `${modal.inf} + ${verbLabel(act.verb)}` : verbLabel(act.verb);
    return {
      parts: partsFrom(chunks, (c) => (c.role === 'fin' ? 0 : gapEnd && c.role === 'end' ? 1 : -1), '.'),
      answers,
      hint: subj.hint ? `${hintVerb}; ${subjectLabel(subj)}` : hintVerb,
      srs,
    };
  });
  return {
    type: 'fill',
    title: o.title ?? `${TENSE_LABEL[o.tense]}: вставьте глагол`,
    instruction: o.instruction ?? 'Вставьте глагол в правильной форме.',
    items,
  };
}

export function choiceVerbForm(ctx: Ctx, o: { tense: Tense; n?: number; pred?: (a: Act) => boolean; title?: string }): Exercise {
  const n = o.n ?? 5;
  const acts = pickActs(ctx, n, o.pred);
  const subjects = pickSubjects(ctx, n);
  const items: ChoiceItem[] = acts.map((act, i) => {
    const subj = subjects[i];
    const time = chance(ctx.rng, 0.5) ? pickTime(ctx, o.tense) : undefined;
    const s = spec(act, subj, o.tense, { time });
    const chunks = render(s, pickOrder(ctx, 'mix', !!time));
    const right = verbParts(s).finite[0];
    const all = [0, 1, 2, 3, 4, 5].map((p) => (o.tense === 'praet' ? praeteritum(act.verb, p as Person)[0] : present(act.verb, p as Person)));
    const wrong = shuffle(ctx.rng, [...new Set(all)].filter((f) => f !== right)).slice(0, 3);
    const options = shuffle(ctx.rng, [right, ...wrong]);
    return {
      parts: partsFrom(chunks, (c) => (c.role === 'fin' ? 0 : -1), '.'),
      options,
      answer: options.indexOf(right),
      hint: subj.hint ? `${verbLabel(act.verb)}; ${subjectLabel(subj)}` : verbLabel(act.verb),
      srs: irregularPres(act.verb) && o.tense === 'pres' ? srsKey.pres(act.verb) : undefined,
    };
  });
  return {
    type: 'choice',
    title: o.title ?? 'Выберите форму глагола',
    instruction: 'Выберите правильную форму.',
    items,
    layout: 'inline',
  };
}

export function conjEx(ctx: Ctx, v: Verb, tense: Tense = 'pres'): Exercise {
  const given = int(ctx.rng, 6);
  return {
    type: 'conj',
    title: `Спряжение: ${verbLabel(v)}`,
    instruction: `Заполните таблицу (${TENSE_LABEL[tense]}).`,
    verb: verbLabel(v),
    tense: TENSE_LABEL[tense],
    rows: PERSON_LABELS.map((label, p) => ({
      label,
      answers: tableForm(v, p as Person, tense),
      given: p === given,
    })),
    srs: tense === 'praet' && irregularPraet(v) ? srsKey.praet(v) : tense === 'pres' && irregularPres(v) ? srsKey.pres(v) : undefined,
  };
}

// ---------------------------------------------------------------------------
// word order

interface OrderOpts {
  tense: Tense;
  order: Order;
  modal?: boolean;
  fixFirst?: boolean;
  pred?: (a: Act) => boolean;
  withTime?: boolean;
  title?: string;
  instruction?: string;
  lead?: string;
}

export function orderEx(ctx: Ctx, o: OrderOpts): Exercise {
  const [act] = pickActs(ctx, 1, o.pred);
  const question = o.order === 'Y' || o.order === 'W';
  // questions are asked to someone else: no "ich"/"wir"
  const subj = pickSubject(ctx, question ? { exclude: [PRONOUNS[0], PRONOUNS[4]] } : {});
  const needsTime = o.order === 'T' || o.withTime !== false;
  const time = needsTime ? pickTime(ctx, o.tense) : undefined;
  const modal = o.modal ? pickModal(ctx, o.tense) : undefined;
  const s = spec(act, subj, o.tense, { time, modal, lead: o.lead });
  let variants = renderAll(s, o.order);
  // For plain statements accept both subject-first and time-first unless the start is fixed.
  if (o.order === 'S' && !o.fixFirst && time) variants = [...variants, ...renderAll(s, 'T')];
  const hint = [act.ru, TENSE_LABEL[o.tense], modal ? modal.inf : ''].filter(Boolean).join(' · ');
  return {
    type: 'order',
    title: o.title ?? 'Порядок слов',
    instruction: o.instruction ?? (o.fixFirst ? 'Составьте предложение. Первый элемент уже стоит на месте.' : 'Составьте предложение.'),
    item: orderItemFrom(ctx, variants, { fixFirst: o.fixFirst, hint, punct: punctFor(o.order) }),
  };
}

export const MAIN_COLUMNS = ['Позиция 1', 'Глагол', 'Середина', 'Конец'];
export const SUB_COLUMNS = ['Союз', 'Подлежащее', 'Середина', 'Конец (глаголы)'];

export function tableEx(ctx: Ctx, o: { tense: Tense; order: 'S' | 'T' | 'SUB'; modal?: boolean; pred?: (a: Act) => boolean; lead?: string; title?: string }): Exercise {
  const [act] = pickActs(ctx, 1, o.pred);
  const subj = pickSubject(ctx);
  const time = pickTime(ctx, o.tense);
  const modal = o.modal ? pickModal(ctx, o.tense) : undefined;
  const s = spec(act, subj, o.tense, { time, modal, lead: o.lead ?? 'weil' });
  const chunks = render(s, o.order);
  const colOf: Record<string, number> = o.order === 'SUB' ? { K: 0, P1: 1, M: 2, E: 3 } : { P1: 0, V: 1, M: 2, E: 3 };
  return {
    type: 'table',
    title: o.title ?? 'Таблица: позиции в предложении',
    instruction:
      o.order === 'SUB'
        ? 'Разложите придаточное предложение по колонкам.'
        : 'Разложите части предложения по колонкам. Глагол всегда на 2-й позиции!',
    columns: o.order === 'SUB' ? SUB_COLUMNS : MAIN_COLUMNS,
    item: {
      chunks: shuffle(
        ctx.rng,
        chunks.map((c, i) => ({ text: i === 0 ? cap(c.text) : c.text, col: colOf[c.slot] })),
      ),
      hint: o.order === 'SUB' ? joinChunks(chunks) : sentence(chunks, '.'),
    },
  };
}

export function writeEx(
  ctx: Ctx,
  o: { tense: Tense; start?: 'time' | 'subj'; modal?: boolean; pred?: (a: Act) => boolean; title?: string },
): Exercise {
  const [act] = pickActs(ctx, 1, o.pred);
  const subj = pickSubject(ctx);
  const time = pickTime(ctx, o.tense);
  const modal = o.modal ? pickModal(ctx, o.tense) : undefined;
  const s = spec(act, subj, o.tense, { time, modal });
  const answers =
    o.start === 'time' ? clauseTexts(s, 'T') : o.start === 'subj' ? clauseTexts(s, 'S') : [...clauseTexts(s, 'S'), ...clauseTexts(s, 'T')];
  const verbCue = `${act.c ? act.c + ' ' : ''}${verbLabel(act.verb)}`;
  const task = [
    TENSE_LABEL[o.tense],
    modal ? `с глаголом «${modal.inf}»` : '',
    o.start === 'time' ? `начните с «${cap(time)}»` : o.start === 'subj' ? `начните с «${cap(subj.de)}»` : '',
  ]
    .filter(Boolean)
    .join(', ');
  return {
    type: 'write',
    title: o.title ?? 'Напишите предложение',
    instruction: 'Напишите предложение из данных частей.',
    item: { cues: [subjectLabel(subj), time, verbCue], task: cap(task) + '.', answers, hint: act.ru },
  };
}

/** Which of the sentences is correct? */
export function choiceCorrectOrder(ctx: Ctx, o: { tense: Tense; order: 'T' | 'SUB' | 'S'; n?: number; modal?: boolean; lead?: string }): Exercise {
  const n = o.n ?? 3;
  const acts = pickActs(ctx, n, (a) => !!a.c);
  const items: ChoiceItem[] = acts.map((act) => {
    const subj = pickSubject(ctx);
    const time = pickTime(ctx, o.tense);
    const modal = o.modal ? pickModal(ctx, o.tense) : undefined;
    const s = spec(act, subj, o.tense, { time, modal, lead: o.lead });
    const right = render(s, o.order);
    const wrongs = wrongOrders(right, o.order).map((w) => sentence(w, '.'));
    const rightText = o.order === 'SUB' ? joinChunks(right) + '.' : sentence(right, '.');
    const options = shuffle(ctx.rng, [rightText, ...sample(ctx.rng, [...new Set(wrongs)].filter((w) => w !== rightText), 2)]);
    return { question: act.ru, options, answer: options.indexOf(rightText) };
  });
  return {
    type: 'choice',
    title: 'Какой вариант правильный?',
    instruction: 'Выберите предложение с правильным порядком слов.',
    items,
    layout: 'list',
  };
}

function wrongOrders(right: Chunk[], order: Order): Chunk[][] {
  const idx = (role: string) => right.findIndex((c) => c.role === role);
  const without = (...roles: string[]) => right.filter((c) => !roles.includes(c.role));
  const fin = right[idx('fin')];
  const subj = right[idx('subj')];
  const end = idx('end') >= 0 ? right[idx('end')] : null;
  const out: Chunk[][] = [];
  if (order === 'T') {
    const time = right[0];
    // no inversion: Am Abend ich habe …
    const rest = without('time', 'fin', 'subj');
    out.push([time, subj, fin, ...rest]);
    // verb at the end: Am Abend ich … habe
    out.push([time, subj, ...rest, fin]);
    if (end) out.push([time, fin, subj, end, ...without('time', 'fin', 'subj', 'end')]);
  } else if (order === 'S') {
    const rest = without('subj', 'fin');
    out.push([subj, ...rest, fin]);
    if (end) out.push([subj, fin, end, ...without('subj', 'fin', 'end')]);
    out.push([fin, subj, ...rest]);
  } else if (order === 'SUB') {
    const conj = right[0];
    const verbs = right.filter((c) => c.slot === 'E');
    const mid = right.filter((c) => c.slot === 'M' || c.slot === 'P1');
    // main-clause order inside a subordinate clause
    const finite = verbs[verbs.length - 1];
    const nonfin = verbs.slice(0, -1);
    out.push([conj, mid[0], finite, ...mid.slice(1), ...nonfin]);
    out.push([conj, finite, ...mid, ...nonfin]);
    if (nonfin.length) out.push([conj, ...mid, finite, ...nonfin]);
  }
  return out;
}

export function snakeEx(ctx: Ctx, o: { tense: Tense; n?: number; modal?: boolean }): Exercise {
  const n = o.n ?? 3;
  const acts = pickActs(ctx, n, (a) => !!a.c);
  const sentences = acts.map((act) => {
    const time = pickTime(ctx, o.tense);
    const s = spec(act, pickSubject(ctx), o.tense, { time, modal: o.modal ? pickModal(ctx, o.tense) : undefined });
    return sentence(render(s, chance(ctx.rng, 0.6) ? 'T' : 'S'));
  });
  return {
    type: 'snake',
    title: 'Змейка из слов',
    instruction: 'Найдите слова: нажимайте между буквами, чтобы разделить их.',
    sentences,
  };
}

/** "Was machst du am Abend?" ↔ "Ich backe einen Kuchen." */
export function matchQA(ctx: Ctx, tense: Tense, n = 4): Exercise {
  const acts = pickActs(ctx, n, (a) => !!a.c && !a.verb.refl);
  const times = pickTimes(ctx, tense, n);
  const askers: Subject[] = shuffle(ctx.rng, [PRONOUNS[1], PRONOUNS[5], ...sample(ctx.rng, NAMED.filter((s) => s.person === 2), 2)]);
  const machen = getVerb('machen');
  const pairs: [string, string][] = acts.map((act, i) => {
    const asker = askers[i % askers.length];
    const answerer = answerSubject(asker);
    const q = sentence(render({ subj: asker, verb: machen, tense, time: times[i], lead: 'Was' }, 'W'), '?');
    // answer repeats the time (with inversion) so that every pair is unambiguous
    const a = sentence(render(spec(act, answerer, tense, { time: times[i] }), 'T'));
    return [q, a];
  });
  return {
    type: 'match',
    title: 'Вопрос — ответ',
    instruction: 'Соедините вопросы и ответы.',
    pairs,
  };
}

function answerSubject(asker: Subject): Subject {
  if (asker.person === 1) return PRONOUNS[0];
  if (asker.person === 4) return PRONOUNS[4];
  if (asker.de === 'Sie') return PRONOUNS[0];
  if (!asker.pronoun) {
    const female = /^(Anna|Lena|Frau|meine Schwester)/.test(asker.de);
    if (asker.person === 2) return female ? PRONOUNS[3] : PRONOUNS[2];
    return PRONOUNS[6];
  }
  return asker;
}

// ---------------------------------------------------------------------------
// Perfekt & verb forms

export function choiceAux(ctx: Ctx, n = 6): Exercise {
  // balance haben / sein verbs
  const sein = pickActs(ctx, Math.ceil(n / 2), (a) => a.verb.aux.length === 1 && a.verb.aux[0] === 'sein');
  const haben = pickActs(ctx, n - sein.length, (a) => a.verb.aux.length === 1 && a.verb.aux[0] === 'haben' && a.v !== 'sein');
  const items: ChoiceItem[] = shuffle(ctx.rng, [...sein, ...haben]).map((act) => {
    const subj = pickSubject(ctx);
    const time = pickTime(ctx, 'perf');
    const s = spec(act, subj, 'perf', { time });
    const chunks = render(s, chance(ctx.rng, 0.5) ? 'T' : 'S');
    const right = verbParts(s).finite[0];
    const options = [present(getVerb('haben'), subj.person), present(getVerb('sein'), subj.person)];
    return {
      parts: partsFrom(chunks, (c) => (c.role === 'fin' ? 0 : -1), '.'),
      options,
      answer: options.indexOf(right),
      hint: subj.hint ? subjectLabel(subj) : undefined,
      srs: srsKey.aux(act.verb),
    };
  });
  return {
    type: 'choice',
    title: 'haben или sein?',
    instruction: 'Выберите вспомогательный глагол.',
    items,
    layout: 'inline',
  };
}

export type FormField = 'pres3' | 'praet' | 'pp' | 'aux';

const FORM_LABEL: Record<FormField, string> = { pres3: 'er/sie/es (Präsens)', praet: 'Präteritum (er)', pp: 'Partizip II', aux: 'haben / sein' };

export function formsItem(v: Verb, fields: FormField[]): FormsItem {
  const withSep = (x: string) => x + (v.sep ? ' ' + v.sep.trim() : '');
  return {
    prompt: verbLabel(v),
    sub: v.ru,
    fields: fields.map((f) => ({
      label: FORM_LABEL[f],
      answers: f === 'pres3' ? [withSep(present(v, 2))] : f === 'praet' ? praeteritum(v, 2).map(withSep) : f === 'pp' ? v.pp : v.aux,
      srs: srsKey[f === 'pres3' ? 'pres' : f](v),
    })),
  };
}

export function formsEx(verbs: Verb[], fields: FormField[], title = 'Формы глаголов'): Exercise {
  return {
    type: 'forms',
    title,
    instruction: 'Напишите формы глагола.',
    items: verbs.map((v) => formsItem(v, fields)),
  };
}

/** Theme verbs matching pred, for form drills. */
export function themeVerbs(ctx: Ctx, n: number, pred: (v: Verb) => boolean): Verb[] {
  const acts = pickActs(ctx, 40, (a) => pred(a.verb));
  const seen = new Set<string>();
  const out: Verb[] = [];
  for (const a of acts) {
    const k = verbKey(a.verb);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(a.verb);
    if (out.length >= n) break;
  }
  return out;
}

/** Turn a single-gap fill/choice exercise into a drag-from-bank exercise. */
export function asBank(ctx: Ctx, ex: Exercise, distractors = 2): Exercise {
  if (ex.type === 'fill') {
    const items = ex.items.filter((i) => i.answers.length === 1);
    return {
      type: 'bank',
      title: ex.title,
      instruction: 'Перетащите слова из банка в пропуски (или нажмите на слово, а потом на пропуск).',
      items: items.map((i) => ({ parts: i.parts, answers: i.answers[0], hint: i.hint, srs: i.srs?.[0] })),
      bank: shuffle(ctx.rng, items.map((i) => i.answers[0][0])),
    };
  }
  if (ex.type === 'choice') {
    const items = ex.items.filter((i) => i.parts);
    const answers = items.map((i) => i.options[i.answer]);
    const extra = shuffle(ctx.rng, [...new Set(items.flatMap((i) => i.options))].filter((o) => !answers.includes(o))).slice(0, distractors);
    return {
      type: 'bank',
      title: ex.title,
      instruction: 'Перетащите слова из банка в пропуски (или нажмите на слово, а потом на пропуск).',
      items: items.map((i) => ({ parts: i.parts!, answers: [i.options[i.answer]], hint: i.hint, srs: i.srs })),
      bank: shuffle(ctx.rng, [...answers, ...extra]),
    };
  }
  return ex;
}

export function sortEx(title: string, instruction: string, categories: string[], items: { text: string; cat: number; srs?: string }[]): Exercise {
  return { type: 'sort', title, instruction, categories, items };
}

export function matchEx(title: string, instruction: string, pairs: [string, string][]): Exercise {
  return { type: 'match', title, instruction, pairs };
}

// ---------------------------------------------------------------------------
// nouns & articles

export function themeNouns(ctx: Ctx, n: number, pred: (x: ReturnType<typeof getNoun>) => boolean = () => true) {
  return sample(ctx.rng, ctx.theme.nouns.filter(pred), n);
}

export function choiceGender(ctx: Ctx, n = 8): Exercise {
  const nouns = themeNouns(ctx, n);
  return {
    type: 'choice',
    title: 'der, die или das?',
    instruction: 'Выберите артикль.',
    layout: 'inline',
    items: nouns.map((x) => {
      const options = ['der', 'die', 'das'];
      return {
        parts: [0, ` ${x.de}`],
        options,
        answer: options.indexOf(GENDER_ART[x.g as 'm' | 'f' | 'n']),
        hint: x.ru,
        srs: srsKey.gender(x.de),
      };
    }),
  };
}

export function fillPlural(ctx: Ctx, n = 5): Exercise {
  const nouns = themeNouns(ctx, n, (x) => !!x.pl && x.pl !== x.de);
  return {
    type: 'fill',
    title: 'Множественное число',
    instruction: 'Напишите форму множественного числа.',
    items: nouns.map((x) => ({
      parts: [`${GENDER_ART[x.g as 'm' | 'f' | 'n']} ${x.de} → die `, 0],
      answers: [[x.pl!]],
      hint: x.ru,
      srs: [srsKey.plural(x.de)],
    })),
  };
}

const ART_OPTIONS: Record<Exclude<ArticleType, 'none'>, string[]> = {
  def: ['der', 'die', 'das', 'den', 'dem'],
  indef: ['ein', 'eine', 'einen', 'einem', 'einer'],
  kein: ['kein', 'keine', 'keinen', 'keinem', 'keiner'],
  mein: ['mein', 'meine', 'meinen', 'meinem', 'meiner'],
};
const ART_HINT: Record<Exclude<ArticleType, 'none'>, string> = { def: 'der/die/das', indef: 'ein/eine', kein: 'kein', mein: 'mein' };

/** A sentence from a frame with a gap at the article. */
export function frameItem(ctx: Ctx, f: Frame): { parts: Seg[]; form: string; options: string[]; hint: string; noun: string } {
  const noun = getNoun(f.n);
  const plural = !!f.plural;
  let arts: ArticleType[] = f.arts ?? (noun.mass || plural ? ['def'] : f.v === 'haben' ? ['indef', 'kein'] : ['def', 'indef']);
  if (plural) arts = arts.filter((a) => a !== 'indef');
  let art = pick(ctx.rng, arts) as Exclude<ArticleType, 'none'>;
  if (f.p && art === 'def' && contract(f.p, article('def', noun.g, prepCase(f.p) ?? f.case ?? 'dat'))) art = 'mein';
  const c = f.p ? prepCase(f.p) ?? f.case ?? 'dat' : f.case ?? 'akk';
  const form = article(art, plural ? 'pl' : noun.g, c);
  const GAP = '\u0000';
  const comp = [f.pre, f.p, GAP, nounForm(noun, c, plural), f.post].filter(Boolean).join(' ');
  const subj = pickSubject(ctx, { pronounsOnly: true });
  const verb = getVerb(f.v);
  const text = sentence(render({ subj, verb, c: comp, tense: 'pres' }, 'S'));
  const [before, after] = text.split(GAP);
  return {
    parts: [before, 0, after],
    form,
    options: shuffle(ctx.rng, ART_OPTIONS[art]),
    hint: `${ART_HINT[art]}; ${noun.ru}${plural ? ' (мн. ч.)' : ''}`,
    noun: noun.de,
  };
}

export function framesEx(ctx: Ctx, pred: (f: Frame) => boolean, mode: 'fill' | 'choice', n: number, title: string, instruction: string): Exercise {
  let frames = ctx.theme.frames.filter(pred);
  if (frames.length < n) {
    // top up from other themes
    const extra = ['family', 'food', 'work', 'leisure', 'school'].flatMap((id) => (id === ctx.theme.id ? [] : getTheme(id).frames.filter(pred)));
    frames = [...shuffle(ctx.rng, frames), ...shuffle(ctx.rng, extra)];
  } else frames = shuffle(ctx.rng, frames);
  const chosen = frames.slice(0, n);
  const items = chosen.map((f) => frameItem(ctx, f));
  if (mode === 'fill') {
    return {
      type: 'fill',
      title,
      instruction,
      items: items.map((it) => ({ parts: it.parts, answers: [[it.form]], hint: it.hint, srs: [srsKey.gender(it.noun)] })),
    };
  }
  return {
    type: 'choice',
    title,
    instruction,
    layout: 'inline',
    items: items.map((it) => ({ parts: it.parts, options: it.options, answer: it.options.indexOf(it.form), hint: it.hint, srs: srsKey.gender(it.noun) })),
  };
}

export const isAkkFrame = (f: Frame) => (f.p ? prepCase(f.p) === 'akk' || f.case === 'akk' : (f.case ?? 'akk') === 'akk');
export const isDatFrame = (f: Frame) => (f.p ? prepCase(f.p) === 'dat' || f.case === 'dat' : f.case === 'dat');

// ---------------------------------------------------------------------------
// Wechselpräpositionen

function wechselForm(p: string, g: 'm' | 'f' | 'n', c: 'akk' | 'dat'): { canon: string; alts: string[] } {
  const art = article('def', g, c);
  const k = contract(p, art);
  const full = `${p} ${art}`;
  return k ? { canon: k, alts: [k, full] } : { canon: full, alts: [full] };
}

export function wechselEx(ctx: Ctx, n = 6): Exercise {
  const theme = ctx.theme.spots && ctx.theme.things ? ctx.theme : getTheme('home');
  const items: ChoiceItem[] = [];
  const spotsList = shuffle(ctx.rng, theme.spots!);
  const thingsList = shuffle(ctx.rng, theme.things!);
  const flip = int(ctx.rng, 2);
  for (let i = 0; i < n; i++) {
    const spot = spotsList[i % spotsList.length];
    const thing = thingsList[i % thingsList.length];
    const sp = getNoun(spot.n);
    const th = getNoun(thing.n);
    const g = sp.g as 'm' | 'f' | 'n';
    const wohin = (i + flip) % 2 === 0;
    const right = wechselForm(spot.p, g, wohin ? 'akk' : 'dat');
    const other = wechselForm(spot.p, g, wohin ? 'dat' : 'akk');
    const otherG = (['m', 'f', 'n'] as const).filter((x) => x !== g);
    const distract = otherG.map((x) => wechselForm(spot.p, x, wohin ? 'akk' : 'dat').canon);
    const options = shuffle(ctx.rng, [...new Set([right.canon, other.canon, ...distract])].slice(0, 4));
    if (!options.includes(right.canon)) options[0] = right.canon;
    let parts: Seg[];
    if (wohin) {
      const subj = pickSubject(ctx, { pronounsOnly: true });
      const verb = getVerb(thing.pos === 's' ? 'stellen' : 'legen');
      const fin = present(verb, subj.person);
      parts = [`${cap(subj.de)} ${fin} ${article('def', th.g, 'akk')} ${th.de} `, 0, ` ${sp.de}.`];
    } else {
      const verb = getVerb(thing.pos === 's' ? 'stehen' : 'liegen');
      parts = [`${cap(article('def', th.g, 'nom'))} ${th.de} ${present(verb, 2)} `, 0, ` ${sp.de}.`];
    }
    items.push({
      parts,
      options: shuffle(ctx.rng, options),
      answer: -1,
      hint: `${spot.p}; ${wohin ? 'wohin?' : 'wo?'}`,
      explain: wohin ? 'Wohin? → Akkusativ (движение, направление)' : 'Wo? → Dativ (место)',
    });
    const last = items[items.length - 1];
    last.answer = last.options.indexOf(right.canon);
  }
  return {
    type: 'choice',
    title: 'Wo? или Wohin?',
    instruction: 'Выберите предлог с артиклем.',
    layout: 'inline',
    items,
  };
}

export function wechselVerbEx(ctx: Ctx, n = 4): Exercise {
  const theme = ctx.theme.spots && ctx.theme.things ? ctx.theme : getTheme('home');
  const items: ChoiceItem[] = [];
  for (let i = 0; i < n; i++) {
    const spot = pick(ctx.rng, theme.spots!);
    const thing = pick(ctx.rng, theme.things!);
    const sp = getNoun(spot.n);
    const th = getNoun(thing.n);
    const g = sp.g as 'm' | 'f' | 'n';
    const wohin = chance(ctx.rng, 0.5);
    const subj = pickSubject(ctx, { pronounsOnly: true });
    const [trans, intr] = thing.pos === 's' ? ['stellen', 'stehen'] : ['legen', 'liegen'];
    if (wohin) {
      const f = wechselForm(spot.p, g, 'akk').canon;
      const right = present(getVerb(trans), subj.person);
      const wrong = present(getVerb(intr), subj.person);
      const options = shuffle(ctx.rng, [right, wrong]);
      items.push({
        parts: [`${cap(subj.de)} `, 0, ` ${article('def', th.g, 'akk')} ${th.de} ${f} ${sp.de}.`],
        options,
        answer: options.indexOf(right),
        hint: `${trans}/${intr}`,
      });
    } else {
      const f = wechselForm(spot.p, g, 'dat').canon;
      const right = present(getVerb(intr), 2);
      const wrong = present(getVerb(trans), 2);
      const options = shuffle(ctx.rng, [right, wrong]);
      items.push({
        parts: [`${cap(article('def', th.g, 'nom'))} ${th.de} `, 0, ` ${f} ${sp.de}.`],
        options,
        answer: options.indexOf(right),
        hint: `${trans}/${intr}`,
      });
    }
  }
  return {
    type: 'choice',
    title: 'stellen/stehen, legen/liegen',
    instruction: 'Выберите глагол: действие (wohin?) или состояние (wo?).',
    layout: 'inline',
    items,
  };
}

// ---------------------------------------------------------------------------
// verbs with prepositions

export function prepChoiceEx(ctx: Ctx, n = 6): Exercise {
  const acts = pickActs(ctx, n, (a) => !!a.prep);
  const items: ChoiceItem[] = acts.map((act) => {
    const subj = pickSubject(ctx);
    const prep = act.c.split(' ')[0];
    const s = spec(act, subj, chance(ctx.rng, 0.7) ? 'pres' : 'perf', { time: chance(ctx.rng, 0.4) ? pickTime(ctx, 'pres') : undefined });
    s.time = s.tense === 'perf' ? (s.time ? pickTime(ctx, 'perf') : undefined) : s.time;
    const chunks = render(s, 'S');
    const GAP = '\u0000';
    const text = sentence(chunks.map((c) => (c.role === 'c' ? { ...c, text: GAP + c.text.slice(prep.length) } : c)));
    const [before, after] = text.split(GAP);
    const options = shuffle(ctx.rng, [prep, ...sample(ctx.rng, ALL_PREPS.filter((p) => p !== prep), 3)]);
    const pv = findPrepVerb(act.v, prep)!;
    return {
      parts: [before, 0, after],
      options,
      answer: options.indexOf(prep),
      hint: verbLabel(act.verb),
      srs: srsKey.prep(act.v, prep),
      explain: `${verbLabel(act.verb)} ${prep} + ${pv.case === 'akk' ? 'Akk' : 'Dat'} — ${pv.ru}`,
    };
  });
  return {
    type: 'choice',
    title: 'Какой предлог?',
    instruction: 'Выберите предлог, которого требует глагол.',
    layout: 'inline',
    items,
  };
}

export function prepQuestionEx(ctx: Ctx, n = 4): Exercise {
  const acts = pickActs(ctx, n, (a) => !!a.prep);
  const items: FillItem[] = acts.map((act) => {
    const prep = act.c.split(' ')[0];
    const pv = findPrepVerb(act.v, prep)!;
    const subj = pickSubject(ctx, { pronounsOnly: true });
    const lead = act.person ? `${prep} ${pv.case === 'akk' ? 'wen' : 'wem'}` : woForm(prep);
    const q = render({ subj, verb: act.verb, tense: 'pres', lead }, 'W');
    const qText = sentence(q, '?');
    const firstWordLen = lead.split(' ').length;
    const qRest = qText.split(' ').slice(firstWordLen).join(' ');
    const answerSubj = answerSubject(subj);
    const a = sentence(render(spec(act, answerSubj, 'pres'), 'S'));
    return {
      parts: [0, ` ${qRest} — ${a}`],
      answers: [[cap(lead)]],
      hint: act.person ? 'о человеке' : 'о предмете',
      srs: [srsKey.prep(act.v, prep)],
    };
  });
  return {
    type: 'fill',
    title: 'Вопрос к предложному дополнению',
    instruction: 'Задайте вопрос: о предмете — wo(r)+предлог (worauf, womit…), о человеке — предлог + wen/wem.',
    items,
  };
}

export function prepDaEx(ctx: Ctx, n = 4): Exercise {
  const acts = pickActs(ctx, n, (a) => !!a.prep && !a.person);
  const items: FillItem[] = acts.map((act) => {
    const prep = act.c.split(' ')[0];
    const subj = pickSubject(ctx, { pronounsOnly: true });
    const question = sentence(render(spec(act, subj, 'pres'), 'Y'), '?');
    const reply = joinChunks(render({ subj: answerSubject(subj), verb: act.verb, tense: 'pres', c: 'auch \u0000' }, 'S'), { capitalize: false });
    const [b, a] = reply.split('\u0000');
    return {
      parts: [`${question} — Ja, ${b}`, 0, `${a}.`],
      answers: [[daForm(prep)]],
      hint: `${prep} → da(r)…`,
      srs: [srsKey.prep(act.v, prep)],
    };
  });
  return {
    type: 'fill',
    title: 'da(r) + предлог',
    instruction: 'Замените предложное дополнение словом da(r)+предлог (darauf, damit…).',
    items,
  };
}

// ---------------------------------------------------------------------------
// connectors

function pairSpecs(ctx: Ctx, pair: Pair, tense: Tense = 'pres'): [ClauseSpec, ClauseSpec] {
  const subj = pickSubject(ctx);
  const a = clauseAct(pair.a);
  const b = clauseAct(pair.b);
  return [spec(a, subj, tense), spec(b, subj, tense)];
}

/** Two independent sentences from a pair, with the second subject turned into a pronoun. */
function pronounFor(s: Subject): Subject {
  return s.pronoun ? s : answerSubjectKeep(s);
}
function answerSubjectKeep(s: Subject): Subject {
  if (s.person === 5) return PRONOUNS[6];
  return /^(Anna|Lena|Frau|meine Schwester)/.test(s.de) ? PRONOUNS[3] : PRONOUNS[2];
}

export function weilWriteEx(ctx: Ctx, conj: 'weil' | 'dass' | 'wenn' | 'deshalb' | 'denn' | 'trotzdem'): Exercise {
  const pair = pick(ctx.rng, conj === 'trotzdem' ? ctx.theme.contras : ctx.theme.causes);
  const [eff, cause] = pairSpecs(ctx, pair);
  const subjP = pronounFor(eff.subj);
  const s2 = (x: ClauseSpec) => ({ ...x, subj: subjP });
  let cues: string[];
  let answers: string[];
  let task: string;
  switch (conj) {
    case 'weil':
      cues = [sentence(render(eff, 'S')), sentence(render(s2(cause), 'S'))];
      answers = mainSub(eff, { ...s2(cause), lead: 'weil' }).texts;
      task = 'Соедините с помощью «weil».';
      break;
    case 'denn':
      cues = [sentence(render(eff, 'S')), sentence(render(s2(cause), 'S'))];
      answers = [`${joinChunks(render(eff, 'S'))}, denn ${joinChunks(render(s2(cause), 'S'), { capitalize: false })}.`];
      task = 'Соедините с помощью «denn».';
      break;
    case 'wenn':
      cues = [sentence(render(cause, 'S')), sentence(render(s2(eff), 'S'))];
      answers = subFirst({ ...cause, lead: 'wenn' }, s2(eff)).texts;
      task = 'Начните с «Wenn …».';
      break;
    case 'deshalb':
    case 'trotzdem': {
      const first = conj === 'deshalb' ? cause : eff;
      const second = conj === 'deshalb' ? s2(eff) : s2(cause);
      cues = [sentence(render(first, 'S')), sentence(render(second, 'S'))];
      const tail = joinChunks(render({ ...second, lead: conj }, 'A'), { capitalize: false });
      const head = joinChunks(render(first, 'S'));
      answers = [`${head}. ${cap(tail)}.`, `${head}, ${tail}.`];
      task = `Соедините с помощью «${conj}».`;
      break;
    }
    case 'dass': {
      const intro = pick(ctx.rng, ['Ich glaube', 'Ich weiß', 'Ich finde gut', 'Es ist wichtig', 'Ich hoffe']);
      cues = [intro, sentence(render(eff, 'S'))];
      answers = renderAll({ ...eff, lead: 'dass' }, 'SUB').map((ch) => `${intro}, ${joinChunks(ch, { capitalize: false })}.`);
      task = 'Соедините с помощью «dass».';
      break;
    }
  }
  return {
    type: 'write',
    title: `Сложное предложение: ${conj}`,
    instruction: 'Объедините два предложения в одно.',
    item: { cues, task, answers },
  };
}

export function connectorChoiceEx(ctx: Ctx, conjs: ('weil' | 'denn' | 'deshalb' | 'trotzdem' | 'aber' | 'und' | 'oder')[], n = 5): Exercise {
  const items: ChoiceItem[] = [];
  for (let i = 0; i < n; i++) {
    const conj = conjs[i % conjs.length];
    let text: string;
    if (conj === 'trotzdem' || conj === 'aber') {
      const [a, b] = pairSpecs(ctx, pick(ctx.rng, ctx.theme.contras));
      const bP = { ...b, subj: pronounFor(a.subj) };
      text =
        conj === 'aber'
          ? `${joinChunks(render(a, 'S'))}, \u0000 ${joinChunks(render(bP, 'S'), { capitalize: false })}.`
          : `${joinChunks(render(a, 'S'))}. \u0000 ${joinChunks(render({ ...bP, lead: 'X' }, 'A'), { capitalize: false }).replace(/^X /, '')}.`;
    } else if (conj === 'und' || conj === 'oder') {
      const [a1, a2] = pickActs(ctx, 2, (x) => !x.verb.refl);
      const asker = pick(ctx.rng, [PRONOUNS[1], PRONOUNS[5], PRONOUNS[7]]);
      const s1 = spec(a1, conj === 'oder' ? asker : pickSubject(ctx), 'pres');
      const s2 = spec(a2, pickSubject(ctx, { exclude: [s1.subj] }), 'pres');
      text =
        conj === 'und'
          ? `${joinChunks(render(s1, 'S'))}, \u0000 ${joinChunks(render(s2, 'S'), { capitalize: false })}.`
          : `${joinChunks(render({ ...s1 }, 'Y'))} \u0000 ${joinChunks(render({ ...s2, subj: s1.subj }, 'Y'), { capitalize: false })}?`;
    } else {
      const [eff, cause] = pairSpecs(ctx, pick(ctx.rng, ctx.theme.causes));
      const causeP = { ...cause, subj: pronounFor(eff.subj) };
      if (conj === 'weil') text = `${joinChunks(render(eff, 'S'))}, \u0000 ${joinChunks(render({ ...causeP, lead: 'X' }, 'SUB')).replace(/^X /, '')}.`;
      else if (conj === 'denn') text = `${joinChunks(render(eff, 'S'))}, \u0000 ${joinChunks(render(causeP, 'S'), { capitalize: false })}.`;
      else {
        const effP = { ...eff, subj: pronounFor(eff.subj) };
        text = `${joinChunks(render(cause, 'S'))}, \u0000 ${joinChunks(render({ ...effP, lead: 'X' }, 'A'), { capitalize: false }).replace(/^X /, '')}.`;
      }
    }
    const [before, after] = text.split('\u0000');
    // after a period the connector starts a new sentence and is capitalised
    const afterPeriod = before.trimEnd().endsWith('.');
    const shown = shuffle(ctx.rng, [...new Set(conjs)]).map((o) => (afterPeriod ? cap(o) : o));
    items.push({
      parts: [before, 0, after],
      options: shown,
      answer: shown.indexOf(afterPeriod ? cap(conj) : conj),
      explain: CONJ_EXPLAIN[conj],
    });
  }
  return {
    type: 'choice',
    title: 'Какой союз?',
    instruction: 'Обратите внимание на место глагола после пропуска!',
    layout: 'inline',
    items,
  };
}

const CONJ_EXPLAIN: Record<string, string> = {
  weil: 'weil — глагол в конце предложения',
  denn: 'denn — позиция 0, обычный порядок слов',
  deshalb: 'deshalb — позиция 1, глагол сразу после него (инверсия)',
  trotzdem: 'trotzdem — позиция 1, глагол сразу после него (инверсия)',
  aber: 'aber — позиция 0, обычный порядок слов',
  und: 'und — позиция 0, обычный порядок слов',
  oder: 'oder — позиция 0, обычный порядок слов',
};

export function subOrderEx(ctx: Ctx, conj: 'weil' | 'dass' | 'wenn', tense: Tense = 'pres'): Exercise {
  const pair = pick(ctx.rng, ctx.theme.causes);
  const [eff, cause] = pairSpecs(ctx, pair, tense);
  const subjP = pronounFor(eff.subj);
  if (conj === 'wenn') {
    const { chunks, texts } = subFirst({ ...cause, lead: 'wenn' }, { ...eff, subj: subjP });
    const item = orderItemFrom(ctx, chunks, { fixFirst: true, punct: '.', hint: 'Wenn …, (глагол) …', solution: texts[0] });
    return {
      type: 'order',
      title: 'Wenn …, dann инверсия',
      instruction: 'Составьте предложение. После придаточного сразу идёт глагол!',
      item,
    };
  }
  const main = joinChunks(render(eff, 'S'));
  const sub = conj === 'weil' ? { ...cause, subj: subjP, lead: 'weil' } : { ...eff, subj: subjP, lead: 'dass' };
  const variants = renderAll(sub, 'SUB');
  const head = conj === 'dass' ? 'Ich glaube' : main;
  const item = orderItemFrom(ctx, variants, {
    fixFirst: true,
    punct: '.',
    hint: `${head}, …`,
    solution: `${head}, ${joinChunks(variants[0], { capitalize: false })}.`,
  });
  return {
    type: 'order',
    title: `Придаточное с «${conj}»`,
    instruction: conj === 'dass' ? 'Продолжите: «Ich glaube, …». Глагол — в конец!' : `Продолжите: «${main}, …». Глагол — в конец!`,
    item,
  };
}

export { pickActs, pickSubject, pickTime };
