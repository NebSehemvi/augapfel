import { navigate } from '../../lib/router';
import type { LexEntry } from '../../data/lexicon';
import type { LexMode, Question } from '../../exercises/lexiconGame';
import { germanForm } from '../../exercises/vocab';
import { Button } from '../common/Button';
import { Muted } from '../common/Muted';
import { PageTitle } from '../common/PageTitle';
import { Panel } from '../common/Panel';
import { WordList } from '../common/WordList';
import { WordRow } from '../common/WordRow';
import s from './game.module.css';
import { Gendered } from '../../components/Gendered';

interface Props {
  mode: LexMode;
  /** learn: the new words */
  words: LexEntry[];
  /** first answers (review / speed) */
  log: { q: Question; ok: boolean }[];
  score: number;
  back: string;
  restart: () => void;
}

function Words({ title, list }: { title: string; list: LexEntry[] }) {
  if (!list.length) return null;
  return (
    <div className={s.list}>
      <Panel title={title}>
        <WordList>
          {list.map((e) => (
            <WordRow key={e.id} word={<Gendered text={germanForm(e)} />} meta={e.ru} />
          ))}
        </WordList>
      </Panel>
    </div>
  );
}

export function GameSummary({ mode, words, log, score, back, restart }: Props) {
  const correct = log.filter((x) => x.ok).length;
  const mistakes = [...new Set(log.filter((x) => !x.ok).map((x) => x.q.entry))];
  const head =
    mode === 'learn'
      ? { emoji: '🌱', title: 'Neue Wörter!', line: `Выучено новых слов: ${words.length}` }
      : mode === 'speed' || mode === 'articles'
        ? { emoji: '⚡', title: `${score} Punkte`, line: `Правильных ответов: ${correct} из ${log.length}` }
        : { emoji: correct === log.length ? '🏆' : '💪', title: correct === log.length ? 'Ausgezeichnet!' : 'Gut gemacht!', line: `${correct} из ${log.length}` };
  return (
    <div className={s.summary}>
      <div className={s.emoji}>{head.emoji}</div>
      <PageTitle as="h2" lang="de">
        {head.title}
      </PageTitle>
      <p className={s.big}>{head.line}</p>
      {mode === 'learn' ? (
        <>
          <Words title="Новые слова" list={words} />
          <Muted as="p">Слова попадут в повторение завтра; те, где были ошибки, — уже через несколько минут.</Muted>
        </>
      ) : (
        <Words title="Ошибки" list={mistakes} />
      )}
      <div className={s.actions}>
        <Button onClick={restart}>{mode === 'learn' ? 'Учить ещё 5 слов' : 'Ещё раз'}</Button>
        <Button variant="secondary" onClick={() => navigate(back)}>
          Готово
        </Button>
      </div>
    </div>
  );
}
