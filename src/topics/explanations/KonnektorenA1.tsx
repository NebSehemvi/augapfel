import { Ex, H, List, P, Scheme, Tip } from '../../components/Explain';

export function KonnektorenA1() {
  return (
    <>
      <P>
        Союзы <b>und, aber, oder, denn</b> (а также <b>sondern</b>) соединяют два главных предложения и стоят на{' '}
        <b>позиции 0</b> — они не занимают место, порядок слов не меняется.
      </P>
      <Scheme
        cols={['Позиция 0', 'Позиция 1', 'Глагол', 'Остальное']}
        rows={[
          ['', 'Ich', 'bin', 'müde,'],
          ['**aber**', 'ich', 'koche', 'das Abendessen.'],
          ['**denn**', 'ich', 'habe', 'Hunger.'],
        ]}
      />
      <List
        items={[
          '**und** — и',
          '**aber** — но, однако',
          '**oder** — или',
          '**denn** — потому что (причина)',
        ]}
      />
      <H>А вот dann — наречие!</H>
      <P>
        <b>dann, danach, zuerst, heute, deshalb…</b> занимают <b>позицию 1</b>, поэтому после них — инверсия:
      </P>
      <Ex de="Zuerst frühstücke ich, **dann gehe ich** zur Arbeit." ru="Сначала я завтракаю, потом иду на работу." />
      <Tip kind="warn">
        «Ich bin müde, denn ich <b>habe</b> …» — после <b>denn</b> обычный порядок. После <b>weil</b> (тема A2) глагол
        уходит в конец.
      </Tip>
    </>
  );
}
