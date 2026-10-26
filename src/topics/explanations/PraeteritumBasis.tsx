import { Ex, P, Tbl, Tip } from '../../components/Explain';

export function PraeteritumBasis() {
  return (
    <>
      <P>
        Präteritum — прошедшее время для письменной речи. Но <b>sein, haben</b> и <b>модальные глаголы</b> даже в разговоре
        обычно используют в Präteritum: <i>Ich war müde</i> звучит естественнее, чем <i>Ich bin müde gewesen</i>.
      </P>
      <Tbl
        head={['', 'sein', 'haben', 'können', 'müssen', 'wollen']}
        rows={[
          ['ich', '**war**', '**hatte**', 'konnte', 'musste', 'wollte'],
          ['du', 'warst', 'hattest', 'konntest', 'musstest', 'wolltest'],
          ['er/sie/es', '**war**', '**hatte**', 'konnte', 'musste', 'wollte'],
          ['wir', 'waren', 'hatten', 'konnten', 'mussten', 'wollten'],
          ['ihr', 'wart', 'hattet', 'konntet', 'musstet', 'wolltet'],
          ['sie/Sie', 'waren', 'hatten', 'konnten', 'mussten', 'wollten'],
        ]}
      />
      <Tip>
        У модальных глаголов в Präteritum <b>нет умлаута</b>: können → konnte, müssen → musste, dürfen → durfte. А mögen →
        mochte, möchten → wollte.
      </Tip>
      <Ex de="Gestern **musste** ich lange **arbeiten**." ru="Вчера мне пришлось долго работать." />
      <Ex de="Letztes Jahr **waren** wir in Italien." ru="В прошлом году мы были в Италии." />
    </>
  );
}
