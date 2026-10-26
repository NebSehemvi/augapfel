import { Ex, H, List, P, Tbl, Tip } from '../../components/Explain';

export function PraesensRegular() {
  return (
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
  );
}
