export type Level = 'A1' | 'A2' | 'B1';
export type VerbKind = 'weak' | 'strong' | 'mixed' | 'modal' | 'aux';
export type Aux = 'haben' | 'sein';
export type Case = 'nom' | 'akk' | 'dat';
export type Gender = 'm' | 'f' | 'n' | 'pl';

/** Person index: 0 ich, 1 du, 2 er/sie/es, 3 wir, 4 ihr, 5 sie/Sie */
export type Person = 0 | 1 | 2 | 3 | 4 | 5;

export interface Verb {
  /** Display infinitive without "sich", e.g. "aufstehen", "spazieren gehen" */
  inf: string;
  /** Separable prefix as written before the base (may end with a space, e.g. "spazieren ") */
  sep?: string;
  /** Base verb that gets conjugated (inf without separable prefix) */
  base: string;
  refl: boolean;
  ru: string;
  en: string;
  level: Level;
  kind: VerbKind;
  /** Present-tense overrides: [du, er] for stem-changing verbs, or full 6-form paradigm */
  presDuEr?: [string, string];
  presFull?: string[];
  /** Präteritum ich/er form(s) of the base; first is canonical */
  praet: string[];
  /** Partizip II (with separable prefix), first canonical */
  pp: string[];
  /** Accepted auxiliaries, first canonical */
  aux: Aux[];
  /** Ablaut class from the verb table (strong/irregular verbs) */
  cls?: string;
}

export interface Subject {
  de: string;
  person: Person;
  /** Shown as a disambiguation hint, e.g. "она" for sie (3sg) */
  hint?: string;
  pronoun: boolean;
}

export interface Noun {
  de: string;
  g: Gender;
  pl: string | null;
  ru: string;
  en: string;
  /** Weak masculine (n-Deklination): oblique singular form */
  weak?: string;
  /** Uncountable: no indefinite article */
  mass?: boolean;
}
