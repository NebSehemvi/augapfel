import type { ReactNode } from 'react';
import { Ex, H, List, P, Scheme, Tbl, Tip } from '../components/Explain';

const MAIN = ['Позиция 1', 'Глагол', 'Середина', 'Конец'];

export const EXPLAIN: Record<string, () => ReactNode> = {
  'praesens-regular': () => (
    <>
      <P>
        Präsens — настоящее время. Оно же часто используется для будущего: <i>Morgen koche ich.</i> Глагол состоит из{' '}
        <b>основы</b> (инфинитив без -en) и <b>окончания</b>, которое зависит от лица.
      </P>
      <Tbl
        head={['', 'machen', 'arbeiten', 'tanzen']}
        rows={[
          ['ich', 'mach**e**', 'arbeit**e**', 'tanz**e**'],
          ['du', 'mach**st**', 'arbeit**est**', 'tanz**t**'],
          ['er/sie/es', 'mach**t**', 'arbeit**et**', 'tanz**t**'],
          ['wir', 'mach**en**', 'arbeit**en**', 'tanz**en**'],
          ['ihr', 'mach**t**', 'arbeit**et**', 'tanz**t**'],
          ['sie/Sie', 'mach**en**', 'arbeit**en**', 'tanz**en**'],
        ]}
      />
      <H>Особые случаи</H>
      <List
        items={[
          'Основа на **-t, -d** (и -chn, -ffn, -gn): вставляем **-e-**: du arbeit**e**st, er find**e**t, ihr öffn**e**t.',
          'Основа на **-s, -ß, -z, -x**: у du только **-t**: du tanz**t**, du heiß**t**, du reis**t**.',
          'Глаголы на **-eln / -ern**: wir/sie — только **-n**: wir wander**n**, ich samm**le**.',
        ]}
      />
      <Tip>
        Формы <b>wir</b> и <b>sie/Sie</b> всегда совпадают с инфинитивом. Формы <b>er</b> и <b>ihr</b> у правильных глаголов
        тоже совпадают: er macht — ihr macht.
      </Tip>
      <Ex de="Ich **koche** heute eine Suppe." ru="Я сегодня варю суп." />
      <Ex de="**Arbeitest** du am Samstag?" ru="Ты работаешь в субботу?" />
      <Tip kind="en">
        В отличие от английского, у каждого лица своя форма — нет одного «универсального» глагола, как в <i>I/we/they work</i>.
      </Tip>
    </>
  ),

  'praesens-irregular': () => (
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
  ),

  'satzbau-inversion': () => (
    <>
      <P>
        Главное правило немецкого предложения: <b>спрягаемый глагол стоит на 2-й позиции</b>. На первой позиции может стоять
        что угодно — подлежащее, время, место. Если первое место занято не подлежащим, подлежащее переходит <b>за</b> глагол —
        это и есть <b>инверсия</b>.
      </P>
      <Scheme
        cols={MAIN}
        rows={[
          ['Ich', 'habe', 'am Abend einen Kuchen', 'gebacken.'],
          ['**Am Abend**', 'habe', '**ich** einen Kuchen', 'gebacken.'],
          ['Wir', 'trinken', 'am Morgen Kaffee.', ''],
          ['**Am Morgen**', 'trinken', '**wir** Kaffee.', ''],
        ]}
      />
      <H>Рамка (Satzklammer)</H>
      <P>
        Если глагольная форма состоит из двух частей, они образуют «рамку»: спрягаемая часть — на 2-й позиции, вторая часть — в
        самом <b>конце</b>.
      </P>
      <List
        items={[
          'Perfekt: Ich **habe** gestern Tennis **gespielt**.',
          'Модальный глагол: Am Montag **muss** ich früh **aufstehen**.',
          'Отделяемая приставка: Morgen **rufe** ich dich **an**.',
        ]}
      />
      <Tip kind="en">
        В английском инверсия бывает только в вопросах. По-английски <i>In the evening I baked a cake</i>, а по-немецки
        <i> Am Abend habe ich …</i> — никогда не «Am Abend ich habe».
      </Tip>
      <Tip kind="warn">
        Позиция = <b>член предложения</b>, а не слово. «Am Samstagabend» или «Nach der Arbeit» — это одна позиция.
      </Tip>
      <Tip>Сравните с русским: «Вечером я испёк торт» — порядок свободный. В немецком глагол «держит» второе место всегда.</Tip>
    </>
  ),

  fragen: () => (
    <>
      <H>Вопрос с вопросительным словом (W-Frage)</H>
      <P>W-слово — на 1-й позиции, глагол — на 2-й, подлежащее — после глагола.</P>
      <Scheme
        cols={MAIN}
        rows={[
          ['**Was**', 'machst', 'du am Wochenende?', ''],
          ['**Wann**', 'hast', 'du den Kuchen', 'gebacken?'],
          ['**Wo**', 'kann', 'ich hier', 'parken?'],
        ]}
      />
      <Tbl
        head={['W-слово', 'значение']}
        rows={[
          ['wer / wen / wem', 'кто / кого / кому'],
          ['was', 'что'],
          ['wo / woher / wohin', 'где / откуда / куда'],
          ['wann / wie lange / wie oft', 'когда / как долго / как часто'],
          ['wie / wie viel', 'как / сколько'],
          ['warum', 'почему'],
        ]}
      />
      <H>Вопрос без вопросительного слова (да/нет)</H>
      <P>
        Глагол — на <b>1-й позиции</b>:
      </P>
      <Ex de="**Kommst** du morgen?" ru="Ты придёшь завтра?" />
      <Ex de="**Hast** du am Abend Tennis **gespielt**?" ru="Ты вечером играл в теннис?" />
      <Tip kind="en">
        Никакого вспомогательного <i>do</i>: <i>Do you play tennis?</i> → <b>Spielst</b> du Tennis?
      </Tip>
    </>
  ),

  trennbare: () => (
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
  ),

  modalverben: () => (
    <>
      <P>
        Модальный глагол стоит на 2-й позиции, а смысловой глагол — <b>в инфинитиве в конце</b>.
      </P>
      <Scheme
        cols={MAIN}
        rows={[
          ['Ich', '**will**', 'heute Deutsch', '**lernen**.'],
          ['Heute', '**kann**', 'Malo nicht', '**kommen**.'],
          ['**Musst**', 'du', 'am Samstag', '**arbeiten**?'],
        ]}
      />
      <Tbl
        head={['', 'können', 'müssen', 'wollen', 'dürfen', 'sollen', 'möchten']}
        rows={[
          ['ich', '**kann**', '**muss**', '**will**', '**darf**', 'soll', 'möchte'],
          ['du', 'kannst', 'musst', 'willst', 'darfst', 'sollst', 'möchtest'],
          ['er/sie/es', '**kann**', '**muss**', '**will**', '**darf**', 'soll', 'möchte'],
          ['wir', 'können', 'müssen', 'wollen', 'dürfen', 'sollen', 'möchten'],
          ['ihr', 'könnt', 'müsst', 'wollt', 'dürft', 'sollt', 'möchtet'],
          ['sie/Sie', 'können', 'müssen', 'wollen', 'dürfen', 'sollen', 'möchten'],
        ]}
      />
      <Tip kind="warn">
        У ich и er/sie/es <b>одинаковые формы и нет окончания</b>: ich kann, er kann (не «er kannt»).
      </Tip>
      <List
        items={[
          '**können** — мочь, уметь (can)',
          '**müssen** — должен, надо (must / have to)',
          '**wollen** — хотеть (want)',
          '**dürfen** — можно, разрешено (may); **nicht dürfen** — нельзя',
          '**sollen** — должен по чужой воле (be supposed to)',
          '**möchten** — хотелось бы (would like)',
        ]}
      />
      <Tip kind="en">
        Осторожно: <b>ich will</b> = <i>I want</i>, а не <i>I will</i>! <b>Du musst nicht</b> = <i>you don't have to</i>, а
        «нельзя» — это <b>du darfst nicht</b>.
      </Tip>
    </>
  ),

  'perfekt-haben': () => (
    <>
      <P>
        Perfekt — главное прошедшее время в разговорной речи. Формула: <b>haben/sein</b> (на 2-й позиции) +{' '}
        <b>Partizip II</b> (в конце).
      </P>
      <Scheme
        cols={MAIN}
        rows={[
          ['Ich', 'habe', 'gestern Pizza', '**gekocht**.'],
          ['Gestern', 'hat', 'Anna viel', '**gearbeitet**.'],
        ]}
      />
      <H>Partizip II слабых (правильных) глаголов</H>
      <P>
        <b>ge-</b> + основа + <b>-t</b>:
      </P>
      <Tbl
        head={['инфинитив', 'Partizip II']}
        rows={[
          ['machen', '**ge**mach**t**'],
          ['kaufen', '**ge**kauf**t**'],
          ['arbeiten', '**ge**arbeit**et**'],
          ['öffnen', '**ge**öffn**et**'],
        ]}
      />
      <Tip>Основа на -t/-d (и -chn, -ffn) → окончание -et, как и в Präsens: gearbeitet, geredet.</Tip>
      <Tip kind="en">
        Немецкий Perfekt используется как обычное прошедшее время: <i>Ich habe gestern gekocht</i> = <i>I cooked yesterday</i>
        (не <i>I have cooked</i>).
      </Tip>
    </>
  ),

  'perfekt-sein': () => (
    <>
      <H>Сильные глаголы: ge- … -en</H>
      <P>
        У сильных глаголов Partizip II оканчивается на <b>-en</b>, а гласная часто меняется. Эти формы нужно учить — они есть в
        таблице сильных глаголов.
      </P>
      <Tbl
        head={['инфинитив', 'Partizip II']}
        rows={[
          ['essen', '**ge**gess**en**'],
          ['schreiben', '**ge**schr**ie**b**en**'],
          ['trinken', '**ge**tr**u**nk**en**'],
          ['gehen', '**ge**g**a**ng**en**'],
          ['bringen / denken', 'gebr**acht** / ged**acht** (смешанные)'],
        ]}
      />
      <H>haben или sein?</H>
      <P>
        Большинство глаголов — с <b>haben</b>. С <b>sein</b>:
      </P>
      <List
        items={[
          'движение из точки A в точку B: **gehen, fahren, fliegen, laufen, kommen, reisen**',
          'изменение состояния: **aufstehen, einschlafen, aufwachen, werden, sterben**',
          'и: **sein, bleiben, passieren**',
        ]}
      />
      <Ex de="Ich **bin** nach Berlin **gefahren**." ru="Я поехал(а) в Берлин." />
      <Ex de="Wir **sind** lange im Hotel **geblieben**." ru="Мы долго оставались в отеле." />
      <Tip>
        Подсказка: если глагол отвечает на вопрос «куда?» или описывает переход в новое состояние — скорее всего, <b>sein</b>.
      </Tip>
    </>
  ),

  'perfekt-besonders': () => (
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
  ),

  'artikel-plural': () => (
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
  ),

  akkusativ: () => (
    <>
      <P>
        Akkusativ (винительный падеж) — прямое дополнение: <b>кого? что?</b> Хорошая новость: меняется только{' '}
        <b>мужской род</b>.
      </P>
      <Tbl
        head={['', 'm', 'f', 'n', 'Pl']}
        rows={[
          ['Nominativ', 'der / ein', 'die / eine', 'das / ein', 'die / —'],
          ['Akkusativ', '**den / einen**', 'die / eine', 'das / ein', 'die / —'],
        ]}
      />
      <Ex de="Ich kaufe **einen** Apfel." ru="Я покупаю яблоко." />
      <Ex de="Hast du **den** Schlüssel?" ru="У тебя есть ключ?" />
      <Ex de="Ich habe **keinen** Hunger." ru="Я не голоден." />
      <H>Предлоги с Akkusativ</H>
      <P>
        <b>für, ohne, durch, gegen, um</b> — всегда Akkusativ: für <b>den</b> Bruder, ohne <b>einen</b> Schirm, durch{' '}
        <b>den</b> Park.
      </P>
      <H>Личные местоимения</H>
      <Tbl
        head={['Nom', 'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'sie/Sie']}
        rows={[['Akk', 'mich', 'dich', '**ihn**', 'sie', 'es', 'uns', 'euch', 'sie/Sie']]}
      />
      <Tip kind="warn">
        Слабые существительные мужского рода получают -(e)n: den Kolleg<b>en</b>, den Nachbar<b>n</b>, den Student
        <b>en</b>.
      </Tip>
    </>
  ),

  dativ: () => (
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
  ),

  'konnektoren-a1': () => (
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
  ),

  'praeteritum-basis': () => (
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
  ),

  futur: () => (
    <>
      <P>
        Futur I — будущее время: <b>werden</b> в Präsens + <b>инфинитив в конце</b>. Это та же «рамка», что у модальных
        глаголов: <i>Ich werde morgen meine Oma besuchen</i> — «Я завтра навещу бабушку».
      </P>
      <Tbl
        head={['', 'werden', 'пример']}
        rows={[
          ['ich', '**werde**', 'ich werde anrufen'],
          ['du', '**wirst**', 'du wirst anrufen'],
          ['er/sie/es', '**wird**', 'sie wird anrufen'],
          ['wir', 'werden', 'wir werden anrufen'],
          ['ihr', 'werdet', 'ihr werdet anrufen'],
          ['sie/Sie', 'werden', 'Sie werden anrufen'],
        ]}
      />
      <Scheme
        cols={MAIN}
        rows={[
          ['Ich', '**werde**', 'morgen meine Oma', '**besuchen**.'],
          ['**Morgen**', '**werde**', 'ich meine Oma', '**besuchen**.'],
          ['Wir', '**werden**', 'dich später', '**anrufen**.'],
        ]}
      />
      <P>
        Отделяемая приставка в Futur <b>не отделяется</b>: <i>Ich werde früh aufstehen.</i> В придаточном werden уходит в самый
        конец: <i>…, dass es morgen regnen <b>wird</b>.</i>
      </P>
      <H>Когда нужен Futur?</H>
      <List
        items={[
          '**Обещание или твёрдое намерение**: Ich **werde** dir **helfen**. Ich **werde** mehr Sport **machen**.',
          '**Прогноз**: Morgen **wird** es **regnen**. Das **wird** teuer **sein**.',
          '**Предположение о настоящем** (с wohl): Er **wird** wohl krank **sein**. — Он, наверное, болеет.',
        ]}
      />
      <Tip>
        В разговоре о планах немцы чаще используют <b>Präsens + слово времени</b>: <i>Morgen fahre ich nach Berlin.</i> Это
        нормально и правильно. Futur звучит как обещание или прогноз.
      </Tip>
      <Tip kind="en">
        werden + инфинитив ≈ английское <i>will</i>: I will call → Ich <b>werde</b> anrufen. Но немецкое <b>ich will</b> — это
        «я хочу» (wollen), а не будущее время!
      </Tip>
      <Tip kind="warn">
        werden без инфинитива значит «становиться»: <i>Er <b>wird</b> Arzt.</i> — Он станет врачом. <i>Es <b>wird</b> kalt.</i> —
        Становится холодно.
      </Tip>
      <Ex de="Nächstes Jahr **werde** ich in Wien **studieren**." ru="В следующем году я буду учиться в Вене." />
      <Ex de="Keine Sorge, ich **werde** pünktlich **sein**." ru="Не волнуйся, я буду вовремя." en="Don't worry, I'll be on time." />
    </>
  ),

  'praeteritum-verben': () => (
    <>
      <H>Слабые глаголы: основа + -te</H>
      <Tbl
        head={['', 'machen', 'arbeiten']}
        rows={[
          ['ich', 'mach**te**', 'arbeit**ete**'],
          ['du', 'mach**test**', 'arbeit**etest**'],
          ['er/sie/es', 'mach**te**', 'arbeit**ete**'],
          ['wir', 'mach**ten**', 'arbeit**eten**'],
          ['ihr', 'mach**tet**', 'arbeit**etet**'],
          ['sie/Sie', 'mach**ten**', 'arbeit**eten**'],
        ]}
      />
      <H>Сильные глаголы: новая основа</H>
      <P>
        Основу Präteritum нужно знать (2-я форма в таблице). У <b>ich</b> и <b>er</b> нет окончания!
      </P>
      <Tbl
        head={['', 'gehen', 'fahren', 'finden']}
        rows={[
          ['ich', '**ging**', '**fuhr**', '**fand**'],
          ['du', 'ging**st**', 'fuhr**st**', 'fand**est**'],
          ['er/sie/es', '**ging**', '**fuhr**', '**fand**'],
          ['wir', 'ging**en**', 'fuhr**en**', 'fand**en**'],
          ['ihr', 'ging**t**', 'fuhr**t**', 'fand**et**'],
          ['sie/Sie', 'ging**en**', 'fuhr**en**', 'fand**en**'],
        ]}
      />
      <P>
        Сильные глаголы группируются по рядам чередования гласных — так их легче запомнить:
      </P>
      <List
        items={[
          '**ei – ie – ie**: bleiben – blieb – geblieben, schreiben',
          '**ie – o – o**: fliegen – flog – geflogen, verlieren',
          '**i – a – u**: finden – fand – gefunden, trinken, singen',
          '**e – a – o**: helfen – half – geholfen, sprechen, nehmen',
          '**a – u – a**: fahren – fuhr – gefahren, tragen, waschen',
        ]}
      />
      <Tip>Смешанные глаголы: bringen – brachte – gebracht, denken – dachte, kennen – kannte, wissen – wusste.</Tip>
      <Tip kind="en">
        Как английские <i>drink – drank – drunk</i>, <i>sing – sang – sung</i>: trinken – trank – getrunken!
      </Tip>
    </>
  ),

  'verben-praep': () => (
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
  ),

  reflexiv: () => (
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
  ),

  nebensaetze: () => (
    <>
      <P>
        В придаточном предложении (после <b>weil, dass, wenn, ob, obwohl…</b>) спрягаемый глагол стоит <b>в самом конце</b>.
        Придаточное отделяется запятой.
      </P>
      <Scheme
        cols={['Союз', 'Подлежащее', 'Середина', 'Конец']}
        rows={[
          ['weil', 'ich', 'Hunger', '**habe**'],
          ['dass', 'er', 'morgen', '**kommt**'],
          ['weil', 'wir', 'früh', '**aufstehen müssen**'],
          ['dass', 'sie', 'gestern ins Kino', '**gegangen ist**'],
        ]}
      />
      <List
        items={[
          '**weil** — потому что (причина): Ich bleibe zu Hause, weil ich krank **bin**.',
          '**dass** — что: Ich glaube, dass er Recht **hat**.',
          '**wenn** — если / когда (повторяющееся): Wenn ich Zeit **habe**, lese ich.',
        ]}
      />
      <H>Придаточное впереди → инверсия!</H>
      <P>
        Всё придаточное занимает <b>позицию 1</b>, поэтому глагол главного предложения идёт сразу после запятой:
      </P>
      <Scheme cols={['Позиция 1 (придаточное)', 'Глагол', 'Остальное']} rows={[['Wenn ich Zeit habe,', '**koche**', 'ich eine Suppe.']]} />
      <Tip kind="warn">
        <b>weil</b> и <b>denn</b> значат одно и то же, но: «…, <b>weil</b> ich Hunger <b>habe</b>» — глагол в конце; «…,{' '}
        <b>denn</b> ich <b>habe</b> Hunger» — обычный порядок.
      </Tip>
      <Tip>Отделяемая приставка в придаточном пишется слитно: …, weil ich früh <b>aufstehe</b>.</Tip>
    </>
  ),

  'deshalb-trotzdem': () => (
    <>
      <P>
        <b>deshalb</b> (поэтому) и <b>trotzdem</b> (тем не менее, всё равно) — наречия. Они стоят на <b>позиции 1</b>, поэтому
        за ними сразу идёт глагол.
      </P>
      <Scheme
        cols={MAIN}
        rows={[
          ['**Deshalb**', 'esse', 'ich einen Salat.', ''],
          ['**Trotzdem**', 'habe', 'ich das Abendessen', 'gekocht.'],
          ['**Dann**', 'gehe', 'ich ins Bett.', ''],
        ]}
      />
      <Ex de="Ich habe Hunger. **Deshalb esse** ich einen Salat." ru="Я голоден. Поэтому я ем салат." />
      <Ex de="Ich bin müde, **trotzdem gehe** ich ins Fitnessstudio." ru="Я устал, но всё равно иду в спортзал." />
      <Tbl
        head={['', 'тип', 'порядок слов']}
        rows={[
          ['und, aber, oder, denn', 'союз, позиция 0', 'Ich bin müde, **denn** ich **habe** viel gearbeitet.'],
          ['deshalb, trotzdem, dann, danach, zuerst', 'наречие, позиция 1', 'Ich habe viel gearbeitet, **deshalb bin** ich müde.'],
          ['weil, dass, wenn, obwohl', 'подчинительный союз', 'Ich bin müde, **weil** ich viel gearbeitet **habe**.'],
        ]}
      />
      <Tip>
        Сравните: <b>weil</b> → причина, <b>deshalb</b> → следствие. «Ich habe Hunger, deshalb esse ich» = «Ich esse, weil ich
        Hunger habe».
      </Tip>
    </>
  ),

  wechselpraep: () => (
    <>
      <P>
        Предлоги <b>in, an, auf, unter, über, vor, hinter, neben, zwischen</b> бывают с Akkusativ и с Dativ — в зависимости от
        вопроса.
      </P>
      <Tbl
        head={['вопрос', 'падеж', 'пример']}
        rows={[
          ['**Wohin?** (куда? движение)', 'Akkusativ', 'Ich lege das Buch auf **den** Tisch.'],
          ['**Wo?** (где? место)', 'Dativ', 'Das Buch liegt auf **dem** Tisch.'],
        ]}
      />
      <H>Пары глаголов</H>
      <Tbl
        head={['действие (wohin? + Akk)', 'состояние (wo? + Dat)']}
        rows={[
          ['stellen — ставить', 'stehen — стоять'],
          ['legen — класть', 'liegen — лежать'],
          ['setzen — сажать', 'sitzen — сидеть'],
          ['hängen (hängte) — вешать', 'hängen (hing) — висеть'],
          ['gehen, fahren (in die Stadt)', 'sein, bleiben (in der Stadt)'],
        ]}
      />
      <Tip>
        Слияния: in dem → <b>im</b>, in das → <b>ins</b>, an dem → <b>am</b>, an das → <b>ans</b>.
      </Tip>
      <Ex de="Ich stelle die Milch **in den** Kühlschrank. — Die Milch steht **im** Kühlschrank." />
      <Tip kind="en">
        Как английское <i>into</i> vs <i>in</i>: <i>put it into the fridge</i> (Akk) — <i>it's in the fridge</i> (Dat).
      </Tip>
    </>
  ),
};
