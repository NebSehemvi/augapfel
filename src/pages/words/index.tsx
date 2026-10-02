import { href } from '../../lib/router';
import { dueKeys, useProgress, wordKeys } from '../../lib/progress';
import { plural } from '../../lib/format';
import { Button } from '../common/Button';
import { Muted } from '../common/Muted';
import { PageTitle } from '../common/PageTitle';
import { Panel } from '../common/Panel';
import { WordsTabs } from '../common/WordsTabs';
import { AddWord } from './AddWord';
import { SavedWordList } from './SavedWordList';
import s from './words.module.css';

export function WordsPage() {
  const progress = useProgress();
  const words = Object.values(progress.words).sort((a, b) => b.addedAt - a.addedAt);
  const dueSet = new Set(dueKeys());
  const due = words.filter((w) => wordKeys(w.lemma).some((k) => dueSet.has(k))).length;

  return (
    <div>
      <WordsTabs active="words" />
      <PageTitle>Мои слова</PageTitle>
      <Panel>
        <p className={s.big}>
          <b>{words.length}</b> {plural(words.length, 'слово', 'слова', 'слов')}
          {due > 0 && <Muted> · {due} пора повторить</Muted>}
        </p>
        <Button href={href('/words/train')} disabled={words.length === 0}>
          Тренировать слова →
        </Button>
        <Muted as="p">Две тренировки: выбрать перевод из четырёх карточек и написать слово по-немецки. Слова также попадают в «Повторение».</Muted>
      </Panel>

      <AddWord />

      {words.length === 0 ? (
        <Muted as="p">
          Пока пусто. Откройте <a href={href('/texts')}>текст</a>, нажмите на незнакомое слово и добавьте его.
        </Muted>
      ) : (
        <SavedWordList words={words} />
      )}
    </div>
  );
}
