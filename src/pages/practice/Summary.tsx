import { navigate } from '../../lib/router';
import type { ExerciseResult } from '../../exercises/types';
import { Button } from '../common/Button';
import { Muted } from '../common/Muted';
import { PageTitle } from '../common/PageTitle';
import s from './practice.module.css';

/** End-of-session score and the correct answers for every mistake. */
export function Summary({ results, back, restart, hasTheme }: { results: ExerciseResult[]; back: string; restart: () => void; hasTheme: boolean }) {
  const correct = results.reduce((a, r) => a + r.correct, 0);
  const total = results.reduce((a, r) => a + r.total, 0);
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const mistakes = results.flatMap((r) => r.mistakes);
  const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '💪' : pct >= 50 ? '🙂' : '📚';
  const msg = pct >= 90 ? 'Ausgezeichnet!' : pct >= 70 ? 'Sehr gut!' : pct >= 50 ? 'Gut gemacht!' : 'Weiter üben!';
  return (
    <div className={s.summary}>
      <div className={s.emoji}>{emoji}</div>
      <PageTitle as="h2" lang="de">
        {msg}
      </PageTitle>
      <p className={s.score}>
        {correct} из {total} · <b>{pct}%</b>
      </p>
      {mistakes.length > 0 && (
        <section className={s.mistakes}>
          <h3>Правильные ответы там, где были ошибки</h3>
          <ul>
            {mistakes.map((m, k) => (
              <li key={k} lang="de">
                {m}
              </li>
            ))}
          </ul>
          <Muted as="p">Ошибки с формами глаголов, родом и предлогами попадут в раздел «Повторение».</Muted>
        </section>
      )}
      <div className={s.actions}>
        <Button onClick={restart}>{hasTheme ? 'Ещё раз — с другой лексикой' : 'Ещё раз'}</Button>
        <Button variant="secondary" onClick={() => navigate(back)}>
          Готово
        </Button>
      </div>
    </div>
  );
}
