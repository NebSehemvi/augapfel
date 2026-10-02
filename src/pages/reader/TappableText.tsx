import { useMemo } from 'react';
import { tokenize } from '../../lib/dictionary';
import s from './reader.module.css';

export interface Selection {
  word: string;
  key: string;
}

/** The text with every word tappable; saved words are underlined, the selected one highlighted. */
export function TappableText({ paragraphs, isSaved, selected, onSelect }: { paragraphs: string[]; isSaved: (word: string) => boolean; selected: Selection | null; onSelect: (sel: Selection) => void }) {
  const tokens = useMemo(() => paragraphs.map(tokenize), [paragraphs]);
  return (
    <div className={s.text} lang="de">
      {tokens.map((toks, pi) => (
        <p key={pi}>
          {toks.map((t, ti) => {
            if (!t.word) return <span key={ti}>{t.text}</span>;
            const key = `${pi}-${ti}`;
            const select = () => onSelect({ word: t.word!, key });
            return (
              <span
                key={ti}
                role="button"
                tabIndex={0}
                className={`${s.w} ${isSaved(t.word) ? s.saved : ''} ${selected?.key === key ? s.selected : ''}`}
                onClick={select}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && select()}
              >
                {t.text}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}
