import { List, P, Scheme, Tip } from '../../components/Explain';
import { MAIN } from './shared';

export function Trennbare() {
  return (
    <>
      <P>
        У многих глаголов есть <b>отделяемая приставка</b>: auf-stehen, ein-kaufen, an-rufen. В простом предложении в Präsens
        приставка уходит <b>в конец</b>, образуя рамку.
      </P>
      <Scheme
        cols={MAIN}
        rows={[
          ['Ich', 'stehe', 'um 7 Uhr', '**auf**.'],
          ['Am Samstag', 'kaufe', 'ich im Supermarkt', '**ein**.'],
          ['Ich', 'muss', 'morgen früh', '**aufstehen**.'],
        ]}
      />
      <List
        items={[
          'Отделяемые (ударные): **ab-, an-, auf-, aus-, ein-, mit-, vor-, zu-, zurück-, fern-, statt-, teil-…**',
          'Неотделяемые (безударные): **be-, ge-, er-, ver-, zer-, ent-, emp-, miss-** — bezahlen, verstehen, erzählen.',
        ]}
      />
      <Tip>
        С модальным глаголом и в придаточном предложении приставка не отделяется: <i>Ich muss früh aufstehen</i>,{' '}
        <i>…, weil ich früh aufstehe</i>.
      </Tip>
      <Tip kind="en">
        Похоже на английские phrasal verbs: <i>get up</i>, <i>call up</i>. Но в немецком приставка уезжает в самый конец:{' '}
        <i>Ich rufe dich morgen an</i> — <i>I'll call you up tomorrow</i>.
      </Tip>
    </>
  );
}
