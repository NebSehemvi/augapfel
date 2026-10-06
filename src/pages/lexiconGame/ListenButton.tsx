import { useEffect } from 'react';
import { speak } from '../../lib/speech';
import s from './game.module.css';

/** Big "play" button for listening questions; the word is also read once when the question appears. */
export function ListenButton({ text }: { text: string }) {
  useEffect(() => {
    // iOS may block speech that wasn't started by a tap — the button is always there
    const t = window.setTimeout(() => speak(text), 250);
    return () => window.clearTimeout(t);
  }, [text]);
  return (
    <button type="button" className={s.listen} onClick={() => speak(text)} aria-label="Прослушать ещё раз">
      🔊
      <span className={s.listenHint}>Прослушать ещё раз</span>
    </button>
  );
}
