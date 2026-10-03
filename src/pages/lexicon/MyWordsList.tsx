import { useState } from 'react';
import { lexKey } from '../../data/lexicon';
import { removeWord, useProgress } from '../../lib/progress';
import { POS_LABEL, type Pos } from '../../lib/dictionary';
import { myEntries } from '../../exercises/lexiconGame';
import { germanForm, meaning } from '../../exercises/vocab';
import { href } from '../../lib/router';
import { MemoryDots } from '../common/MemoryDots';
import { Muted } from '../common/Muted';
import { Panel } from '../common/Panel';
import { TextInput } from '../common/TextInput';
import { WordList } from '../common/WordList';
import { WordRow } from '../common/WordRow';
import s from './lexicon.module.css';
import { Gendered } from '../../components/Gendered';

/** Searchable list of saved words (newest first) with their learning progress and a delete button. */
export function MyWordsList() {
  const progress = useProgress();
  const [query, setQuery] = useState('');
  const words = myEntries(progress).reverse();
  const q = query.trim().toLowerCase();
  const shown = q ? words.filter((w) => `${w.lemma} ${w.ru ?? ''} ${w.en ?? ''}`.toLowerCase().includes(q)) : words;

  if (!words.length) {
    return (
      <Muted as="p">
        Пока пусто. Откройте <a href={href('/texts')}>текст</a> и нажмите на незнакомое слово, отметьте ☆ слово в списке лексики или добавьте его выше.
      </Muted>
    );
  }

  return (
    <Panel>
      <TextInput placeholder="Поиск по словам" value={query} onValue={setQuery} />
      <WordList>
        {shown.map((w) => {
          const a = progress.srs[lexKey(w, 'ru-de')];
          const b = progress.srs[lexKey(w, 'de-ru')];
          return (
            <WordRow
              key={w.id}
              word={<Gendered text={germanForm(w)} />}
              meta={POS_LABEL[w.pos as Pos]}
              badges={
                <>
                  {a || b ? <MemoryDots box={Math.min(a?.box ?? 0, b?.box ?? 0)} /> : <Muted>новое</Muted>}
                  <button className={s.iconBtn} onClick={() => removeWord(w.lemma)} aria-label={`Удалить ${w.lemma}`}>
                    ✕
                  </button>
                </>
              }
              details={meaning(w)}
            />
          );
        })}
      </WordList>
    </Panel>
  );
}
