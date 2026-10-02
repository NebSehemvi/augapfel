import type { Person, Verb } from './types';

const VOWELS = 'aeiouäöüy';

/** Stem of a verb: "machen" → "mach", "wandern" → "wander", "sammeln" → "sammel" */
export function weakStem(base: string): string {
  if (/[^aeiouäöü](el|er)n$/.test(base)) return base.slice(0, -1);
  if (base.endsWith('en')) return base.slice(0, -2);
  if (base.endsWith('n')) return base.slice(0, -1);
  return base;
}

/** Stems needing an -e- before -st/-t: arbeit-e-t, öffn-e-t, zeichn-e-t */
export function needsE(stem: string): boolean {
  if (/[dt]$/.test(stem)) return true;
  if (/chn$/.test(stem)) return true;
  const m = /(.)([mn])$/.exec(stem);
  if (!m) return false;
  const prev = m[1];
  return !VOWELS.includes(prev) && !'lrhmn'.includes(prev);
}

function isSibilant(stem: string): boolean {
  return /([sßzx])$/.test(stem) && !/sch$/.test(stem);
}

function isElEr(base: string): boolean {
  return /[^aeiouäöü](el|er)n$/.test(base);
}

const INSEPARABLE = /^(be|ge|er|ver|zer|ent|emp|miss|über|unter|wieder|hinter)/;

export function weakPraeteritum(base: string): string {
  const stem = weakStem(base);
  return stem + (needsE(stem) ? 'ete' : 'te');
}

export function weakPartizip(base: string, sep?: string): string {
  const stem = weakStem(base);
  const end = needsE(stem) ? 'et' : 't';
  const ge = base.endsWith('ieren') || INSEPARABLE.test(base) ? '' : 'ge';
  return (sep ?? '') + ge + stem + end;
}

/** Finite present-tense form of the (base) verb — separable prefix not included. */
export function present(v: Verb, p: Person): string {
  if (v.presFull) return v.presFull[p];
  const base = v.base;
  const stem = weakStem(base);
  if (isElEr(base)) {
    // sammeln: sammle, sammelst, sammelt, sammeln, sammelt, sammeln
    const ich = stem.endsWith('el') ? stem.slice(0, -2) + 'le' : stem + 'e';
    return [ich, stem + 'st', stem + 't', stem + 'n', stem + 't', stem + 'n'][p];
  }
  if (v.presDuEr && (p === 1 || p === 2)) return v.presDuEr[p - 1];
  const e = needsE(stem);
  const du = isSibilant(stem) ? stem + 't' : stem + (e ? 'est' : 'st');
  const t = stem + (e ? 'et' : 't');
  return [stem + 'e', du, t, base, t, base][p];
}

/** All accepted Präteritum forms (first = canonical). */
export function praeteritum(v: Verb, p: Person): string[] {
  return v.praet.map((f) => praetForm(f, p));
}

function praetForm(f: string, p: Person): string {
  if (f.endsWith('e')) return [f, f + 'st', f, f + 'n', f + 't', f + 'n'][p];
  const dt = /[dt]$/.test(f);
  const sib = /[sßz]$/.test(f);
  const du = f + (dt || sib ? 'est' : 'st');
  const ihr = f + (dt ? 'et' : 't');
  return [f, du, f, f + 'en', ihr, f + 'en'][p];
}

/** Attach the separable prefix to a finite form, as in a subordinate clause: "ein" + "kaufe" */
export function joinSep(v: Verb, finite: string): string {
  return (v.sep ?? '') + finite;
}

/** Present form as a single word list for tables: "stehe auf" (main clause shape). */
export function presentMain(v: Verb, p: Person): string {
  const f = present(v, p);
  return v.sep ? `${f} ${v.sep.trim()}` : f;
}

export function praetMain(v: Verb, p: Person): string[] {
  return praeteritum(v, p).map((f) => (v.sep ? `${f} ${v.sep.trim()}` : f));
}

/** Präteritum 3rd person singular including separable prefix: "stand auf" */
export function praet3(v: Verb): string[] {
  return praetMain(v, 2);
}

/** Present 3rd person singular including separable prefix: "fährt ab" */
export function pres3(v: Verb): string {
  return presentMain(v, 2);
}

export const REFL_AKK = ['mich', 'dich', 'sich', 'uns', 'euch', 'sich'] as const;
export const REFL_DAT = ['mir', 'dir', 'sich', 'uns', 'euch', 'sich'] as const;
export const PERSON_PRONOUNS = ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie/Sie'] as const;

export function isStemChanging(v: Verb): boolean {
  return !!v.presDuEr;
}
