import { Ex, H, List, P, Tbl, Tip } from '../../components/Explain';

export function VerbenPraep() {
  return (
    <>
      <P>
        Многие глаголы требуют определённого предлога, а предлог — определённого падежа. Учите их вместе: <b>warten auf + Akk</b>
        , <b>träumen von + Dat</b>.
      </P>
      <Tbl
        head={['глагол', 'предлог', 'пример']}
        rows={[
          ['warten', 'auf + A', 'Ich warte **auf den** Bus.'],
          ['denken', 'an + A', 'Ich denke **an die** Prüfung.'],
          ['sich freuen', 'auf + A / über + A', 'auf — будущее, über — уже есть'],
          ['sich interessieren', 'für + A', 'Er interessiert sich **für** Musik.'],
          ['sprechen', 'mit + D / über + A', 'mit wem? — über was?'],
          ['träumen', 'von + D', 'Sie träumt **von einer** Reise.'],
          ['teilnehmen', 'an + D', 'Ich nehme **an einem** Kurs teil.'],
          ['fragen', 'nach + D', 'Er fragt **nach dem** Weg.'],
          ['sich kümmern', 'um + A', 'Wer kümmert sich **um die** Katze?'],
        ]}
      />
      <H>Вопрос: wo(r)- + предлог или предлог + wen/wem</H>
      <List
        items={[
          'о предмете: **wo** + предлог, перед гласной **wor**-: **Worauf** wartest du? **Wofür** interessierst du dich?',
          'о человеке: предлог + **wen** (Akk) / **wem** (Dat): **Auf wen** wartest du? **Mit wem** sprichst du?',
        ]}
      />
      <H>Ответ: da(r)- + предлог</H>
      <Ex de="Wartest du auf den Bus? — Ja, ich warte **darauf**." ru="Ты ждёшь автобус? — Да, жду его." />
      <Tip kind="en">
        Как <i>wait for</i>, <i>think of</i>, <i>be interested in</i> — но предлоги часто не совпадают: <i>wait for</i> →
        warten <b>auf</b>, <i>think of</i> → denken <b>an</b>.
      </Tip>
    </>
  );
}
