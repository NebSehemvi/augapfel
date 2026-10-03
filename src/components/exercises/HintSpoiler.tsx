import { useState } from 'react';
import s from './ex.module.css';

/** A hint hidden behind a tap ("💡 подсказка"); always shown once the exercise is checked. */
export function HintSpoiler({ text, revealed }: { text: string; revealed?: boolean }) {
  const [open, setOpen] = useState(false);
  if (open || revealed) return <span className={s.hint}> ({text})</span>;
  return (
    <button type="button" className={s.hintBtn} onClick={() => setOpen(true)} aria-label="Показать подсказку">
      💡 подсказка
    </button>
  );
}

/** Information that is not a hint about the answer (e.g. which "sie" is meant) — always visible. */
export function Context({ text }: { text?: string }) {
  return text ? <span className={s.hint}> ({text})</span> : null;
}
