import { H, List, P, Tbl, Tip } from '../../components/Explain';

export function PraesensIrregular() {
  return (
    <>
      <P>
        Многие сильные глаголы меняют гласную в формах <b>du</b> и <b>er/sie/es</b>. Остальные формы — как у правильных.
      </P>
      <Tbl
        head={['', 'e → i', 'e → ie', 'a → ä', 'au → äu']}
        rows={[
          ['ich', 'spreche', 'lese', 'fahre', 'laufe'],
          ['du', 'spr**i**chst', 'l**ie**st', 'f**ä**hrst', 'l**äu**fst'],
          ['er/sie/es', 'spr**i**cht', 'l**ie**st', 'f**ä**hrt', 'l**äu**ft'],
          ['wir', 'sprechen', 'lesen', 'fahren', 'laufen'],
          ['ihr', 'sprecht', 'lest', 'fahrt', 'lauft'],
          ['sie/Sie', 'sprechen', 'lesen', 'fahren', 'laufen'],
        ]}
      />
      <List
        items={[
          '**e → i**: essen (isst), geben, helfen, nehmen (nimmt!), sprechen, treffen, vergessen',
          '**e → ie**: lesen, sehen, empfehlen',
          '**a → ä**: fahren, schlafen, tragen, waschen, fallen, halten, gefallen',
        ]}
      />
      <H>Совсем неправильные</H>
      <Tbl
        head={['', 'sein', 'haben', 'werden', 'wissen']}
        rows={[
          ['ich', 'bin', 'habe', 'werde', 'weiß'],
          ['du', 'bist', '**hast**', '**wirst**', 'weißt'],
          ['er/sie/es', 'ist', '**hat**', '**wird**', 'weiß'],
          ['wir', 'sind', 'haben', 'werden', 'wissen'],
          ['ihr', 'seid', 'habt', 'werdet', 'wisst'],
          ['sie/Sie', 'sind', 'haben', 'werden', 'wissen'],
        ]}
      />
      <Tip kind="warn">
        В форме <b>ihr</b> гласная не меняется: ihr fahrt, ihr esst, ihr lest.
      </Tip>
    </>
  );
}
