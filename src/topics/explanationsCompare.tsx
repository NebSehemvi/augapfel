import type { ReactNode } from 'react';
import { Ex, H, List, P, Tbl, Tip } from '../components/Explain';

/** Explanation of the comparisons topic. */
export const EXPLAIN_COMPARE: Record<string, () => ReactNode> = {
  vergleiche: () => (
    <>
      <P>
        Когда сравниваем, есть два случая: <b>одинаково</b> — <b>so … wie</b>, и <b>больше / меньше</b> — сравнительная степень +{' '}
        <b>als</b>.
      </P>
      <Tbl
        head={['', 'Пример', 'Перевод']}
        rows={[
          ['=', 'Tom ist **so groß wie** Anna.', 'Том такой же высокий, как Анна.'],
          ['≠', 'Tom ist **nicht so groß wie** Anna.', 'Том не такой высокий, как Анна.'],
          ['>', 'Tom ist **größer als** Anna.', 'Том выше, чем Анна.'],
        ]}
      />
      <Tip kind="warn">
        После сравнительной степени — только <b>als</b>: <i>größer als</i>, не <i>größer wie</i>. Русское «как» и английское «as» тянут
        к <i>wie</i> — это главная ошибка.
      </Tip>
      <Tip kind="en">
        Похоже на английский: <i>as tall as</i> = <b>so groß wie</b>, <i>taller than</i> = <b>größer als</b>.
      </Tip>
      <H>Сравнительная степень: -er</H>
      <Tbl
        head={['', 'Komparativ', 'Superlativ']}
        rows={[
          ['schnell', 'schnell**er**', 'am schnell**sten**'],
          ['klein', 'klein**er**', 'am klein**sten**'],
          ['alt', '**ä**lt**er**', 'am **ä**lt**esten**'],
          ['groß', 'gr**ö**ß**er**', 'am gr**ö**ß**ten**'],
          ['jung', 'j**ü**ng**er**', 'am j**ü**ng**sten**'],
        ]}
      />
      <List
        items={[
          'Короткие прилагательные с **a, o, u** часто получают умлаут: alt → **ä**lter, kalt → k**ä**lter, groß → gr**ö**ßer, jung → j**ü**nger, warm → w**ä**rmer, lang → l**ä**nger.',
          'На **-er** теряют e: teuer → **teurer** (не teuerer).',
          'После **-t, -s, -ß, -z** в превосходной степени вставляем **-e-**: am ält**e**sten, am heiß**e**sten.',
        ]}
      />
      <H>Особые формы — выучить</H>
      <Tbl
        head={['', 'Komparativ', 'Superlativ']}
        rows={[
          ['gut', '**besser**', 'am **besten**'],
          ['viel', '**mehr**', 'am **meisten**'],
          ['gern', '**lieber**', 'am **liebsten**'],
          ['hoch', '**höher**', 'am **höchsten**'],
          ['nah', '**näher**', 'am **nächsten**'],
        ]}
      />
      <P>
        <b>gern → lieber</b> — так говорят о том, что нравится больше: <i>Ich trinke lieber Tee als Kaffee.</i>
      </P>
      <H>Превосходная степень: am …sten</H>
      <P>
        После глагола — <b>am + -sten</b>: <i>Max läuft am schnellsten.</i> «Самый» перед существительным (<i>der schnellste
        Läufer</i>) — уже тема A2.
      </P>
      <Ex de="Mein Bruder ist **älter als** ich." ru="Мой брат старше меня." />
      <Ex de="Heute ist es **so warm wie** gestern." ru="Сегодня так же тепло, как вчера." />
      <Ex de="Ich trinke **lieber** Tee **als** Kaffee." ru="Я больше люблю чай, чем кофе." en="I prefer tea to coffee." />
      <Ex de="Im Juli ist es **am heißesten**." ru="В июле жарче всего." />
    </>
  ),
};
