import { Ex, H, List, P, Tbl, Tip } from '../../components/Explain';

export function Negation() {
  return (
    <>
      <P>
        В немецком два основных отрицания: <b>nicht</b> («не») и <b>kein</b> («нет», «никакой», «ни одного»).
        Выбор зависит от того, что мы отрицаем.
      </P>
      <H>kein: вместо ein или нулевого артикля</H>
      <Tbl
        head={['Без отрицания', 'С отрицанием', 'Перевод']}
        rows={[
          ['ein Apfel', '**kein Apfel**', 'ни одного яблока'],
          ['Äpfel', '**keine Äpfel**', 'нет яблок'],
          ['Wasser', '**kein Wasser**', 'нет воды'],
        ]}
      />
      <Ex de="Ich habe **keinen Apfel**." ru="У меня нет яблока." en="I have no apple. / I don’t have an apple." />
      <P>Окончания — как у ein, но у kein есть и множественное число. Падеж определяется ролью существительного в предложении.</P>
      <Tbl
        head={['Падеж', 'm', 'f', 'n', 'мн. ч.']}
        rows={[
          ['Nominativ (кто? что?)', 'kein Mann', 'keine Frau', 'kein Kind', 'keine Kinder'],
          ['Akkusativ (кого? что?)', '**keinen** Mann', 'keine Frau', 'kein Kind', 'keine Kinder'],
          ['Dativ (кому? с кем?)', '**keinem** Mann', '**keiner** Frau', '**keinem** Kind', '**keinen** Kindern'],
        ]}
      />
      <Tip>
        В Akkusativ меняется только мужской род: ein → einen, kein → keinen. В Dativ множественного числа к
        существительному обычно добавляется -n: mit keinen Kindern (но: mit keinen Autos).
      </Tip>
      <H>nicht: глагол, признак или определённый предмет</H>
      <List
        items={[
          'Глагол: Ich **arbeite nicht**. — Я не работаю.',
          'Прилагательное: Ich bin **nicht müde**. — Я не устал.',
          'Наречие: Er spricht **nicht schnell**. — Он говорит не быстро.',
          'Определённый артикль: Ich kaufe **den Apfel nicht**. — Я не покупаю это яблоко.',
          'Притяжательное слово: Ich finde **meinen Schlüssel nicht**. — Я не нахожу свой ключ.',
          'Имя: Ich kenne **Anna nicht**. — Я не знаю Анну.',
        ]}
      />
      <Tip kind="en">
        nicht ≈ not, kein ≈ no перед существительным. Русское «не» не всегда переводится как nicht: «Я не
        покупаю яблок» — Ich kaufe keine Äpfel.
      </Tip>
      <H>Где стоит nicht?</H>
      <P>
        При нейтральном отрицании всего предложения nicht обычно стоит в конце среднего поля: после определённых
        дополнений и указаний времени, но перед концом глагольной рамки (приставкой, инфинитивом или
        причастием).
      </P>
      <Tbl
        head={['Пример', 'Почему здесь?']}
        rows={[
          ['Ich kaufe den Apfel **nicht**.', 'После определённого дополнения'],
          ['Ich komme heute **nicht**.', 'После времени'],
          ['Ich rufe meinen Bruder **nicht an**.', 'Перед отделяемой приставкой'],
          ['Ich kann heute **nicht kommen**.', 'Перед инфинитивом'],
          ['Ich habe heute **nicht gearbeitet**.', 'Перед причастием'],
          ['Ich bin **nicht müde**.', 'Перед прилагательным'],
          ['Ich stehe **nicht früh** auf.', 'Перед наречием образа действия / характеристикой действия'],
          ['Ich fahre **nicht nach Berlin**.', 'Перед предложной группой направления'],
        ]}
      />
      <P>
        Перед признаком, наречием образа действия или предложной группой nicht относится к этому блоку. Правило
        «nicht всегда в конце» не работает. При особом акценте место может меняться: Nicht Anna kommt, sondern
        Paul. В упражнениях здесь — нейтральный порядок слов с заданным началом.
      </P>
      <H>nicht … sondern / kein … sondern</H>
      <P><b>sondern</b> — «а», когда исправляем отрицаемую информацию. Перед sondern ставится запятая.</P>
      <Ex de="Ich fahre **nicht** nach Berlin, **sondern** nach Bonn." ru="Я еду не в Берлин, а в Бонн." />
      <Ex de="Das ist **kein** Apfel, **sondern** eine Birne." ru="Это не яблоко, а груша." />
      <H>Ответ на отрицательный вопрос: doch!</H>
      <Tbl
        head={['Вопрос', 'Ответ', 'Смысл']}
        rows={[
          ['Kommst du?', '**Ja**, ich komme.', 'Да, приду.'],
          ['Kommst du nicht?', '**Doch**, ich komme!', 'Нет же, приду! (опровергаем отрицание)'],
          ['Kommst du nicht?', '**Nein**, ich komme nicht.', 'Нет, не приду.'],
          ['Hast du kein Auto?', '**Doch**, ich habe ein Auto.', 'Есть! (вопреки вопросу)'],
        ]}
      />
      <Tip kind="warn">
        Русское «да» в ответ на «Ты не придёшь?» бывает двусмысленным. По-немецки для опровержения отрицания
        используйте <b>doch</b>; <b>nein</b> подтверждает отрицательный ответ. Это отдельное значение doch, не
        смягчающая частица в Komm doch!
      </Tip>
    </>
  );
}
