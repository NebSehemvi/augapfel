import type { Person, Subject } from './types';

export const PRONOUNS: Subject[] = [
  { de: 'ich', person: 0, pronoun: true },
  { de: 'du', person: 1, pronoun: true },
  { de: 'er', person: 2, pronoun: true },
  { de: 'sie', person: 2, pronoun: true, hint: 'она' },
  { de: 'wir', person: 3, pronoun: true },
  { de: 'ihr', person: 4, pronoun: true },
  { de: 'sie', person: 5, pronoun: true, hint: 'они' },
  { de: 'Sie', person: 5, pronoun: true, hint: 'Вы' },
];

export const NAMED: Subject[] = [
  { de: 'Anna', person: 2, pronoun: false },
  { de: 'Tom', person: 2, pronoun: false },
  { de: 'Lena', person: 2, pronoun: false },
  { de: 'Max', person: 2, pronoun: false },
  { de: 'Frau Weber', person: 2, pronoun: false },
  { de: 'Herr Klein', person: 2, pronoun: false },
  { de: 'meine Schwester', person: 2, pronoun: false },
  { de: 'mein Bruder', person: 2, pronoun: false },
  { de: 'meine Eltern', person: 5, pronoun: false },
  { de: 'Lena und Paul', person: 5, pronoun: false },
  { de: 'die Kinder', person: 5, pronoun: false },
  { de: 'unsere Nachbarn', person: 5, pronoun: false },
];

export const ALL_SUBJECTS: Subject[] = [...PRONOUNS, ...NAMED];

export function subjectFor(person: Person): Subject {
  return PRONOUNS.find((s) => s.person === person)!;
}

/** Text of subject at a given place: capitalised at sentence start, otherwise as is. */
export function subjectText(s: Subject, initial: boolean): string {
  return initial ? cap(s.de) : s.de;
}

export function cap(s: string): string {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

/** Label for hints: "sie (она)" */
export function subjectLabel(s: Subject): string {
  return s.hint ? `${s.de} (${s.hint})` : s.de;
}

export const TIMES_PRESENT = [
  'heute',
  'morgen',
  'am Morgen',
  'am Vormittag',
  'am Nachmittag',
  'am Abend',
  'heute Abend',
  'am Wochenende',
  'jeden Tag',
  'am Montag',
  'am Samstag',
  'oft',
  'manchmal',
  'um acht Uhr',
  'im Sommer',
];

export const TIMES_PAST = [
  'gestern',
  'gestern Abend',
  'vorgestern',
  'letzte Woche',
  'am Wochenende',
  'am Montag',
  'letztes Jahr',
  'heute Morgen',
  'letzten Sommer',
  'am Samstag',
];
