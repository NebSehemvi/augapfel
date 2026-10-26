import { Ex, H, List, P, Scheme, Tbl, Tip } from '../../components/Explain';

export function Nebensaetze() {
  return (
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
          ['ob', 'du', 'heute Zeit', '**hast**'],
          ['weil', 'wir', 'früh', '**aufstehen müssen**'],
          ['dass', 'sie', 'gestern ins Kino', '**gegangen ist**'],
        ]}
      />
      <List
        items={[
          '**weil** — потому что (причина): Ich bleibe zu Hause, weil ich krank **bin**.',
          '**dass** — что: Ich glaube, dass er Recht **hat**.',
          '**wenn** — если / когда (повторяющееся): Wenn ich Zeit **habe**, lese ich.',
          '**ob** — ли (косвенный вопрос): Ich weiß nicht, ob er heute **kommt**.',
        ]}
      />
      <H>ob — косвенный вопрос</H>
      <P>
        Вопрос <b>без</b> вопросительного слова (да/нет) внутри другого предложения вводится союзом <b>ob</b> — русское «ли».
        Глагол уходит в конец, как после weil и dass.
      </P>
      <Ex de="Kommt er heute? → Ich weiß nicht, **ob** er heute **kommt**." ru="Он придёт сегодня? → Я не знаю, придёт ли он сегодня." />
      <Ex de="Hat Anna Zeit? → Weißt du, **ob** Anna Zeit **hat**?" ru="Ты не знаешь, есть ли у Анны время?" />
      <P>
        Типичные начала: <i>Ich weiß nicht, ob … · Ich frage mich, ob … · Weißt du, ob …? · Kannst du mir sagen, ob …?</i> Если
        главное предложение — вопрос, в конце ставится «?».
      </P>
      <Tbl
        head={['союз', 'значение', 'пример']}
        rows={[
          ['**dass**', 'что (утверждение)', 'Ich weiß, **dass** er kommt.'],
          ['**ob**', 'ли (вопрос да/нет)', 'Ich weiß nicht, **ob** er kommt.'],
          ['**wenn**', 'если / когда (условие)', '**Wenn** er kommt, kochen wir.'],
        ]}
      />
      <Tip kind="warn">
        По-английски и «if», и «whether» — но по-немецки «if = ли» это всегда <b>ob</b>, а не wenn: <s>Ich weiß nicht, wenn er
        kommt</s> → Ich weiß nicht, <b>ob</b> er kommt.
      </Tip>
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
  );
}
