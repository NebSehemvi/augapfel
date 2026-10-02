import { useEffect, useState } from 'react';
import { lookupLocal, lookupWiktionary, POS_LABEL, type GlossEntry, type WordInfo } from '../lib/dictionary';
import { addWord, removeWord, useProgress } from '../lib/progress';
import s from './WordPopup.module.css';

const SOURCE_LABEL: Record<WordInfo['source'], string> = {
  text: 'словарь текста',
  app: 'словарь приложения',
  common: 'словарь приложения',
  wiktionary: 'Wiktionary (англ.)',
};

export function WordPopup({ word, glossary, textId, onClose }: { word: string; glossary?: Record<string, GlossEntry>; textId?: string; onClose: () => void }) {
  const local = lookupLocal(word, glossary);
  const [remote, setRemote] = useState<{ word: string; info: WordInfo | null } | null>(null);
  const progress = useProgress();

  useEffect(() => {
    if (local) return;
    let alive = true;
    lookupWiktionary(word).then((info) => alive && setRemote({ word, info }));
    return () => {
      alive = false;
    };
  }, [word, local]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const info = local ?? (remote?.word === word ? remote.info : undefined);
  const loading = info === undefined;
  const saved = info ? !!progress.words[info.lemma] : false;
  const canSave = !!info && !!(info.ru || info.en) && info.pos !== 'art' && info.pos !== 'pron';

  return (
    <>
      <div className={s.backdrop} onClick={onClose} />
      <div className={s.sheet} role="dialog" aria-label={`Перевод: ${word}`}>
        <button className={s.close} onClick={onClose} aria-label="Закрыть">
          ✕
        </button>
        {loading && <p className={s.muted}>Ищу «{word}» в Wiktionary…</p>}
        {info === null && <p className={s.muted}>Не нашёл перевод для «{word}». Возможно, это имя или редкое слово.</p>}
        {info && (
          <>
            <div className={s.lemma} lang="de">
              {info.lemma}
            </div>
            <div className={s.meta}>
              {POS_LABEL[info.pos]}
              {info.pos === 'noun' && info.pl ? ` · мн. ч.: ${info.pl}` : ''}
              {info.lemma.toLowerCase() !== word.toLowerCase() && (
                <>
                  {' '}
                  · в тексте: <i lang="de">{word}</i>
                </>
              )}
            </div>
            {info.note && <div className={s.note}>{info.note}</div>}
            {info.ru && <div className={s.ru}>{info.ru}</div>}
            {info.en && <div className={s.en}>{info.en}</div>}
            <div className={s.footer}>
              <span className={s.source}>{SOURCE_LABEL[info.source]}</span>
              {canSave &&
                (saved ? (
                  <button className={s.savedBtn} onClick={() => removeWord(info.lemma)}>
                    ✓ В моих словах
                  </button>
                ) : (
                  <button className={s.saveBtn} onClick={() => addWord({ lemma: info.lemma, pos: info.pos, ru: info.ru, en: info.en, pl: info.pl, source: textId })}>
                    ＋ В мои слова
                  </button>
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
