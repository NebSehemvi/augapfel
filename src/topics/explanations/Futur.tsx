import { Ex, H, List, P, Scheme, Tbl, Tip } from '../../components/Explain';
import { MAIN } from './shared';

export function Futur() {
  return (
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
  );
}
