import { H, P, Scheme, Tbl, Tip } from '../../components/Explain';
import { MAIN } from './shared';

export function PerfektHaben() {
  return (
    <>
      <P>
        Perfekt — главное прошедшее время в разговорной речи. Формула: <b>haben/sein</b> (на 2-й позиции) +{' '}
        <b>Partizip II</b> (в конце).
      </P>
      <Scheme
        cols={MAIN}
        rows={[
          ['Ich', 'habe', 'gestern Pizza', '**gekocht**.'],
          ['Gestern', 'hat', 'Anna viel', '**gearbeitet**.'],
        ]}
      />
      <H>Partizip II слабых (правильных) глаголов</H>
      <P>
        <b>ge-</b> + основа + <b>-t</b>:
      </P>
      <Tbl
        head={['инфинитив', 'Partizip II']}
        rows={[
          ['machen', '**ge**mach**t**'],
          ['kaufen', '**ge**kauf**t**'],
          ['arbeiten', '**ge**arbeit**et**'],
          ['öffnen', '**ge**öffn**et**'],
        ]}
      />
      <Tip>Основа на -t/-d (и -chn, -ffn) → окончание -et, как и в Präsens: gearbeitet, geredet.</Tip>
      <Tip kind="en">
        Немецкий Perfekt используется как обычное прошедшее время: <i>Ich habe gestern gekocht</i> = <i>I cooked yesterday</i>
        (не <i>I have cooked</i>).
      </Tip>
    </>
  );
}
