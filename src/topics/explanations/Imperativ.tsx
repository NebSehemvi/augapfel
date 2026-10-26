import { Ex, H, List, P, Tbl, Tip } from '../../components/Explain';

/** Explanation of the imperative topic (du / ihr / Sie). */
export function Imperativ() {
  return (
    <>
      <P>
        Императив — это приказ, просьба, совет или приглашение: «Иди!», «Возьмите!». В немецком <b>три формы</b> — по одной на каждое
        обращение: <b>du</b> (ты), <b>ihr</b> (вы, к нескольким друзьям) и <b>Sie</b> (Вы, вежливо). Слова-вопроса нет, глагол
        стоит на <b>первом месте</b>.
      </P>
      <Tbl
        head={['', 'Форма', 'Пример', 'Перевод']}
        rows={[
          ['du', 'основа глагола, без du и -st', '**Komm** mit!', 'Пойдём с нами! (ты)'],
          ['ihr', 'форма ihr без местоимения', '**Kommt** mit!', 'Пойдёмте с нами! (вы)'],
          ['Sie', 'инфинитив + **Sie**', '**Kommen Sie** mit!', 'Пойдёмте с нами! (Вы)'],
        ]}
      />
      <Tip kind="en">
        Как в английском: <i>Come!</i> — одна форма на всех, а в немецком их три. Вежливое <i>Please come in</i> = <b>Kommen Sie
        herein!</b>
      </Tip>
      <H>Форма du: отбросьте du и -st</H>
      <Tbl
        head={['Präsens', 'Imperativ']}
        rows={[
          ['du kommst', '**Komm!**'],
          ['du machst', '**Mach** die Tür zu!'],
          ['du spielst', '**Spiel** doch mit!'],
          ['du gehst', '**Geh** nach Hause!'],
        ]}
      />
      <Tip kind="warn">
        Не говорите <i>Du komm!</i> и не добавляйте окончание: <i>Kommst!</i> — ошибка. Местоимение в императиве обычно опускают.
      </Tip>
      <H>Особые случаи для du</H>
      <List
        items={[
          '**e → i / ie** сохраняется: du nimmst → **Nimm!**, du liest → **Lies!**, du gibst → **Gib!**, du isst → **Iss!**, du siehst → **Sieh!**, du sprichst → **Sprich!**, du hilfst → **Hilf!**',
          '**a → ä** в императиве отпадает: du fährst → **Fahr!**, du schläfst → **Schlaf!**, du läufst → **Lauf!**, du trägst → **Trag!**',
          'Основа на **-t, -d, -chn, -ffn, -tm** получает **-e**, чтобы слово можно было произнести: **Warte!**, **Arbeite!**, **Finde!**, **Rechne!**, **Öffne!**, **Atme!** Так же: Entschuldige! (-ig), Reise!',
          'Глаголы на **-eln / -ern**: **Sammle!**, **Ärgere** dich nicht!',
        ]}
      />
      <H>sein, haben, werden</H>
      <Tbl
        head={['', 'du', 'ihr', 'Sie']}
        rows={[
          ['sein', '**Sei** ruhig!', '**Seid** pünktlich!', '**Seien Sie** bitte vorsichtig!'],
          ['haben', '**Hab** keine Angst!', '**Habt** Geduld!', '**Haben Sie** Geduld!'],
          ['werden', '**Werde** bald gesund!', '**Werdet** nicht müde!', '**Werden Sie** gesund!'],
        ]}
      />
      <Tip kind="warn">
        <b>Sei</b> и <b>Seien Sie</b> — не <i>bist</i> и не <i>sind Sie</i>. Форма <i>Seid</i> совпадает с настоящим временем (ihr seid).
      </Tip>
      <H>Форма ihr и форма Sie</H>
      <Tbl
        head={['Инфинитив', 'du', 'ihr', 'Sie']}
        rows={[
          ['kommen', 'Komm!', 'Kommt!', 'Kommen Sie!'],
          ['essen', 'Iss!', 'Esst!', 'Essen Sie!'],
          ['fahren', 'Fahr!', 'Fahrt!', 'Fahren Sie!'],
          ['warten', 'Warte!', 'Wartet!', 'Warten Sie!'],
        ]}
      />
      <P>
        <b>ihr</b> — это просто форма настоящего времени без <i>ihr</i>: <i>ihr kommt → Kommt!</i> Основа не меняется: <i>ihr nehmt →
        Nehmt!</i>, <i>ihr fahrt → Fahrt!</i> У <b>Sie</b> глагол в инфинитиве, а <b>Sie</b> остаётся <b>после</b> глагола —
        в отличие от обычного предложения (<i>Sie kommen</i>).
      </P>
      <H>Отделяемая приставка — в конец</H>
      <Tbl
        head={['Инфинитив', 'Imperativ']}
        rows={[
          ['aufstehen', '**Steh** früh **auf**!  ·  **Steht** auf!  ·  **Stehen Sie** auf!'],
          ['anrufen', '**Ruf** mich **an**!  ·  **Rufen Sie** mich **an**!'],
          ['mitkommen', '**Komm** doch **mit**!'],
          ['einkaufen', '**Kauf** Brot **ein**!'],
        ]}
      />
      <P>Как и в обычном предложении: приставка стоит в самом конце, а всё остальное — между глаголом и приставкой.</P>
      <H>Возвратные глаголы</H>
      <Tbl
        head={['du', 'ihr', 'Sie']}
        rows={[
          ['**Setz dich!**', '**Setzt euch!**', '**Setzen Sie sich!**'],
          ['**Beeil dich!**', '**Beeilt euch!**', '**Beeilen Sie sich!**'],
          ['**Zieh dich an!**', '**Zieht euch an!**', '**Ziehen Sie sich an!**'],
        ]}
      />
      <P>
        Местоимение стоит сразу за глаголом: <i>dich</i> (du), <i>euch</i> (ihr), <i>sich</i> (Sie).
      </P>
      <H>Вежливо: bitte и doch mal</H>
      <List
        items={[
          '**bitte** — просьба: **Komm bitte** mit! · **Bitte komm** mit! · Komm mit, **bitte**. Рядом с Sie — самая вежливая форма: **Kommen Sie bitte** herein!',
          '**doch** смягчает: **Komm doch** mit! (ну пойдём же)',
          '**mal** делает просьбу лёгкой: **Hilf mir mal**! **Komm doch mal** vorbei! (заходи как-нибудь)',
        ]}
      />
      <Tip>
        Восклицательный знак ставят после приказа, но дружескую просьбу или инструкцию можно закончить и точкой: <i>Nehmen Sie
        bitte Platz.</i>
      </Tip>
      <Ex de="**Nimm** den Bus, das ist schneller." ru="Поезжай на автобусе, так быстрее." />
      <Ex de="**Lies** den Text und **antworte** auf die Fragen." ru="Прочитай текст и ответь на вопросы." />
      <Ex de="**Seid** bitte leise, das Baby schläft." ru="Тише, пожалуйста, ребёнок спит." />
      <Ex de="**Öffnen Sie** bitte das Fenster." ru="Откройте, пожалуйста, окно." en="Please open the window." />
      <Ex de="**Setz dich** doch!" ru="Да садись же!" />
    </>
  );
}
