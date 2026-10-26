import { Ex, H, P, Tbl, Tip } from '../../components/Explain';

export function Akkusativ() {
  return (
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
  );
}
