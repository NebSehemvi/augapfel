import { useState } from 'react';
import { THEMES } from '../../data/themes';
import { href, navigate } from '../../lib/router';
import { lookupLocal } from '../../lib/dictionary';
import { useProgress } from '../../lib/progress';
import { deleteUserText, findText } from '../../lib/userTexts';
import { WordPopup } from '../../components/WordPopup';
import { BackLink } from '../common/BackLink';
import { Button } from '../common/Button';
import { LevelBadge } from '../common/LevelBadge';
import { MetaRow } from '../common/MetaRow';
import { Muted } from '../common/Muted';
import { PageTitle } from '../common/PageTitle';
import { StickyActions } from '../common/StickyActions';
import { SourceNote } from './SourceNote';
import { TappableText, type Selection } from './TappableText';
import s from './reader.module.css';

export function ReaderPage({ id }: { id: string }) {
  const text = findText(id);
  const progress = useProgress();
  const [selected, setSelected] = useState<Selection | null>(null);

  if (!text) {
    return (
      <p>
        Текст не найден. <a href={href('/texts')}>К текстам</a>
      </p>
    );
  }
  const theme = THEMES.find((t) => t.id === text.theme);
  const isSaved = (w: string) => {
    const info = lookupLocal(w, text.glossary);
    return !!info && !!progress.words[info.lemma];
  };

  return (
    <article className={s.reader}>
      <BackLink href={href('/texts')}>Тексты</BackLink>
      <MetaRow>
        <LevelBadge level={text.level} />
        <Muted>{theme ? `${theme.emoji} ${theme.name.ru}` : '✨ Мой текст'}</Muted>
      </MetaRow>
      <PageTitle lang="de">{text.title}</PageTitle>
      <p className={s.tip}>Нажмите на слово, чтобы увидеть перевод.</p>

      <TappableText paragraphs={text.paragraphs} isSaved={isSaved} selected={selected} onSelect={setSelected} />
      <SourceNote text={text} />

      <StickyActions>
        <Button href={href(`/read/${text.id}/practice`)}>Вопросы и упражнения →</Button>
      </StickyActions>

      {text.generated && (
        <Button
          variant="danger"
          className={s.delete}
          onClick={() => {
            if (confirm('Удалить этот текст?')) {
              deleteUserText(text.id);
              navigate('/texts');
            }
          }}
        >
          Удалить текст
        </Button>
      )}

      {selected && <WordPopup word={selected.word} glossary={text.glossary} textId={text.id} onClose={() => setSelected(null)} />}
    </article>
  );
}
