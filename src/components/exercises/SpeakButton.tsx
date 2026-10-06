import { canSpeak, speak } from '../../lib/speech';
import s from './ex.module.css';

/** Small 🔊 button in a task line (listening tasks): reads the German text aloud. */
export function SpeakButton({ text }: { text: string }) {
  if (!canSpeak) return null;
  return (
    <button type="button" className={s.speakBtn} onClick={() => speak(text)} aria-label="Прослушать">
      🔊
    </button>
  );
}
