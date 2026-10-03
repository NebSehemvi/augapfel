import { groupLabel, lexKey, type LexEntry } from '../../data/lexicon';
import { useState } from 'react';
import { germanForm } from '../../exercises/vocab';
import { addWord, removeWord, useProgress } from '../../lib/progress';
import { CardGroup } from '../common/CardGroup';
import { LevelBadge } from '../common/LevelBadge';
import { MemoryDots } from '../common/MemoryDots';
import { Muted } from '../common/Muted';
import { Panel } from '../common/Panel';
import { TextInput } from '../common/TextInput';
import { WordList } from '../common/WordList';
import { WordRow } from '../common/WordRow';
import s from './lexicon.module.css';

/** The filtered lexicon grouped by theme / kind, with search; nouns and verbs can be starred into "⭐ Мои слова". */
export function LexiconList({ entries }: { entries: LexEntry[] }) {
  const progress = useProgress();
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const shown = q ? entries.filter((e) => [e.lemma, e.ru, e.en, e.pl, e.forms].join(' ').toLowerCase().includes(q)) : entries;
  const groups = [...new Set(shown.map((e) => e.group))];
  return (
    <>
      <div className={s.search}>
        <TextInput placeholder="Поиск: helfen, помогать, geholfen…" value={query} onValue={setQuery} lang="de" autoCapitalize="off" autoCorrect="off" />
      </div>
      {shown.length === 0 && <Muted as="p">Ничего не найдено.</Muted>}
      {groups.map((g) => {
        const list = shown.filter((e) => e.group === g);
        return (
          <CardGroup key={g} title={`${groupLabel(list[0].kind, g)} · ${list.length}`}>
            <Panel>
              <WordList>
                {list.map((e) => {
                  const a = progress.srs[lexKey(e, 'ru-de')];
                  const b = progress.srs[lexKey(e, 'de-ru')];
                  const saved = !!progress.words[e.lemma];
                  return (
                    <WordRow
                      key={e.id}
                      word={germanForm(e)}
                      meta={e.ru}
                      details={e.forms}
                      detailsLang="de"
                      badges={
                        <>
                          {(a || b) && <MemoryDots box={Math.min(a?.box ?? 0, b?.box ?? 0)} />}
                          {e.level && <LevelBadge level={e.level} />}
                          {(e.kind === 'noun' || e.kind === 'verb') && (
                            <button
                              className={`${s.save} ${saved ? s.saved : ''}`}
                              onClick={() => (saved ? removeWord(e.lemma) : addWord({ lemma: e.lemma, pos: e.pos, ru: e.ru, en: e.en, pl: e.pl }))}
                              aria-label={saved ? `Убрать ${e.lemma} из моих слов` : `Добавить ${e.lemma} в мои слова`}
                              aria-pressed={saved}
                              title={saved ? 'В моих словах' : 'В мои слова'}
                            >
                              {saved ? '★' : '☆'}
                            </button>
                          )}
                        </>
                      }
                    />
                  );
                })}
              </WordList>
            </Panel>
          </CardGroup>
        );
      })}
    </>
  );
}
