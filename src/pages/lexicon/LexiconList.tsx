import { groupLabel, lexKey, type LexEntry } from '../../data/lexicon';
import { germanForm } from '../../exercises/vocab';
import { addWord, removeWord, useProgress } from '../../lib/progress';
import { CardGroup } from '../common/CardGroup';
import { LevelBadge } from '../common/LevelBadge';
import { MemoryDots } from '../common/MemoryDots';
import { Panel } from '../common/Panel';
import { WordList } from '../common/WordList';
import { WordRow } from '../common/WordRow';
import s from './lexicon.module.css';

/** The filtered lexicon grouped by theme; nouns can be starred into "⭐ Мои слова". */
export function LexiconList({ entries }: { entries: LexEntry[] }) {
  const progress = useProgress();
  const groups = [...new Set(entries.map((e) => e.group))];
  return (
    <>
      {groups.map((g) => {
        const list = entries.filter((e) => e.group === g);
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
                      badges={
                        <>
                          {(a || b) && <MemoryDots box={Math.min(a?.box ?? 0, b?.box ?? 0)} />}
                          {e.level && <LevelBadge level={e.level} />}
                          {e.kind === 'noun' && (
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
