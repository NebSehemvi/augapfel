import { Component, useState, type ReactNode } from 'react';
import type { Route } from '../lib/router';
import { href, navigate } from '../lib/router';
import { dueKeys, getProgress, recordSession, recordSrs, useProgress } from '../lib/progress';
import { reviewSession, topicSession, trainerSession, type Session, type TrainerMode, type TrainerPool } from '../exercises/session';
import type { ExerciseResult } from '../exercises/types';
import type { Level } from '../grammar/types';
import { ExerciseView } from '../components/exercises/ExerciseView';
import { getTopic } from '../topics';
import s from './pages.module.css';

interface Spec {
  key: string;
  back: string;
  title: string;
  make: () => Session;
  topicId?: string;
}

function specFor(route: Route): Spec {
  const [section, id] = route.path;
  if (section === 't') {
    const topic = getTopic(id);
    return { key: `t/${id}`, back: `/t/${id}`, title: topic?.ru ?? id, topicId: id, make: () => topicSession(id, getProgress()) };
  }
  if (section === 'verbs') {
    const q = route.query;
    const levels = (q.get('levels') ?? 'A1,A2').split(',') as Level[];
    return {
      key: 'verbs',
      back: '/verbs',
      title: 'Тренажёр глаголов',
      topicId: 'trainer',
      make: () =>
        trainerSession(
          { pool: (q.get('pool') ?? 'table') as TrainerPool, mode: (q.get('mode') ?? 'forms') as TrainerMode, levels, count: Number(q.get('count') ?? 12) },
          getProgress(),
        ),
    };
  }
  return { key: 'review', back: '/review', title: 'Повторение', topicId: 'review', make: () => reviewSession(dueKeys().slice(0, 30)) };
}

export function Practice({ route }: { route: Route }) {
  const spec = specFor(route);
  const [nonce, setNonce] = useState(0);
  return <Runner key={`${spec.key}-${nonce}`} spec={spec} restart={() => setNonce((n) => n + 1)} />;
}

function Runner({ spec, restart }: { spec: Spec; restart: () => void }) {
  const progress = useProgress();
  const [session] = useState(spec.make);
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
      <div className={s.practiceTop}>
        <a className={s.close} href={href(spec.back)} aria-label="Закрыть">
          ✕
        </a>
        <div className={s.progressTrack} aria-label={`Упражнение ${Math.min(i + 1, total)} из ${total}`}>
          <div className={s.progressFill} style={{ width: `${(Math.min(i, total) / total) * 100}%` }} />
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
        <Summary results={results} spec={spec} restart={restart} hasTheme={!!session.theme} />
      ) : (
        <SkipOnError key={i} onSkip={() => setI(i + 1)}>
          <ExerciseView ex={session.exercises[i]} lenient={progress.settings.lenientUmlauts} onDone={onDone} />
        </SkipOnError>
      )}
    </div>
  );
}

function Summary({ results, spec, restart, hasTheme }: { results: ExerciseResult[]; spec: Spec; restart: () => void; hasTheme: boolean }) {
  const correct = results.reduce((a, r) => a + r.correct, 0);
  const total = results.reduce((a, r) => a + r.total, 0);
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const mistakes = results.flatMap((r) => r.mistakes);
  const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '💪' : pct >= 50 ? '🙂' : '📚';
  const msg = pct >= 90 ? 'Ausgezeichnet!' : pct >= 70 ? 'Sehr gut!' : pct >= 50 ? 'Gut gemacht!' : 'Weiter üben!';
  return (
    <div className={s.summary}>
      <div className={s.summaryEmoji}>{emoji}</div>
      <h2 className={s.h1} lang="de">
        {msg}
      </h2>
      <p className={s.summaryScore}>
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
          <p className={s.muted}>Ошибки с формами глаголов, родом и предлогами попадут в раздел «Повторение».</p>
        </section>
      )}
      <div className={s.summaryActions}>
        <button className={s.startBtn} onClick={restart}>
          {hasTheme ? 'Ещё раз — с другой лексикой' : 'Ещё раз'}
        </button>
        <button className={s.ghostBtn} onClick={() => navigate(spec.back)}>
          Готово
        </button>
      </div>
    </div>
  );
}

class SkipOnError extends Component<{ children: ReactNode; onSkip: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(e: unknown) {
    console.error(e);
  }
  render() {
    if (this.state.failed) {
      return (
        <div className={s.empty}>
          <p>Это упражнение не удалось показать.</p>
          <button className={s.ghostBtn} onClick={this.props.onSkip}>
            Пропустить
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
