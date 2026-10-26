import { List, P, Scheme, Tbl, Tip } from '../../components/Explain';
import { MAIN } from './shared';

export function Modalverben() {
  return (
    <>
      <P>
        Модальный глагол стоит на 2-й позиции, а смысловой глагол — <b>в инфинитиве в конце</b>.
      </P>
      <Scheme
        cols={MAIN}
        rows={[
          ['Ich', '**will**', 'heute Deutsch', '**lernen**.'],
          ['Heute', '**kann**', 'Malo nicht', '**kommen**.'],
          ['**Musst**', 'du', 'am Samstag', '**arbeiten**?'],
        ]}
      />
      <Tbl
        head={['', 'können', 'müssen', 'wollen', 'dürfen', 'sollen', 'möchten']}
        rows={[
          ['ich', '**kann**', '**muss**', '**will**', '**darf**', 'soll', 'möchte'],
          ['du', 'kannst', 'musst', 'willst', 'darfst', 'sollst', 'möchtest'],
          ['er/sie/es', '**kann**', '**muss**', '**will**', '**darf**', 'soll', 'möchte'],
          ['wir', 'können', 'müssen', 'wollen', 'dürfen', 'sollen', 'möchten'],
          ['ihr', 'könnt', 'müsst', 'wollt', 'dürft', 'sollt', 'möchtet'],
          ['sie/Sie', 'können', 'müssen', 'wollen', 'dürfen', 'sollen', 'möchten'],
        ]}
      />
      <Tip kind="warn">
        У ich и er/sie/es <b>одинаковые формы и нет окончания</b>: ich kann, er kann (не «er kannt»).
      </Tip>
      <List
        items={[
          '**können** — мочь, уметь (can)',
          '**müssen** — должен, надо (must / have to)',
          '**wollen** — хотеть (want)',
          '**dürfen** — можно, разрешено (may); **nicht dürfen** — нельзя',
          '**sollen** — должен по чужой воле (be supposed to)',
          '**möchten** — хотелось бы (would like)',
        ]}
      />
      <Tip kind="en">
        Осторожно: <b>ich will</b> = <i>I want</i>, а не <i>I will</i>! <b>Du musst nicht</b> = <i>you don't have to</i>, а
        «нельзя» — это <b>du darfst nicht</b>.
      </Tip>
    </>
  );
}
