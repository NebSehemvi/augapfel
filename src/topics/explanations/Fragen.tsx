import { Ex, H, P, Scheme, Tbl, Tip } from '../../components/Explain';
import { MAIN } from './shared';

export function Fragen() {
  return (
    <>
      <H>Вопрос с вопросительным словом (W-Frage)</H>
      <P>W-слово — на 1-й позиции, глагол — на 2-й, подлежащее — после глагола.</P>
      <Scheme
        cols={MAIN}
        rows={[
          ['**Was**', 'machst', 'du am Wochenende?', ''],
          ['**Wann**', 'hast', 'du den Kuchen', 'gebacken?'],
          ['**Wo**', 'kann', 'ich hier', 'parken?'],
        ]}
      />
      <Tbl
        head={['W-слово', 'значение']}
        rows={[
          ['wer / wen / wem', 'кто / кого / кому'],
          ['was', 'что'],
          ['wo / woher / wohin', 'где / откуда / куда'],
          ['wann / wie lange / wie oft', 'когда / как долго / как часто'],
          ['wie / wie viel', 'как / сколько'],
          ['warum', 'почему'],
        ]}
      />
      <H>Вопрос без вопросительного слова (да/нет)</H>
      <P>
        Глагол — на <b>1-й позиции</b>:
      </P>
      <Ex de="**Kommst** du morgen?" ru="Ты придёшь завтра?" />
      <Ex de="**Hast** du am Abend Tennis **gespielt**?" ru="Ты вечером играл в теннис?" />
      <Tip kind="en">
        Никакого вспомогательного <i>do</i>: <i>Do you play tennis?</i> → <b>Spielst</b> du Tennis?
      </Tip>
    </>
  );
}
