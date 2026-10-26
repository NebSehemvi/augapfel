import { Ex, H, List, P, Tbl, Tip } from '../../components/Explain';

export function Zahlen() {
  return (
    <>
      <Tbl
        head={['', '', '', '']}
        rows={[
          ['0 null', '1 eins', '2 zwei', '3 drei'],
          ['4 vier', '5 fünf', '6 sechs', '7 sieben'],
          ['8 acht', '9 neun', '10 zehn', '11 elf'],
          ['12 zwölf', '13 dreizehn', '16 **sechzehn**', '17 **siebzehn**'],
          ['20 zwanzig', '30 **dreißig**', '60 **sechzig**', '70 **siebzig**'],
        ]}
        caption="Выделены формы, которые теряют часть слова или пишутся через ß"
      />
      <H>Сначала единицы, потом десятки</H>
      <P>
        Числа от 21 до 99 читаются «наоборот»: единицы + <b>und</b> + десятки, и всё одним словом. По-русски мы говорим десятки
        первыми — это главная ловушка.
      </P>
      <Tbl
        head={['', 'по-немецки', 'дословно']}
        rows={[
          ['21', '**ein**und**zwanzig**', 'один-и-двадцать'],
          ['67', '**sieben**und**sechzig**', 'семь-и-шестьдесят'],
          ['98', '**acht**und**neunzig**', 'восемь-и-девяносто'],
        ]}
      />
      <List
        items={[
          'Одно число — **eins**, но внутри слова — **ein**: ein**und**zwanzig, (ein)hundert.',
          'Сотни и тысячи тоже одним словом: **dreihundertvierzig** (340), **hunderteins** (101), **zweitausendvierundzwanzig** (2024).',
          '«hundert» и «tausend» можно говорить с **ein-** и без: (ein)hundert, (ein)tausend.',
        ]}
      />
      <Tip kind="en">Так же было в старом английском: «four-and-twenty blackbirds» = 24.</Tip>
      <H>Цены</H>
      <P>
        В цене — <b>запятая</b>, а не точка. «Cent» после евро обычно не говорят: <i>3,49 €</i> — «drei Euro neunundvierzig».
      </P>
      <Tbl
        head={['Цена', 'Как сказать']}
        rows={[
          ['3,49 €', 'drei Euro **neunundvierzig**'],
          ['1,00 €', '**ein** Euro'],
          ['0,50 €', 'fünfzig **Cent**'],
          ['12,05 €', 'zwölf Euro fünf'],
        ]}
      />
      <Tip>
        Номер телефона читают по одной цифре или парами. По телефону вместо <b>zwei</b> часто говорят <b>zwo</b>, чтобы не спутать
        с <b>drei</b>.
      </Tip>
      <Ex de="Was **kostet** der Kaffee? — **Zwei Euro achtzig**." ru="Сколько стоит кофе? — Два евро восемьдесят." />
      <Ex de="Wie viel **kosten** die Äpfel? — **Drei Euro neunundvierzig** das Kilo." ru="Сколько стоят яблоки? — 3,49 € за килограмм." />
      <Ex de="Meine Nummer ist null-eins-sieben-**zwo** …" ru="Мой номер: 0-1-7-2…" />
    </>
  );
}
