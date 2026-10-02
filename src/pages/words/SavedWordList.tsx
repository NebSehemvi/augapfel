import { useState } from 'react';
import { removeWord, useProgress, type SavedWord } from '../../lib/progress';
import { POS_LABEL, type Pos } from '../../lib/dictionary';
import { meaning } from '../../exercises/vocab';
import { MemoryDots } from '../common/MemoryDots';
import { Panel } from '../common/Panel';
import { TextInput } from '../common/TextInput';
import { WordList } from '../common/WordList';
import { WordRow } from '../common/WordRow';
import s from './words.module.css';

/** Searchable list of saved words with their learning progress and a delete button. */
export function SavedWordList({ words }: { words: SavedWord[] }) {
  const progress = useProgress();
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const shown = q ? words.filter((w) => `${w.lemma} ${w.ru ?? ''} ${w.en ?? ''}`.toLowerCase().includes(q)) : words;

  return (
    <Panel>
      <TextInput placeholder="Поиск по словам" value={query} onValue={setQuery} />
      <WordList>
        {shown.map((w) => (
          <WordRow
            key={w.lemma}
            word={w.lemma}
            meta={POS_LABEL[w.pos as Pos]}
            badges={
              <>
                <MemoryDots box={Math.min(progress.srs[`w|${w.lemma}|rec`]?.box ?? 0, progress.srs[`w|${w.lemma}|prod`]?.box ?? 0)} />
                <button className={s.iconBtn} onClick={() => removeWord(w.lemma)} aria-label={`Удалить ${w.lemma}`}>
                  ✕
                </button>
              </>
            }
            details={meaning(w)}
          />
        ))}
      </WordList>
    </Panel>
  );
}
