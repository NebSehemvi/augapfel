import { Ex, H, List, P, Tbl, Tip } from '../../components/Explain';

export function Uhrzeit() {
  return (
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
  );
}
