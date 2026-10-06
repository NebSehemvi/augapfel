import type { ReactNode } from 'react';
import { Ex, H, List, P, Tbl, Tip } from '../components/Explain';

/** Explanations of the "Числа и время" topics. */
export const EXPLAIN_NUMBERS: Record<string, () => ReactNode> = {
  zahlen: () => (
    <>
      <Tbl
        head={['', '', '', '']}
        rows={[
          ['0 null', '1 eins', '2 zwei', '3 drei'],
          ['4 vier', '5 fünf', '6 sechs', '7 sieben'],
          ['8 acht', '9 neun', '10 zehn', '11 elf'],
          ['12 zwölf', '13 dreizehn', '16 **sechzehn**', '17 **siebzehn**'],
          ['20 zwanzig', '30 **dreißig**', '60 **sechzig**', '70 **siebzig**'],
        ]}
        caption="Выделены формы, которые теряют часть слова или пишутся через ß"
      />
      <H>Сначала единицы, потом десятки</H>
      <P>
        Числа от 21 до 99 читаются «наоборот»: единицы + <b>und</b> + десятки, и всё одним словом. По-русски мы говорим десятки
        первыми — это главная ловушка.
      </P>
      <Tbl
        head={['', 'по-немецки', 'дословно']}
        rows={[
          ['21', '**ein**und**zwanzig**', 'один-и-двадцать'],
          ['67', '**sieben**und**sechzig**', 'семь-и-шестьдесят'],
          ['98', '**acht**und**neunzig**', 'восемь-и-девяносто'],
        ]}
      />
      <List
        items={[
          'Одно число — **eins**, но внутри слова — **ein**: ein**und**zwanzig, (ein)hundert.',
          'Сотни и тысячи тоже одним словом: **dreihundertvierzig** (340), **hunderteins** (101), **zweitausendvierundzwanzig** (2024).',
          '«hundert» и «tausend» можно говорить с **ein-** и без: (ein)hundert, (ein)tausend.',
        ]}
      />
      <Tip kind="en">Так же было в старом английском: «four-and-twenty blackbirds» = 24.</Tip>
      <H>Цены</H>
      <P>
        В цене — <b>запятая</b>, а не точка. «Cent» после евро обычно не говорят: <i>3,49 €</i> — «drei Euro neunundvierzig».
      </P>
      <Tbl
        head={['Цена', 'Как сказать']}
        rows={[
          ['3,49 €', 'drei Euro **neunundvierzig**'],
          ['1,00 €', '**ein** Euro'],
          ['0,50 €', 'fünfzig **Cent**'],
          ['12,05 €', 'zwölf Euro fünf'],
        ]}
      />
      <Tip>
        Номер телефона читают по одной цифре или парами. По телефону вместо <b>zwei</b> часто говорят <b>zwo</b>, чтобы не спутать
        с <b>drei</b>.
      </Tip>
      <Ex de="Was **kostet** der Kaffee? — **Zwei Euro achtzig**." ru="Сколько стоит кофе? — Два евро восемьдесят." />
      <Ex de="Wie viel **kosten** die Äpfel? — **Drei Euro neunundvierzig** das Kilo." ru="Сколько стоят яблоки? — 3,49 € за килограмм." />
      <Ex de="Meine Nummer ist null-eins-sieben-**zwo** …" ru="Мой номер: 0-1-7-2…" />
    </>
  ),

  uhrzeit: () => (
    <>
      <P>
        Вопрос: <b>Wie spät ist es?</b> или <b>Wie viel Uhr ist es?</b> Ответ: <b>Es ist …</b> Есть два способа говорить о
        времени.
      </P>
      <H>Официальное время (24 часа)</H>
      <P>
        Как на вокзале, по радио, при записи к врачу: часы + <b>Uhr</b> + минуты. <i>15:30</i> — «fünfzehn Uhr dreißig». В 1:00 —{' '}
        <b>ein Uhr</b> (не «eins Uhr»).
      </P>
      <H>Время в разговоре (12 часов)</H>
      <Tbl
        head={['', 'Es ist …']}
        rows={[
          ['3:00', 'drei'],
          ['3:05', 'fünf **nach** drei'],
          ['3:15', '**Viertel nach** drei'],
          ['3:20', 'zwanzig nach drei / zehn vor halb vier'],
          ['3:25', 'fünf vor **halb vier**'],
          ['3:30', '**halb vier**'],
          ['3:35', 'fünf nach **halb vier**'],
          ['3:40', 'zwanzig **vor** vier'],
          ['3:45', '**Viertel vor** vier'],
          ['3:55', 'fünf vor vier'],
        ]}
      />
      <Tip kind="warn">
        <b>halb vier</b> = 3:30, то есть «половина <b>к</b> четырём». Так же, как русское «полчетвёртого». Не 4:30!
      </Tip>
      <Tip kind="en">
        Ловушка для английского: британское «half three» = 3:30 (половина <b>после</b> трёх), а немецкое «halb drei» = 2:30.
      </Tip>
      <H>Предлоги</H>
      <List
        items={[
          '**um** — во сколько: Der Kurs beginnt **um** neun Uhr.',
          '**von … bis** — с … до: Ich arbeite **von** acht **bis** vier.',
          '**gegen** — около: Ich komme **gegen** acht.',
          '**Wann** …? — когда? (ответ с um), **Wie spät** …? — который час? (ответ «Es ist …»)',
        ]}
      />
      <Ex de="Wie spät ist es? — Es ist **Viertel nach** zwei." ru="Который час? — Четверть третьего." />
      <Ex de="Der Zug fährt **um** siebzehn Uhr zwölf ab." ru="Поезд отправляется в 17:12." />
      <Ex de="Wir treffen uns **um halb acht**." ru="Встречаемся в половине восьмого (в 7:30)." />
    </>
  ),

  datum: () => (
    <>
      <P>
        Месяцы: Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember — все мужского рода
        (<b>der</b> Mai). Дни недели тоже: <b>der</b> Montag.
      </P>
      <H>Порядковые числа</H>
      <P>
        На письме — цифра с точкой: <b>3.</b> = dritte. До 19 добавляем <b>-te</b>, с 20 — <b>-ste</b>.
      </P>
      <Tbl
        head={['', '', '']}
        rows={[
          ['1. **erste**', '2. zweite', '3. **dritte**'],
          ['4. vierte', '7. **siebte**', '8. **achte**'],
          ['12. zwölfte', '19. neunzehnte', '20. zwanzig**ste**'],
          ['21. einundzwanzig**ste**', '30. dreißig**ste**', '31. einunddreißig**ste**'],
        ]}
        caption="Выделены особые формы: erste, dritte, siebte, achte"
      />
      <H>der dritte Mai или am dritten Mai?</H>
      <Tbl
        head={['Какое сегодня число?', 'Когда?']}
        rows={[
          ['Heute ist **der** dritt**e** Mai.', 'Ich habe **am** dritt**en** Mai Geburtstag.'],
          ['der erste Januar', 'am ersten Januar'],
          ['der vierundzwanzigste Dezember', 'am vierundzwanzigsten Dezember'],
        ]}
      />
      <H>am, im, um</H>
      <List
        items={[
          '**am** + день или дата: **am** Montag, **am** Wochenende, **am** 3. Mai',
          '**im** + месяц или время года: **im** Mai, **im** Sommer',
          '**um** + время на часах: **um** acht Uhr, **um** halb neun',
          '**vom … bis zum** …: **vom** ersten **bis zum** fünften Juni',
        ]}
      />
      <H>Годы</H>
      <P>
        До 2000 года — сотнями: <i>1989</i> — «neunzehnhundertneunundachtzig». С 2000 — как обычное число: <i>2024</i> —
        «zweitausendvierundzwanzig». Перед годом предлог не нужен (<i>2020 war ich in Berlin</i>) или говорят «im Jahr 2020».
      </P>
      <Tip>Дату пишут как в России: сначала день, потом месяц — 03.05.2024 = 3 мая.</Tip>
      <Ex de="Heute ist **der zwölfte** März." ru="Сегодня двенадцатое марта." />
      <Ex de="Wann hast du Geburtstag? — **Am siebten** Juli." ru="Когда у тебя день рождения? — Седьмого июля." />
      <Ex de="Ich bin **neunzehnhundertneunzig** geboren." ru="Я родился (родилась) в 1990 году." en="I was born in 1990." />
    </>
  ),
};
