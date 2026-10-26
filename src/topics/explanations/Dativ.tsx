import { Ex, H, P, Tbl, Tip } from '../../components/Explain';

export function Dativ() {
  return (
    <>
      <P>
        Dativ (дательный падеж) — <b>кому? чему?</b>, а также после некоторых предлогов и глаголов.
      </P>
      <Tbl
        head={['', 'm', 'f', 'n', 'Pl']}
        rows={[
          ['Nominativ', 'der / ein', 'die / eine', 'das / ein', 'die'],
          ['Akkusativ', 'den / einen', 'die / eine', 'das / ein', 'die'],
          ['Dativ', '**dem / einem**', '**der / einer**', '**dem / einem**', '**den** + -n'],
        ]}
      />
      <H>Предлоги с Dativ</H>
      <P>
        <b>mit, nach, aus, zu, von, bei, seit</b> (+ gegenüber). Запоминалка: «<i>mit nach aus zu von bei seit</i>».
      </P>
      <Ex de="Ich fahre **mit dem** Bus." ru="Я еду на автобусе." />
      <Ex de="Ich wohne **bei meiner** Tante." ru="Я живу у тёти." />
      <Ex de="Wir spielen mit **den** Kinder**n**." ru="Мы играем с детьми." />
      <Tip>Слияния: zu dem → <b>zum</b>, zu der → <b>zur</b>, bei dem → <b>beim</b>, von dem → <b>vom</b>.</Tip>
      <H>Глаголы с Dativ</H>
      <P>
        <b>helfen, danken, gehören, gefallen, schmecken, antworten, gratulieren</b> + «кому?»; <b>geben, schenken, zeigen</b>{' '}
        — кому (Dat) что (Akk).
      </P>
      <Ex de="Ich helfe **dem** Nachbarn." ru="Я помогаю соседу." />
      <Ex de="Ich schenke **meiner** Mutter Blumen." ru="Я дарю маме цветы." />
      <Tbl
        head={['Nom', 'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'sie/Sie']}
        rows={[['Dat', '**mir**', '**dir**', '**ihm**', '**ihr**', 'ihm', 'uns', 'euch', '**ihnen/Ihnen**']]}
      />
      <Tip kind="en">
        Английское <i>to me / to him</i> часто = Dativ: <i>Can you help me?</i> → Kannst du <b>mir</b> helfen?
      </Tip>
    </>
  );
}
