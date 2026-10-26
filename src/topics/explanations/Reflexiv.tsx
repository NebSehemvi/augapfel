import { Ex, H, P, Scheme, Tbl, Tip } from '../../components/Explain';
import { MAIN } from './shared';

export function Reflexiv() {
  return (
    <>
      <P>
        Возвратные глаголы употребляются с местоимением <b>sich</b>, которое меняется по лицам (в русском — «-ся»).
      </P>
      <Tbl
        head={['', 'sich freuen', 'Akk', 'Dat']}
        rows={[
          ['ich', 'freue **mich**', 'mich', 'mir'],
          ['du', 'freust **dich**', 'dich', 'dir'],
          ['er/sie/es', 'freut **sich**', 'sich', 'sich'],
          ['wir', 'freuen **uns**', 'uns', 'uns'],
          ['ihr', 'freut **euch**', 'euch', 'euch'],
          ['sie/Sie', 'freuen **sich**', 'sich', 'sich'],
        ]}
      />
      <H>Место в предложении</H>
      <P>Возвратное местоимение стоит сразу после спрягаемого глагола (или после подлежащего-местоимения при инверсии):</P>
      <Scheme
        cols={MAIN}
        rows={[
          ['Ich', 'freue', '**mich** auf das Wochenende.', ''],
          ['Heute', 'habe', 'ich **mich** sehr', 'beeilt.'],
          ['Am Abend', 'ziehe', 'ich **mich**', 'um.'],
        ]}
      />
      <H>mich или mir?</H>
      <P>
        Если в предложении есть ещё одно прямое дополнение (Akkusativ), местоимение переходит в <b>Dativ</b>:
      </P>
      <Ex de="Ich wasche **mich**. — Ich wasche **mir** die Hände." ru="Я умываюсь. — Я мою руки." />
      <Tip>Perfekt возвратных глаголов — всегда с haben: Ich habe mich gefreut.</Tip>
    </>
  );
}
