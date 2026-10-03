import type { LexEntry } from '../../data/lexicon';
import { germanForm } from '../../exercises/vocab';
import { POS_LABEL, type Pos } from '../../lib/dictionary';
import { Button } from '../common/Button';
import { LevelBadge } from '../common/LevelBadge';
import { canSpeak, speak } from './speak';
import s from './game.module.css';

/** A new word is shown before it is tested: German (with article and plural), translation, level. */
export function PresentCard({ entry, mine, onNext }: { entry: LexEntry; mine: boolean; onNext: () => void }) {
  const de = germanForm(entry);
  return (
    <>
      <div className={s.present}>
        <div className={s.newBadge}>{mine ? '⭐ Ваше слово' : '🌱 Новое слово'}</div>
        <div className={s.word} lang="de">
          {de}
        </div>
        {canSpeak && (
          <button type="button" className={s.speak} onClick={() => speak(de)}>
            🔊 Произнести
          </button>
        )}
        <div className={s.ru}>{entry.ru}</div>
        {entry.en && (
          <div className={s.en} lang="en">
            {entry.en}
          </div>
        )}
        <div className={s.meta}>
          {POS_LABEL[entry.pos as Pos]}
          {entry.level && <LevelBadge level={entry.level} />}
        </div>
      </div>
      <div className={s.bottom}>
        <Button onClick={onNext} autoFocus>
          Запомнил →
        </Button>
      </div>
    </>
  );
}
