import { Ex, H, P, Tbl, Tip } from '../../components/Explain';

export function Wechselpraep() {
  return (
    <>
      <P>
        Предлоги <b>in, an, auf, unter, über, vor, hinter, neben, zwischen</b> бывают с Akkusativ и с Dativ — в зависимости от
        вопроса.
      </P>
      <Tbl
        head={['вопрос', 'падеж', 'пример']}
        rows={[
          ['**Wohin?** (куда? движение)', 'Akkusativ', 'Ich lege das Buch auf **den** Tisch.'],
          ['**Wo?** (где? место)', 'Dativ', 'Das Buch liegt auf **dem** Tisch.'],
        ]}
      />
      <H>Пары глаголов</H>
      <Tbl
        head={['действие (wohin? + Akk)', 'состояние (wo? + Dat)']}
        rows={[
          ['stellen — ставить', 'stehen — стоять'],
          ['legen — класть', 'liegen — лежать'],
          ['setzen — сажать', 'sitzen — сидеть'],
          ['hängen (hängte) — вешать', 'hängen (hing) — висеть'],
          ['gehen, fahren (in die Stadt)', 'sein, bleiben (in der Stadt)'],
        ]}
      />
      <Tip>
        Слияния: in dem → <b>im</b>, in das → <b>ins</b>, an dem → <b>am</b>, an das → <b>ans</b>.
      </Tip>
      <Ex de="Ich stelle die Milch **in den** Kühlschrank. — Die Milch steht **im** Kühlschrank." />
      <Tip kind="en">
        Как английское <i>into</i> vs <i>in</i>: <i>put it into the fridge</i> (Akk) — <i>it's in the fridge</i> (Dat).
      </Tip>
    </>
  );
}
