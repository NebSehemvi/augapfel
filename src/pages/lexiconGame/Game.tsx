import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { defaultRng } from '../../lib/rng';
import { href } from '../../lib/router';
import { getProgress, recordSession, recordSrs, useProgress } from '../../lib/progress';
import { lexKey, type LexEntry } from '../../data/lexicon';
import {
  learnSteps,
  LIVES,
  questionKey,
  repeatQuestion,
  reviewQuestions,
  reviewUpdate,
  sessionEntries,
  SPEED_SECONDS,
  speedPoints,
  speedQuestions,
  type LexMode,
  type LexScope,
  type Question,
  type Step,
} from '../../exercises/lexiconGame';
import { Button } from '../common/Button';
import { CardChoice } from './CardChoice';
import { GameHud } from './GameHud';
import { GameSummary } from './GameSummary';
import { PresentCard } from './PresentCard';
import { TypeAnswer } from './TypeAnswer';
import s from './game.module.css';

const rng = defaultRng;

function buildSteps(mode: LexMode, scope: LexScope): Step[] {
  const p = getProgress();
  const entries = sessionEntries(scope, p);
  if (mode === 'learn') return learnSteps(entries, p, rng);
  if (mode === 'review') return reviewQuestions(entries, p, rng);
  return speedQuestions(entries, p, rng);
}

/** One lexicon session: learning new words, classic review or speed review (timer, three lives). */
export function Game({ mode, scope, back, restart }: { mode: LexMode; scope: LexScope; back: string; restart: () => void }) {
  const progress = useProgress();
  const [steps, setSteps] = useState<Step[]>(() => buildSteps(mode, scope));
  const [words] = useState<LexEntry[]>(() => steps.flatMap((x) => (x.kind === 'present' ? [x.entry] : [])));
  const [i, setI] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [score, setScore] = useState(0);
  const [log, setLog] = useState<{ q: Question; ok: boolean }[]>([]);
  const [answered, setAnswered] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [done, setDone] = useState(false);

  // timeouts call onNext from an older render — keep the moving parts in refs
  const ref = useRef({ i, steps, lives, log });
  useLayoutEffect(() => {
    ref.current = { i, steps, lives, log };
  });
  const missed = useRef(new Set<string>());
  const repeats = useRef(new Map<string, number>());
  const retries = useRef(new WeakSet<Question>());
  const shownAt = useRef(0);
  const nextTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(nextTimer.current), []);

  const step = steps[i] as Step | undefined;

  const finish = () => {
    setDone(true);
    const { log: l } = ref.current;
    if (mode === 'learn') {
      recordSrs(
        words.flatMap((w) => (['de-ru', 'ru-de'] as const).map((d) => ({ key: lexKey(w, d), ok: !missed.current.has(w.id) }))),
        true,
      );
      recordSession('lexicon', words.length ? 1 - missed.current.size / words.length : 0);
    } else if (l.length) recordSession('lexicon', l.filter((x) => x.ok).length / l.length);
  };

  const onNext = () => {
    window.clearTimeout(nextTimer.current);
    const { i: cur, steps: all, lives: left } = ref.current;
    setAnswered(false);
    setTimeUp(false);
    if ((mode === 'speed' && left <= 0) || cur + 1 >= all.length) return finish();
    setI(cur + 1);
  };

  const loseLife = () => setLives((n) => (ref.current.lives = n - 1));

  const onAnswer = (ok: boolean) => {
    const q = step as Question;
    setAnswered(true);
    if (mode === 'learn') {
      const n = repeats.current.get(q.entry.id) ?? 0;
      if (!ok) missed.current.add(q.entry.id);
      if (!ok && n < 3) {
        repeats.current.set(q.entry.id, n + 1);
        // ask again a little later
        setSteps((all) => [...all.slice(0, i + 3), repeatQuestion(q, rng), ...all.slice(i + 3)]);
      }
      return;
    }
    if (retries.current.has(q)) return;
    setLog((l) => [...l, { q, ok }]);
    recordSrs(reviewUpdate(questionKey(q), ok, getProgress()), true);
    if (mode === 'review' && !ok) {
      const again = repeatQuestion(q, rng);
      retries.current.add(again);
      setSteps((all) => [...all, again]);
    }
    if (mode === 'speed') {
      if (ok) setScore((x) => x + speedPoints(SPEED_SECONDS * 1000 - (Date.now() - shownAt.current)));
      else loseLife();
    }
  };

  const onTimeUp = () => {
    setAnswered(true);
    setTimeUp(true);
    setLog((l) => [...l, { q: step as Question, ok: false }]);
    loseLife();
    nextTimer.current = window.setTimeout(onNext, 1400);
  };
  const timeUpRef = useRef(onTimeUp);
  useLayoutEffect(() => {
    timeUpRef.current = onTimeUp;
  });

  // speed review: a countdown for every question; running out costs a life (but doesn't reset the word)
  const counting = mode === 'speed' && !done && !answered && i < steps.length;
  useEffect(() => {
    if (!counting) return;
    shownAt.current = Date.now();
    const t = window.setTimeout(() => timeUpRef.current(), SPEED_SECONDS * 1000);
    return () => window.clearTimeout(t);
  }, [counting, i]);

  if (!steps.length) {
    return (
      <div className={s.summary}>
        <p>{mode === 'learn' ? 'Все слова этой темы уже выучены 🎉' : 'Сначала выучите хотя бы одно слово.'}</p>
        <Button variant="secondary" href={href(back)}>
          Назад
        </Button>
      </div>
    );
  }

  if (done) return <GameSummary mode={mode} words={words} log={log} score={score} back={back} restart={restart} />;

  return (
    <div className={s.game}>
      <GameHud back={back} progress={i / steps.length} speed={mode === 'speed' ? { lives, score, timerKey: i, paused: answered } : undefined} />
      <div className={s.stage} key={i}>
        {step!.kind === 'present' ? (
          <PresentCard entry={step!.entry} mine={!!progress.words[step!.entry.lemma]} onNext={onNext} />
        ) : step!.kind === 'type' ? (
          <TypeAnswer q={step!} lenient={progress.settings.lenientUmlauts} onAnswer={onAnswer} onNext={onNext} />
        ) : (
          <CardChoice
            q={step!}
            onAnswer={onAnswer}
            onNext={onNext}
            timeUp={timeUp}
            delayOk={mode === 'speed' ? 350 : 700}
            delayWrong={mode === 'speed' ? 1400 : undefined}
          />
        )}
      </div>
    </div>
  );
}
