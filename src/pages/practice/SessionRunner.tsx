import { useState } from 'react';
import { href } from '../../lib/router';
import { recordSession, recordSrs, useProgress } from '../../lib/progress';
import type { Session } from '../../exercises/session';
import type { ExerciseResult } from '../../exercises/types';
import { ExerciseView } from '../../components/exercises/ExerciseView';
import { SkipOnError } from './SkipOnError';
import { Summary } from './Summary';
import type { Spec } from './spec';
import s from './practice.module.css';

/** Plays the exercises one by one, records results, then shows the summary. */
export function SessionRunner({ spec, session, restart }: { spec: Spec; session: Session; restart: () => void }) {
  const progress = useProgress();
  const [i, setI] = useState(0);
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const total = session.exercises.length;
  const finished = i >= total;

  const onDone = (r: ExerciseResult) => {
    recordSrs(r.srs, session.srsCreate);
    const all = [...results, r];
    setResults(all);
    if (i + 1 >= total && spec.topicId) {
      const c = all.reduce((a, x) => a + x.correct, 0);
      const t = all.reduce((a, x) => a + x.total, 0);
      recordSession(spec.topicId, t ? c / t : 0, session.theme?.id);
    }
    setI(i + 1);
    window.scrollTo(0, 0);
  };

  if (total === 0) {
    return (
      <div className={s.empty}>
        <p>Здесь пока нет упражнений.</p>
        <a href={href(spec.back)}>Назад</a>
      </div>
    );
  }

  return (
    <div className={s.practice}>
      <div className={s.top}>
        <a className={s.close} href={href(spec.back)} aria-label="Закрыть">
          ✕
        </a>
        <div className={s.track} aria-label={`Упражнение ${Math.min(i + 1, total)} из ${total}`}>
          <div className={s.fill} style={{ width: `${(Math.min(i, total) / total) * 100}%` }} />
        </div>
        <span className={s.counter}>
          {Math.min(i + 1, total)}/{total}
        </span>
      </div>
      {session.theme && (
        <div className={s.themeChip}>
          <span>{session.theme.emoji}</span> {session.theme.name.ru}
        </div>
      )}

      {finished ? (
        <Summary results={results} back={spec.back} restart={restart} hasTheme={!!session.theme} />
      ) : (
        <SkipOnError key={i} onSkip={() => setI(i + 1)}>
          <ExerciseView ex={session.exercises[i]} lenient={progress.settings.lenientUmlauts} onDone={onDone} />
        </SkipOnError>
      )}
    </div>
  );
}
