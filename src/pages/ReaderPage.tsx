import { useMemo, useState } from 'react';
import { sourceLabel } from '../data/texts';
import { THEMES } from '../data/themes';
import { href, navigate } from '../lib/router';
import { lookupLocal, tokenize } from '../lib/dictionary';
import { useProgress } from '../lib/progress';
import { deleteUserText, findText } from '../lib/userTexts';
import { WordPopup } from '../components/WordPopup';
import { LevelBadge } from './common';
import s from './pages.module.css';

export function ReaderPage({ id }: { id: string }) {
  const text = findText(id);
  const progress = useProgress();
  const [selected, setSelected] = useState<{ word: string; key: string } | null>(null);
  const paragraphs = useMemo(() => text?.paragraphs.map(tokenize) ?? [], [text]);

  if (!text) {
    return (
      <p>
        Текст не найден. <a href={href('/texts')}>К текстам</a>
      </p>
    );
  }
  const theme = THEMES.find((t) => t.id === text.theme);
  const source = sourceLabel(text);
  const savedLemma = (w: string) => {
    const info = lookupLocal(w, text.glossary);
    return !!info && !!progress.words[info.lemma];
  };

  return (
    <article className={s.reader}>
      <a className={s.back} href={href('/texts')}>
        ← Тексты
      </a>
      <div className={s.topicMeta}>
        <LevelBadge level={text.level} />
        <span className={s.muted}>{theme ? `${theme.emoji} ${theme.name.ru}` : '✨ Мой текст'}</span>
      </div>
      <h1 className={s.h1} lang="de">
        {text.title}
      </h1>
      <p className={s.readerTip}>Нажмите на слово, чтобы увидеть перевод.</p>

      <div className={s.readerText} lang="de">
        {paragraphs.map((toks, pi) => (
          <p key={pi}>
            {toks.map((t, ti) => {
              if (!t.word) return <span key={ti}>{t.text}</span>;
              const key = `${pi}-${ti}`;
              return (
                <span
                  key={ti}
                  role="button"
                  tabIndex={0}
                  className={`${s.w} ${savedLemma(t.word) ? s.wSaved : ''} ${selected?.key === key ? s.wSel : ''}`}
                  onClick={() => setSelected({ word: t.word!, key })}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelected({ word: t.word!, key })}
                >
                  {t.text}
                </span>
              );
            })}
          </p>
        ))}
      </div>

      {source && (
        <p className={s.source}>
          {text.sourceUrl ? (
            <a href={text.sourceUrl} target="_blank" rel="noreferrer">
              {source}
            </a>
          ) : (
            source
          )}
        </p>
      )}

      <div className={s.startBar}>
        <a className={s.startBtn} href={href(`/read/${text.id}/practice`)}>
          Вопросы и упражнения →
        </a>
      </div>

      {text.generated && (
        <button
          className={s.dangerBtn}
          style={{ marginTop: '1.5rem' }}
          onClick={() => {
            if (confirm('Удалить этот текст?')) {
              deleteUserText(text.id);
              navigate('/texts');
            }
          }}
        >
          Удалить текст
        </button>
      )}

      {selected && <WordPopup word={selected.word} glossary={text.glossary} textId={text.id} onClose={() => setSelected(null)} />}
    </article>
  );
}
