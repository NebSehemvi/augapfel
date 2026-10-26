import { Ex, H, List, P, Tbl, Tip } from '../../components/Explain';

export function PerfektSein() {
  return (
    <>
      <H>Сильные глаголы: ge- … -en</H>
      <P>
        У сильных глаголов Partizip II оканчивается на <b>-en</b>, а гласная часто меняется. Эти формы нужно учить — они есть в
        таблице сильных глаголов.
      </P>
      <Tbl
        head={['инфинитив', 'Partizip II']}
        rows={[
          ['essen', '**ge**gess**en**'],
          ['schreiben', '**ge**schr**ie**b**en**'],
          ['trinken', '**ge**tr**u**nk**en**'],
          ['gehen', '**ge**g**a**ng**en**'],
          ['bringen / denken', 'gebr**acht** / ged**acht** (смешанные)'],
        ]}
      />
      <H>haben или sein?</H>
      <P>
        Большинство глаголов — с <b>haben</b>. С <b>sein</b>:
      </P>
      <List
        items={[
          'движение из точки A в точку B: **gehen, fahren, fliegen, laufen, kommen, reisen**',
          'изменение состояния: **aufstehen, einschlafen, aufwachen, werden, sterben**',
          'и: **sein, bleiben, passieren**',
        ]}
      />
      <Ex de="Ich **bin** nach Berlin **gefahren**." ru="Я поехал(а) в Берлин." />
      <Ex de="Wir **sind** lange im Hotel **geblieben**." ru="Мы долго оставались в отеле." />
      <Tip>
        Подсказка: если глагол отвечает на вопрос «куда?» или описывает переход в новое состояние — скорее всего, <b>sein</b>.
      </Tip>
    </>
  );
}
