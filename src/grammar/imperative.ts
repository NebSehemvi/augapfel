import type { Verb } from './types';
import { needsE, present, weakStem } from './conjugate';

/*
 * Imperativ: du (Komm!), ihr (Kommt!), Sie (Kommen Sie!).
 * The du-form comes from the present-tense du-form: no pronoun, no -st; e→i/ie is kept (Nimm!, Lies!),
 * a→ä / au→äu is dropped (Fahr!, Lauf!), -e after -t/-d/-chn/-ffn … (Warte!, Öffne!).
 */

export type ImpForm = 'du' | 'ihr' | 'Sie';
export const IMP_FORMS: ImpForm[] = ['du', 'ihr', 'Sie'];

/** Verbs that make no sense as a command (impersonal, modal, "wissen/kennen/mögen" …). */
const NO_IMPERATIVE = new Set([
  'regnen', 'kosten', 'dauern', 'schmecken', 'passieren', 'geschehen', 'gelingen', 'gelten', 'stimmen', 'gehören', 'passen',
  'fehlen', 'bedeuten', 'scheinen', 'aussehen', 'gefallen', 'wissen', 'kennen', 'mögen', 'dabeihaben', 'brennen', 'bersten',
  'erschrecken', 'genesen', 'wachsen', 'sich verlieben', 'sich erkälten', 'sich langweilen', 'sich gewöhnen', 'sich fühlen',
  'schlagen', 'stehlen', 'werben', 'haben', 'werden',
  // possible, but odd or unsure as a command
  'frieren', 'sterben', 'fallen', 'ausfallen', 'heißen', 'bitten', 'hängen', 'entstehen', 'stattfinden', 'bestehen', 'lieben',
  'meinen', 'danken', 'joggen', 'braten',
]);

/** Can we form a reliable imperative (and a sensible command) for this verb? */
export function hasImperative(v: Verb): boolean {
  if (v.kind === 'modal') return false;
  const key = (v.refl ? 'sich ' : '') + v.inf;
  return !NO_IMPERATIVE.has(key) && !NO_IMPERATIVE.has(v.inf) && v.level !== 'B1';
}

/** The du-imperative of the base verb, without the separable prefix: "komm", "nimm", "fahr", "warte", "sei". */
function duStem(v: Verb): string {
  const base = v.base;
  if (base === 'sein') return 'sei';
  if (base === 'haben') return 'hab';
  if (base === 'werden') return 'werde';
  const stem = weakStem(base);
  // -eln / -ern: sammle, wandere, erinnere
  if (/[^aeiouäöü](el|er)n$/.test(base)) return present(v, 0);
  if (v.presDuEr) {
    // stem-changing: cut the ending off the du-form (-st; just -t after a sibilant: liest → lies, isst → iss)
    const d = present(v, 1);
    let out = /[sßzx]$/.test(stem) ? d.replace(/t$/, '') : d.replace(/st$/, '');
    // a → ä / au → äu is not kept in the imperative (fährst → fahr, läufst → lauf, stößt → stoß)
    if (/[äö]/.test(out) && !/[äö]/.test(stem)) out = out.replace(/ä/g, 'a').replace(/ö/g, 'o');
    // e → i / ie is kept and takes no extra -e (Nimm! Gib! Tritt!); the rest follows the regular rule (Halte! Lade!)
    const eToI = out !== stem && stem.includes('e') && /i/.test(out);
    return eToI ? out : out + (needsE(out) ? 'e' : '');
  }
  // -s stems with a long vowel and -ig stems take -e (Reise! Entschuldige!); zeig-, steig- do not
  if (base === 'reisen' || base === 'üben') return stem + 'e';
  return stem + (needsE(stem) || /(?<!e)ig$/.test(stem) ? 'e' : '');
}

/** Finite imperative form, without pronoun and prefix: "komm" / "kommt" / "kommen" (+ "Sie"). */
export function impFinite(v: Verb, f: ImpForm): string {
  if (f === 'du') return duStem(v);
  if (f === 'ihr') return present(v, 4);
  return v.base === 'sein' ? 'seien' : v.base;
}

const REFL: Record<ImpForm, string> = { du: 'dich', ihr: 'euch', Sie: 'sich' };

export interface ImpOpts {
  /** complement ("die Suppe", "früh") */
  c?: string;
  /** politeness: "bitte" or "doch mal" */
  particle?: 'bitte' | 'doch mal';
}

/** Words of the imperative sentence (no punctuation, lower case): ["steh", "früh", "auf"], ["kommen", "Sie", "mit"]. */
export function impWords(v: Verb, f: ImpForm, o: ImpOpts = {}): string[] {
  const out: string[] = [impFinite(v, f)];
  if (f === 'Sie') out.push('Sie');
  if (v.refl) out.push(REFL[f]);
  if (o.particle) out.push(...o.particle.split(' '));
  if (o.c) out.push(o.c);
  if (v.sep) out.push(v.sep.trim());
  return out;
}

/** "Steh früh auf!" */
export function imperative(v: Verb, f: ImpForm, o: ImpOpts = {}): string {
  const s = impWords(v, f, o).join(' ');
  return s[0].toUpperCase() + s.slice(1) + '!';
}
