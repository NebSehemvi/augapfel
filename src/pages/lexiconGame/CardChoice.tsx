import { useEffect, useRef, useState } from 'react';
import type { CardQuestion } from '../../exercises/lexiconGame';
import { Button } from '../common/Button';
import ex from '../../components/exercises/ex.module.css';
import s from './game.module.css';

interface Props {
  q: CardQuestion;
  onAnswer: (ok: boolean) => void;
  onNext: () => void;
  /** time is up (speed review): show the right card, no more picking */
  timeUp?: boolean;
  /** go on automatically after a right / wrong answer (ms); without delayWrong a "Дальше" button appears */
  delayOk: number;
  delayWrong?: number;
}

/** Four cards; keys 1–4 pick a card on a keyboard. */
export function CardChoice({ q, onAnswer, onNext, timeUp, delayOk, delayWrong }: Props) {
  const [picked, setPicked] = useState<number | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const answered = picked !== null || !!timeUp;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const pick = (k: number) => {
    if (answered) return;
    setPicked(k);
    const ok = k === q.answer;
    onAnswer(ok);
    const delay = ok ? delayOk : delayWrong;
    if (delay !== undefined) timer.current = window.setTimeout(onNext, delay);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = Number(e.key) - 1;
      if (k >= 0 && k < q.options.length) pick(k);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const wrong = picked !== null && picked !== q.answer;
  return (
    <>
      <div className={s.modeLabel}>{q.dir === 'de-ru' ? 'Что это значит?' : 'Как это по-немецки?'}</div>
      <div className={ex.cardPrompt} lang={q.promptLang}>
        {q.prompt}
        {q.sub && <span className={ex.cardSub}>{q.sub}</span>}
      </div>
      <div className={ex.cardGrid}>
        {q.options.map((o, k) => {
          const st = !answered ? '' : k === q.answer ? ex.optOk : k === picked ? ex.optBad : ex.optDim;
          return (
            <button key={k} type="button" lang={q.optionsLang} className={`${ex.cardOpt} ${st}`} onClick={() => pick(k)}>
              {o}
            </button>
          );
        })}
      </div>
      <div className={s.bottom}>
        <div className={`${s.feedback} ${picked === q.answer ? s.feedbackOk : s.feedbackBad}`} role="status">
          {picked === q.answer ? 'Richtig!' : timeUp ? '⏰ Время вышло' : wrong ? 'Неверно — правильный ответ отмечен зелёным' : ''}
        </div>
        {wrong && delayWrong === undefined && (
          <Button onClick={onNext} autoFocus>
            Дальше →
          </Button>
        )}
      </div>
    </>
  );
}
