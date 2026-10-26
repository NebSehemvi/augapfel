import { Ex, H, List, Tbl, Tip } from '../../components/Explain';

export function PerfektBesonders() {
  return (
    <>
      <H>Отделяемые глаголы: ge- в середине</H>
      <Tbl
        head={['инфинитив', 'Partizip II']}
        rows={[
          ['aufstehen', 'auf**ge**standen'],
          ['einkaufen', 'ein**ge**kauft'],
          ['anrufen', 'an**ge**rufen'],
          ['fernsehen', 'fern**ge**sehen'],
        ]}
      />
      <H>Без ge-</H>
      <List
        items={[
          'неотделяемые приставки **be-, ver-, er-, ent-, emp-, ge-, zer-**: besucht, verstanden, erzählt, bekommen, gehört',
          'глаголы на **-ieren**: studiert, telefoniert, fotografiert, repariert',
        ]}
      />
      <Ex de="Ich **habe** dich gestern **angerufen**." ru="Я звонил(а) тебе вчера." />
      <Ex de="Wir **haben** in Wien **studiert**." ru="Мы учились в Вене." />
      <Tip kind="warn">
        Не путайте: <b>ver</b>gessen → vergessen (без ge-), но <b>ein</b>kaufen → ein<b>ge</b>kauft.
      </Tip>
    </>
  );
}
