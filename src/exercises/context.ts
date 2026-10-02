import type { Rng } from '../lib/rng';
import { pick, sample, shuffle } from '../lib/rng';
import type { Theme, Activity, Clause } from '../data/themes/types';
import { GENERAL } from '../data/themes';
import { getVerb } from '../data/verbs';
import type { Level, Subject, Verb } from '../grammar/types';
import type { ClauseSpec, Tense } from '../grammar/clause';
import { ALL_SUBJECTS, NAMED, PRONOUNS, TIMES_PAST, TIMES_PRESENT, subjectLabel } from '../grammar/subjects';

export interface Ctx {
  theme: Theme;
  rng: Rng;
  level: Level;
  includeRare: boolean;
}

export function verbAllowed(ctx: Ctx, v: Verb): boolean {
  return v.level !== 'B1' || ctx.includeRare;
}

export interface Act extends Activity {
  verb: Verb;
}

function toAct(a: Activity): Act {
  return { ...a, verb: getVerb(a.v) };
}

/**
 * n distinct activities from the theme matching pred; tops up from the general pool when the theme
 * has too few. Never repeats the same verb twice in one exercise.
 */
export function pickActs(ctx: Ctx, n: number, pred: (a: Act) => boolean = () => true): Act[] {
  const ok = (a: Act) => verbAllowed(ctx, a.verb) && pred(a);
  const fromTheme = shuffle(ctx.rng, ctx.theme.acts.map(toAct).filter(ok));
  const fromGeneral = shuffle(ctx.rng, GENERAL.map(toAct).filter(ok));
  const out: Act[] = [];
  const seen = new Set<string>();
  for (const a of [...fromTheme, ...fromGeneral]) {
    if (out.length >= n) break;
    if (seen.has(a.v)) continue;
    seen.add(a.v);
    out.push(a);
  }
  return out;
}

export function pickSubject(ctx: Ctx, opts: { pronounsOnly?: boolean; exclude?: Subject[] } = {}): Subject {
  const pool = (opts.pronounsOnly ? PRONOUNS : ALL_SUBJECTS).filter((s) => !opts.exclude?.includes(s));
  return pick(ctx.rng, pool);
}

/** Subjects with all 6 persons represented reasonably evenly. */
export function pickSubjects(ctx: Ctx, n: number): Subject[] {
  const pool = shuffle(ctx.rng, [...PRONOUNS, ...sample(ctx.rng, NAMED, 4)]);
  const out: Subject[] = [];
  for (let i = 0; i < n; i++) out.push(pool[i % pool.length]);
  return out;
}

export function pickTime(ctx: Ctx, tense: Tense): string {
  const past = tense !== 'pres';
  const own = past ? ctx.theme.pastTimes ?? [] : ctx.theme.times ?? [];
  const pool = past ? [...TIMES_PAST, ...own, ...own] : [...TIMES_PRESENT, ...own, ...own];
  return pick(ctx.rng, pool);
}

export function pickTimes(ctx: Ctx, tense: Tense, n: number): string[] {
  const past = tense !== 'pres';
  const own = past ? ctx.theme.pastTimes ?? [] : ctx.theme.times ?? [];
  const pool = [...new Set(past ? [...own, ...TIMES_PAST] : [...own, ...TIMES_PRESENT])];
  return sample(ctx.rng, pool, n);
}

export function spec(act: { verb: Verb; c: string }, subj: Subject, tense: Tense, extra: Partial<ClauseSpec> = {}): ClauseSpec {
  return { subj, verb: act.verb, c: act.c || undefined, tense, ...extra };
}

export function clauseAct(c: Clause): Act {
  return { v: c[0], c: c[1], ru: '', verb: getVerb(c[0]) };
}

export function hintFor(subj: Subject, verbText: string): string {
  return subj.hint ? `${verbText}; ${subjectLabel(subj)}` : verbText;
}

export const MODALS = ['können', 'müssen', 'wollen', 'dürfen', 'sollen', 'möchten'];

export const TENSE_LABEL: Record<Tense, string> = { pres: 'Präsens', perf: 'Perfekt', praet: 'Präteritum' };
