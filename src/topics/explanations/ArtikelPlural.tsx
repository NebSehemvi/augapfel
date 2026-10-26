import { H, List, P, Tbl, Tip } from '../../components/Explain';

export function ArtikelPlural() {
  return (
    <>
      <P>
        У каждого существительного есть род: <b>der</b> (мужской), <b>die</b> (женский), <b>das</b> (средний). Род нужно учить
        вместе со словом — он не всегда совпадает с русским (der Tisch, но <i>das</i> Mädchen).
      </P>
      <Tbl
        head={['', 'm', 'f', 'n', 'Plural']}
        rows={[
          ['определённый', 'der', 'die', 'das', 'die'],
          ['неопределённый', 'ein', 'eine', 'ein', '—'],
          ['отрицание', 'kein', 'keine', 'kein', 'keine'],
        ]}
      />
      <H>Подсказки по роду</H>
      <List
        items={[
          '**die**: -ung, -heit, -keit, -ion, -schaft, -e (большинство): die Zeitung, die Lampe',
          '**der**: дни, месяцы, времена года; -er (люди), -ling: der Montag, der Lehrer',
          '**das**: -chen, -lein, -um, -ment; инфинитивы: das Mädchen, das Museum, das Essen',
        ]}
      />
      <H>Множественное число</H>
      <Tbl
        head={['тип', 'примеры']}
        rows={[
          ['- / ¨-', 'der Lehrer → die Lehrer, der Bruder → die Br**ü**der'],
          ['-(e)n', 'die Frau → die Frau**en**, die Lampe → die Lampe**n**, die Freundin → Freundin**nen**'],
          ['-e / ¨-e', 'der Tag → die Tag**e**, die Stadt → die St**ä**dt**e**'],
          ['-er / ¨-er', 'das Kind → die Kind**er**, das Haus → die H**ä**us**er**'],
          ['-s', 'das Auto → die Auto**s**, die Oma → die Oma**s**'],
        ]}
      />
      <Tip>Во множественном числе артикль всегда <b>die</b> — независимо от рода.</Tip>
    </>
  );
}
