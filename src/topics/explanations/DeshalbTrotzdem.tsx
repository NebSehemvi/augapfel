import { Ex, P, Scheme, Tbl, Tip } from '../../components/Explain';
import { MAIN } from './shared';

export function DeshalbTrotzdem() {
  return (
    <>
      <P>
        <b>deshalb</b> (поэтому) и <b>trotzdem</b> (тем не менее, всё равно) — наречия. Они стоят на <b>позиции 1</b>, поэтому
        за ними сразу идёт глагол.
      </P>
      <Scheme
        cols={MAIN}
        rows={[
          ['**Deshalb**', 'esse', 'ich einen Salat.', ''],
          ['**Trotzdem**', 'habe', 'ich das Abendessen', 'gekocht.'],
          ['**Dann**', 'gehe', 'ich ins Bett.', ''],
        ]}
      />
      <Ex de="Ich habe Hunger. **Deshalb esse** ich einen Salat." ru="Я голоден. Поэтому я ем салат." />
      <Ex de="Ich bin müde, **trotzdem gehe** ich ins Fitnessstudio." ru="Я устал, но всё равно иду в спортзал." />
      <Tbl
        head={['', 'тип', 'порядок слов']}
        rows={[
          ['und, aber, oder, denn', 'союз, позиция 0', 'Ich bin müde, **denn** ich **habe** viel gearbeitet.'],
          ['deshalb, trotzdem, dann, danach, zuerst', 'наречие, позиция 1', 'Ich habe viel gearbeitet, **deshalb bin** ich müde.'],
          ['weil, dass, wenn, obwohl', 'подчинительный союз', 'Ich bin müde, **weil** ich viel gearbeitet **habe**.'],
        ]}
      />
      <Tip>
        Сравните: <b>weil</b> → причина, <b>deshalb</b> → следствие. «Ich habe Hunger, deshalb esse ich» = «Ich esse, weil ich
        Hunger habe».
      </Tip>
    </>
  );
}
