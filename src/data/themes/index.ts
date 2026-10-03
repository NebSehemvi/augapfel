import type { Noun } from '../../grammar/types';
import type { Activity, Theme } from './types';
import { acts } from './types';
import { GENERAL_NOUNS } from '../nouns';
import { food, home, leisure, shopping, travel, work } from './themesA';
import { city, daily, family, health, nature, school } from './themesB';

export const THEMES: Theme[] = [food, home, work, leisure, travel, shopping, school, family, health, city, daily, nature];

export function getTheme(id: string): Theme {
  const t = THEMES.find((x) => x.id === id);
  if (!t) throw new Error(`Unknown theme ${id}`);
  return t;
}

const NOUNS = new Map<string, Noun>();
for (const t of THEMES) for (const n of t.nouns) if (!NOUNS.has(n.de)) NOUNS.set(n.de, n);
for (const n of GENERAL_NOUNS) if (!NOUNS.has(n.de)) NOUNS.set(n.de, n);

export function getNoun(de: string): Noun {
  const n = NOUNS.get(de);
  if (!n) throw new Error(`Unknown noun ${de}`);
  return n;
}

export function hasNoun(de: string): boolean {
  return NOUNS.has(de);
}

export const ALL_NOUNS: Noun[] = [...NOUNS.values()];

/** Theme-neutral activities used when a theme has too few items of a needed kind. */
export const GENERAL: Activity[] = acts(`
  sprechen|Deutsch|говорить по-немецки
  lesen|ein Buch|читать книгу
  sehen|einen Film|смотреть фильм
  nehmen|den Bus|ехать на автобусе
  schlafen|lange|долго спать
  essen|ein Eis|есть мороженое
  fahren|nach Hause|ехать домой
  vergessen|den Termin|забывать о встрече
  treffen|einen Freund|встречать друга
  tragen|eine Tasche|нести сумку
  waschen|das Auto|мыть машину
  helfen|der Freundin|помогать подруге
  laufen|in den Park|бежать в парк
  geben|dem Kind ein Bonbon|давать ребёнку конфету
  einladen|Freunde|приглашать друзей
  anrufen|die Mutter|звонить маме
  aufstehen|früh|рано вставать
  mitkommen|ins Kino|идти вместе в кино
  ankommen|pünktlich|приходить вовремя
  einschlafen|vor dem Fernseher|засыпать перед телевизором
  aussehen|müde|выглядеть уставшим
  fernsehen|zu lange|слишком долго смотреть телевизор
  zurückkommen|spät|поздно возвращаться
  mitbringen|Blumen|приносить с собой цветы
  kochen|Nudeln|варить макароны
  hören|Musik|слушать музыку
  spielen|Tennis|играть в теннис
  lernen|Vokabeln|учить слова
  kaufen|ein Geschenk|покупать подарок
  wohnen|in Berlin|жить в Берлине
  arbeiten|im Garten|работать в саду
  machen|einen Ausflug|совершать экскурсию
  besuchen|einen Freund|навещать друга
  bleiben|zu Hause|оставаться дома
  gehen|nach Hause|идти домой
  schreiben|einen Brief|писать письмо
  sein|müde|быть уставшим
  sein|krank|быть больным
  sein|im Urlaub|быть в отпуске
  sein|sehr glücklich|быть очень счастливым
  haben|keine Zeit|не иметь времени
  haben|Kopfschmerzen|иметь головную боль
  haben|viel Arbeit|иметь много работы
  haben|einen Termin beim Arzt|иметь запись к врачу
  sich freuen|auf das Wochenende|радоваться предстоящим выходным|p
  warten|auf den Bus|ждать автобус|p
  sprechen|mit dem Lehrer|говорить с учителем|pp
  denken|an den Urlaub|думать об отпуске|p
  sich interessieren|für Sport|интересоваться спортом|p
  sich kümmern|um den Hund|заботиться о собаке|p
`);
