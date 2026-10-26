import { H, List, P, Scheme, Tip } from '../../components/Explain';
import { MAIN } from './shared';

export function SatzbauInversion() {
  return (
    <>
      <P>
        Главное правило немецкого предложения: <b>спрягаемый глагол стоит на 2-й позиции</b>. На первой позиции может стоять
        что угодно — подлежащее, время, место. Если первое место занято не подлежащим, подлежащее переходит <b>за</b> глагол —
        это и есть <b>инверсия</b>.
      </P>
      <Scheme
        cols={MAIN}
        rows={[
          ['Ich', 'habe', 'am Abend einen Kuchen', 'gebacken.'],
          ['**Am Abend**', 'habe', '**ich** einen Kuchen', 'gebacken.'],
          ['Wir', 'trinken', 'am Morgen Kaffee.', ''],
          ['**Am Morgen**', 'trinken', '**wir** Kaffee.', ''],
        ]}
      />
      <H>Рамка (Satzklammer)</H>
      <P>
        Если глагольная форма состоит из двух частей, они образуют «рамку»: спрягаемая часть — на 2-й позиции, вторая часть — в
        самом <b>конце</b>.
      </P>
      <List
        items={[
          'Perfekt: Ich **habe** gestern Tennis **gespielt**.',
          'Модальный глагол: Am Montag **muss** ich früh **aufstehen**.',
          'Отделяемая приставка: Morgen **rufe** ich dich **an**.',
        ]}
      />
      <Tip kind="en">
        В английском инверсия бывает только в вопросах. По-английски <i>In the evening I baked a cake</i>, а по-немецки
        <i> Am Abend habe ich …</i> — никогда не «Am Abend ich habe».
      </Tip>
      <Tip kind="warn">
        Позиция = <b>член предложения</b>, а не слово. «Am Samstagabend» или «Nach der Arbeit» — это одна позиция.
      </Tip>
      <Tip>Сравните с русским: «Вечером я испёк торт» — порядок свободный. В немецком глагол «держит» второе место всегда.</Tip>
    </>
  );
}
