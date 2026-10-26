import { Ex, H, List, P, Tbl, Tip } from '../../components/Explain';

export function Datum() {
  return (
    <>
      <P>
        Месяцы: Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember — все мужского рода
        (<b>der</b> Mai). Дни недели тоже: <b>der</b> Montag.
      </P>
      <H>Порядковые числа</H>
      <P>
        На письме — цифра с точкой: <b>3.</b> = dritte. До 19 добавляем <b>-te</b>, с 20 — <b>-ste</b>.
      </P>
      <Tbl
        head={['', '', '']}
        rows={[
          ['1. **erste**', '2. zweite', '3. **dritte**'],
          ['4. vierte', '7. **siebte**', '8. **achte**'],
          ['12. zwölfte', '19. neunzehnte', '20. zwanzig**ste**'],
          ['21. einundzwanzig**ste**', '30. dreißig**ste**', '31. einunddreißig**ste**'],
        ]}
        caption="Выделены особые формы: erste, dritte, siebte, achte"
      />
      <H>der dritte Mai или am dritten Mai?</H>
      <Tbl
        head={['Какое сегодня число?', 'Когда?']}
        rows={[
          ['Heute ist **der** dritt**e** Mai.', 'Ich habe **am** dritt**en** Mai Geburtstag.'],
          ['der erste Januar', 'am ersten Januar'],
          ['der vierundzwanzigste Dezember', 'am vierundzwanzigsten Dezember'],
        ]}
      />
      <H>am, im, um</H>
      <List
        items={[
          '**am** + день или дата: **am** Montag, **am** Wochenende, **am** 3. Mai',
          '**im** + месяц или время года: **im** Mai, **im** Sommer',
          '**um** + время на часах: **um** acht Uhr, **um** halb neun',
          '**vom … bis zum** …: **vom** ersten **bis zum** fünften Juni',
        ]}
      />
      <H>Годы</H>
      <P>
        До 2000 года — сотнями: <i>1989</i> — «neunzehnhundertneunundachtzig». С 2000 — как обычное число: <i>2024</i> —
        «zweitausendvierundzwanzig». Перед годом предлог не нужен (<i>2020 war ich in Berlin</i>) или говорят «im Jahr 2020».
      </P>
      <Tip>Дату пишут как в России: сначала день, потом месяц — 03.05.2024 = 3 мая.</Tip>
      <Ex de="Heute ist **der zwölfte** März." ru="Сегодня двенадцатое марта." />
      <Ex de="Wann hast du Geburtstag? — **Am siebten** Juli." ru="Когда у тебя день рождения? — Седьмого июля." />
      <Ex de="Ich bin **neunzehnhundertneunzig** geboren." ru="Я родился (родилась) в 1990 году." en="I was born in 1990." />
    </>
  );
}
