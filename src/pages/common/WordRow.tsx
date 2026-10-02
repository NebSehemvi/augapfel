import type { ReactNode } from 'react';
import s from './common.module.css';

/** One dictionary row: word, grey meta (meaning / part of speech), badges on the right, details below. */
export function WordRow({ word, meta, badges, details, detailsLang }: { word: ReactNode; meta?: ReactNode; badges?: ReactNode; details?: ReactNode; detailsLang?: string }) {
  return (
    <li className={s.wordRow}>
      <div className={s.wordTop}>
        <b lang="de">{word}</b>
        {meta && <span className={s.muted}>{meta}</span>}
        {badges && <span className={s.wordBadges}>{badges}</span>}
      </div>
      {details && (
        <div className={s.wordDetails} lang={detailsLang}>
          {details}
        </div>
      )}
    </li>
  );
}
