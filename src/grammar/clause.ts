import type { Person, Subject, Verb } from './types';
import { getVerb } from '../data/verbs';
import { REFL_AKK, joinSep, praeteritum, present } from './conjugate';
import { cap } from './subjects';

/** fut = Futur I (werden + infinitive) */
export type Tense = 'pres' | 'perf' | 'praet' | 'fut';

/**
 * Word orders:
 *  S   – statement, subject first:         Ich habe am Abend einen Kuchen gebacken.
 *  T   – statement, time first (inversion): Am Abend habe ich einen Kuchen gebacken.
 *  Y   – yes/no question:                   Hast du am Abend einen Kuchen gebacken?
 *  W   – w-question:                        Wann hast du einen Kuchen gebacken?
 *  V1  – main clause after a fronted subordinate clause: (Wenn …,) habe ich …
 *  SUB – subordinate clause:                weil ich am Abend einen Kuchen gebacken habe
 *  A   – statement after a fronted adverb (deshalb, dann …): Deshalb habe ich …
 */
export type Order = 'S' | 'T' | 'Y' | 'W' | 'V1' | 'SUB' | 'A';

/** Topological field of a chunk: Position 1, finite verb, middle field, end (verb bracket), conjunction */
export type Slot = 'P1' | 'V' | 'M' | 'E' | 'K';
export type Role = 'subj' | 'fin' | 'refl' | 'time' | 'c' | 'end' | 'conj' | 'w' | 'adv';

export interface Chunk {
  text: string;
  role: Role;
  slot: Slot;
}

export interface ClauseSpec {
  subj: Subject;
  verb: Verb;
  c?: string;
  time?: string;
  tense: Tense;
  modal?: Verb;
  /** For W order: the question word; for SUB: the conjunction; for A: the adverb */
  lead?: string;
}

interface VerbParts {
  /** finite verb alternatives (main clause) */
  finite: string[];
  /** non-finite end part (sep prefix / participle / infinitive) */
  end?: string;
  /** verb cluster in a subordinate clause, as chunks (alternatives on finite) */
  sub: string[][];
}

const SEIN = () => getVerb('sein');
const WERDEN = () => getVerb('werden');
const HABEN = () => getVerb('haben');

export function verbParts(spec: ClauseSpec): VerbParts {
  const { verb, tense, modal } = spec;
  const p = spec.subj.person;
  if (modal) {
    const fin = tense === 'praet' ? praeteritum(modal, p) : [present(modal, p)];
    return { finite: fin, end: verb.inf, sub: fin.map((f) => [verb.inf, f]) };
  }
  if (tense === 'fut') {
    // Futur I: werden + infinitive (no modal verbs — "werde arbeiten müssen" is B1)
    const fin = present(WERDEN(), p);
    return { finite: [fin], end: verb.inf, sub: [[verb.inf, fin]] };
  }
  if (tense === 'perf') {
    const auxes = verb.aux.map((a) => present(a === 'sein' ? SEIN() : HABEN(), p));
    const pp = verb.pp[0];
    return { finite: auxes, end: pp, sub: auxes.map((a) => [pp, a]) };
  }
  const fin = tense === 'praet' ? praeteritum(verb, p) : [present(verb, p)];
  return {
    finite: fin,
    end: verb.sep ? verb.sep.trim() : undefined,
    sub: fin.map((f) => [joinSep(verb, f)]),
  };
}

function reflChunk(spec: ClauseSpec): Chunk | null {
  return spec.verb.refl ? { text: REFL_AKK[spec.subj.person as Person], role: 'refl', slot: 'M' } : null;
}

function compact(xs: (Chunk | null | undefined | false)[]): Chunk[] {
  return xs.filter(Boolean) as Chunk[];
}

/**
 * All accepted chunk sequences for a clause in a given order. The first one is canonical.
 * Variants: alternative finite forms (backte/buk, hat/ist geschwommen), middle-field order
 * (time before/after complement), reflexive before a noun subject after inversion.
 */
export function renderAll(spec: ClauseSpec, order: Order): Chunk[][] {
  const parts = verbParts(spec);
  const out: Chunk[][] = [];
  const subj: Chunk = { text: spec.subj.de, role: 'subj', slot: order === 'S' ? 'P1' : 'M' };
  const refl = reflChunk(spec);
  const time: Chunk | null = spec.time ? { text: spec.time, role: 'time', slot: order === 'T' ? 'P1' : 'M' } : null;
  const c: Chunk | null = spec.c ? { text: spec.c, role: 'c', slot: 'M' } : null;
  const end: Chunk | null = parts.end ? { text: parts.end, role: 'end', slot: 'E' } : null;

  const mids = (withTime: boolean, subjInMid: boolean): Chunk[][] => {
    const s = subjInMid ? [subj] : [];
    const t = withTime && time ? [time] : [];
    const cc = c ? [c] : [];
    const r = refl ? [refl] : [];
    const variants = [[...s, ...r, ...t, ...cc]];
    if (t.length && cc.length) variants.push([...s, ...r, ...cc, ...t]);
    if (subjInMid && refl && !spec.subj.pronoun) {
      variants.push([...r, ...s, ...t, ...cc]);
    }
    return variants;
  };

  if (order === 'SUB') {
    const conj: Chunk = { text: spec.lead ?? '', role: 'conj', slot: 'K' };
    for (const cluster of parts.sub) {
      for (const mid of mids(true, true)) {
        const verbChunks: Chunk[] = cluster.map((t, i) => ({
          text: t,
          role: i === cluster.length - 1 ? 'fin' : 'end',
          slot: 'E',
        }));
        out.push(compact([conj, ...mid.map((m) => ({ ...m, slot: m.role === 'subj' ? 'P1' : m.slot } as Chunk)), ...verbChunks]));
      }
    }
    return out;
  }

  for (const fin of parts.finite) {
    const finite: Chunk = { text: fin, role: 'fin', slot: 'V' };
    switch (order) {
      case 'S':
        for (const mid of mids(true, false)) out.push(compact([subj, finite, ...mid, end]));
        break;
      case 'T':
        for (const mid of mids(false, true)) out.push(compact([time, finite, ...mid, end]));
        break;
      case 'Y':
      case 'V1':
        for (const mid of mids(true, true)) out.push(compact([{ ...finite, slot: order === 'Y' ? 'P1' : 'V' }, ...mid, end]));
        break;
      case 'W': {
        const w: Chunk = { text: spec.lead ?? 'Wann', role: 'w', slot: 'P1' };
        const keepTime = (spec.lead ?? 'Wann') !== 'Wann';
        for (const mid of mids(keepTime, true)) out.push(compact([w, finite, ...mid, end]));
        break;
      }
      case 'A': {
        const adv: Chunk = { text: spec.lead ?? 'dann', role: 'adv', slot: 'P1' };
        for (const mid of mids(true, true)) out.push(compact([adv, finite, ...mid, end]));
        break;
      }
    }
  }
  return out;
}

export function render(spec: ClauseSpec, order: Order): Chunk[] {
  return renderAll(spec, order)[0];
}

export function joinChunks(chunks: Chunk[], opts: { capitalize?: boolean } = {}): string {
  const text = chunks.map((c) => c.text).join(' ');
  return opts.capitalize === false ? text : cap(text);
}

export function sentence(chunks: Chunk[], punct: '.' | '?' | '!' = '.'): string {
  return joinChunks(chunks) + punct;
}

export function punctFor(order: Order): '.' | '?' {
  return order === 'Y' || order === 'W' ? '?' : '.';
}

/** Canonical sentence text. */
export function clauseText(spec: ClauseSpec, order: Order): string {
  return sentence(render(spec, order), punctFor(order));
}

/** All accepted sentence texts. */
export function clauseTexts(spec: ClauseSpec, order: Order): string[] {
  return [...new Set(renderAll(spec, order).map((ch) => sentence(ch, punctFor(order))))];
}

/** Subordinate clause + main clause: "Wenn ich Zeit habe, koche ich eine Suppe." */
export function subFirst(sub: ClauseSpec, main: ClauseSpec): { chunks: Chunk[][]; texts: string[] } {
  const subs = renderAll(sub, 'SUB');
  const mains = renderAll(main, 'V1');
  const texts: string[] = [];
  const chunks: Chunk[][] = [];
  for (const s of subs)
    for (const m of mains) {
      chunks.push([...s, ...m]);
      texts.push(cap(joinChunks(s) + ', ' + joinChunks(m, { capitalize: false }) + '.'));
    }
  return { chunks, texts: [...new Set(texts)] };
}

/** Main clause + subordinate clause: "Ich koche eine Suppe, weil ich Hunger habe." */
export function mainSub(main: ClauseSpec, sub: ClauseSpec, mainOrder: Order = 'S'): { texts: string[] } {
  const texts: string[] = [];
  for (const m of renderAll(main, mainOrder))
    for (const s of renderAll(sub, 'SUB')) texts.push(joinChunks(m) + ', ' + joinChunks(s, { capitalize: false }) + '.');
  return { texts: [...new Set(texts)] };
}
