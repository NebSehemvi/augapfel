import type { Level } from '../grammar/types';

export interface TopicMeta {
  id: string;
  level: Exclude<Level, 'B1'>;
  de: string;
  ru: string;
  summary: string;
  group: string;
  /** exercises don't use the vocabulary themes (numbers, time, dates) — no theme chip, no theme rotation */
  noTheme?: boolean;
}

export const TOPICS: TopicMeta[] = [
  { id: 'praesens-regular', level: 'A1', group: 'Глаголы', de: 'Präsens: regelmäßige Verben', ru: 'Настоящее время: правильные глаголы', summary: 'ich mache, du machst, er macht' },
  { id: 'praesens-irregular', level: 'A1', group: 'Глаголы', de: 'Präsens: starke Verben, sein, haben', ru: 'Настоящее время: сильные глаголы', summary: 'du fährst, er liest, sie nimmt' },
  { id: 'satzbau-inversion', level: 'A1', group: 'Порядок слов', de: 'Satzbau und Inversion', ru: 'Порядок слов и инверсия', summary: 'Am Abend habe ich … / Ich habe …' },
  { id: 'fragen', level: 'A1', group: 'Порядок слов', de: 'W-Fragen und Ja/Nein-Fragen', ru: 'Вопросы', summary: 'Was machst du? Kommst du?' },
  { id: 'trennbare', level: 'A1', group: 'Глаголы', de: 'Trennbare Verben', ru: 'Глаголы с отделяемой приставкой', summary: 'Ich stehe um 7 Uhr auf.' },
  { id: 'modalverben', level: 'A1', group: 'Глаголы', de: 'Modalverben', ru: 'Модальные глаголы', summary: 'Ich will heute Deutsch lernen.' },
  { id: 'perfekt-haben', level: 'A1', group: 'Прошедшее время', de: 'Perfekt mit haben', ru: 'Perfekt: слабые глаголы', summary: 'Ich habe gekocht.' },
  { id: 'perfekt-sein', level: 'A1', group: 'Прошедшее время', de: 'Perfekt: starke Verben, haben oder sein', ru: 'Perfekt: сильные глаголы, haben или sein', summary: 'Ich bin gefahren, ich habe gegessen.' },
  { id: 'perfekt-besonders', level: 'A1', group: 'Прошедшее время', de: 'Perfekt: trennbare Verben, -ieren', ru: 'Perfekt: приставки и -ieren', summary: 'aufgestanden, besucht, studiert' },
  { id: 'artikel-plural', level: 'A1', group: 'Существительные', de: 'Artikel und Plural', ru: 'Артикли и множественное число', summary: 'der / die / das, Äpfel, Kinder' },
  { id: 'akkusativ', level: 'A1', group: 'Существительные', de: 'Akkusativ', ru: 'Винительный падеж', summary: 'Ich kaufe einen Apfel.' },
  { id: 'dativ', level: 'A1', group: 'Существительные', de: 'Dativ und Präpositionen', ru: 'Дательный падеж и предлоги', summary: 'mit dem Bus, bei meiner Tante' },
  { id: 'konnektoren-a1', level: 'A1', group: 'Порядок слов', de: 'und, aber, oder, denn; dann', ru: 'Союзы: позиция 0', summary: 'Ich bin müde, aber ich koche.' },
  { id: 'zahlen', level: 'A1', group: 'Числа и время', noTheme: true, de: 'Zahlen und Preise', ru: 'Числа и цены', summary: 'einundzwanzig, 3,49 €' },
  { id: 'uhrzeit', level: 'A1', group: 'Числа и время', noTheme: true, de: 'Die Uhrzeit', ru: 'Который час?', summary: 'Viertel nach drei, halb vier = 3:30' },
  { id: 'datum', level: 'A1', group: 'Числа и время', noTheme: true, de: 'Das Datum', ru: 'Даты и порядковые числа', summary: 'am dritten Mai, im Mai, um acht' },
  { id: 'praeteritum-basis', level: 'A2', group: 'Прошедшее время', de: 'Präteritum: sein, haben, Modalverben', ru: 'Präteritum: sein, haben, модальные', summary: 'Ich war müde, ich musste arbeiten.' },
  { id: 'futur', level: 'A2', group: 'Глаголы', de: 'Futur I: werden + Infinitiv', ru: 'Будущее время: Futur I', summary: 'Ich werde morgen anrufen.' },
  { id: 'verben-praep', level: 'A2', group: 'Глаголы', de: 'Verben mit Präpositionen', ru: 'Глаголы с предлогами', summary: 'warten auf, denken an; worauf? darauf' },
  { id: 'reflexiv', level: 'A2', group: 'Глаголы', de: 'Reflexive Verben', ru: 'Возвратные глаголы', summary: 'Ich freue mich. Ich wasche mir die Hände.' },
  { id: 'nebensaetze', level: 'A2', group: 'Порядок слов', de: 'Nebensätze: weil, dass, wenn', ru: 'Придаточные: weil, dass, wenn', summary: '…, weil ich Hunger habe.' },
  { id: 'deshalb-trotzdem', level: 'A2', group: 'Порядок слов', de: 'deshalb, trotzdem, dann', ru: 'deshalb, trotzdem: инверсия', summary: 'Deshalb esse ich einen Salat.' },
  { id: 'wechselpraep', level: 'A2', group: 'Существительные', de: 'Wechselpräpositionen: wo? wohin?', ru: 'Двойные предлоги: где? куда?', summary: 'auf den Tisch / auf dem Tisch' },
];

export function getTopic(id: string): TopicMeta | undefined {
  return TOPICS.find((t) => t.id === id);
}
