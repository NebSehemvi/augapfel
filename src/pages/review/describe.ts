import { getVerb, hasVerb } from '../../data/verbs';
import { verbLabel } from '../../exercises/builders';

export const KIND_LABEL: Record<string, string> = { v: 'Формы глаголов', n: 'Существительные (род, мн. ч.)', p: 'Глаголы с предлогами', w: 'Мои слова' };

const FORM_LABEL: Record<string, string> = {
  pres: 'Präsens',
  praet: 'Präteritum',
  pp: 'Partizip II',
  aux: 'haben/sein',
  inf: 'перевод',
  g: 'род',
  pl: 'мн. ч.',
  rec: 'узнавание',
  prod: 'написание',
};

/** Human-readable name of a spaced-repetition key, e.g. "v|gehen|pp" → "gehen — Partizip II". */
export function describe(key: string): string {
  const [kind, a, b] = key.split('|');
  if (kind === 'v') return `${hasVerb(a) ? verbLabel(getVerb(a)) : a} — ${FORM_LABEL[b] ?? b}`;
  if (kind === 'n' || kind === 'w') return `${a} — ${FORM_LABEL[b] ?? b}`;
  if (kind === 'p') return `${a} ${b} …`;
  return key;
}
