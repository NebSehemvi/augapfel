import { getVerb, hasVerb } from '../../data/verbs';
import { verbLabel } from '../../exercises/builders';
import { getLexEntry } from '../../data/lexicon';
import { clockText, dateText, priceText } from '../../grammar/numbers';

export const KIND_LABEL: Record<string, string> = { v: 'Формы глаголов', n: 'Существительные (род, мн. ч.)', p: 'Глаголы с предлогами', l: 'Лексика', z: 'Числа и время' };

const FORM_LABEL: Record<string, string> = {
  pres: 'Präsens',
  praet: 'Präteritum',
  pp: 'Partizip II',
  aux: 'haben/sein',
  inf: 'перевод',
  g: 'род',
  pl: 'мн. ч.',
  'de-ru': 'DE → RU',
  'ru-de': 'RU → DE',
};

/** Human-readable name of a spaced-repetition key, e.g. "v|gehen|pp" → "gehen — Partizip II". */
export function describe(key: string): string {
  const [kind, a, b] = key.split('|');
  if (kind === 'v') return `${hasVerb(a) ? verbLabel(getVerb(a)) : a} — ${FORM_LABEL[b] ?? b}`;
  if (kind === 'n') return `${a} — ${FORM_LABEL[b] ?? b}`;
  if (kind === 'p') return `${a} ${b} …`;
  if (kind === 'z') return describeNumber(a, b);
  if (kind === 'l') {
    const e = getLexEntry(a);
    return `${e ? e.lemma : a}${e?.kind === 'pron' ? ` (${e.ru})` : ''} — ${FORM_LABEL[b] ?? b}`;
  }
  return key;
}

/** "z|t|3:30" → "3:30 — время"; the date key stores the month from 0 ("3.4" = 3 May). */
function describeNumber(kind: string, v: string): string {
  switch (kind) {
    case 'n':
      return `${v} — число`;
    case 'p':
      return `${priceText(Number(v))} — цена`;
    case 't':
      return `${clockText(...(v.split(':').map(Number) as [number, number]))} — время`;
    case 'f':
      return `${clockText(...(v.split(':').map(Number) as [number, number]))} — официальное время`;
    case 'd': {
      const [d, m] = v.split('.').map(Number);
      return `${dateText(d, m)} — дата`;
    }
    case 'y':
      return `${v} — год`;
    default:
      return v;
  }
}

