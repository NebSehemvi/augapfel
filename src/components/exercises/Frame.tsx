import type { ReactNode } from 'react';
import { UmlautBar } from './inputs';
import s from './ex.module.css';

interface Props {
  title: string;
  instruction: string;
  checked: boolean;
  canCheck: boolean;
  onCheck: () => void;
  onNext: () => void;
  /** e.g. "4 из 5" */
  score?: { correct: number; total: number };
  umlauts?: boolean;
  children: ReactNode;
}

export function Frame({ title, instruction, checked, canCheck, onCheck, onNext, score, umlauts, children }: Props) {
  const perfect = score && score.correct === score.total;
  return (
    <form
      className={s.frame}
      onSubmit={(e) => {
        e.preventDefault();
        if (checked) onNext();
        else if (canCheck) onCheck();
      }}
    >
      <header className={s.head}>
        <h2 className={s.title}>{title}</h2>
        <p className={s.instruction}>{instruction}</p>
      </header>
      <div className={s.body}>{children}</div>
      <footer className={s.footer}>
        {umlauts && !checked && <UmlautBar />}
        <div className={s.footerRow}>
          {checked && score ? (
            <div className={`${s.verdict} ${perfect ? s.verdictOk : s.verdictBad}`} role="status">
              {perfect ? 'Richtig! 🎉' : `Верно: ${score.correct} из ${score.total}`}
            </div>
          ) : (
            <div className={s.verdict} />
          )}
          {checked ? (
            <button type="submit" className={s.primary} autoFocus>
              Дальше →
            </button>
          ) : (
            <button type="submit" className={s.primary} disabled={!canCheck}>
              Проверить
            </button>
          )}
        </div>
      </footer>
    </form>
  );
}

/** Small "correct answer" line shown under a wrong item. */
export function Solution({ children }: { children: ReactNode }) {
  return (
    <div className={s.solution} lang="de">
      <span aria-hidden>✓ </span>
      {children}
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <div className={s.note}>{children}</div>;
}
