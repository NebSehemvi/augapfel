import { useState } from 'react';
import { BUILTIN_TEXTS } from '../../data/texts';
import { THEMES } from '../../data/themes';
import { useProgress } from '../../lib/progress';
import { useUserTexts } from '../../lib/userTexts';
import { CardGroup } from '../common/CardGroup';
import { PageTitle } from '../common/PageTitle';
import { Segmented } from '../common/Segmented';
import { Generator } from './Generator';
import { TextCard } from './TextCard';

export function TextsPage() {
  const progress = useProgress();
  const mine = useUserTexts();
  const level = progress.settings.level;
  const [show, setShow] = useState<'level' | 'all'>('level');
  const visible = BUILTIN_TEXTS.filter((t) => show === 'all' || t.level === level || (level === 'A2' && t.level === 'A1'));

  return (
    <div>
      <PageTitle sub="Нажмите на любое слово в тексте — появится перевод, и слово можно добавить в «Мои слова».">Тексты</PageTitle>

      <Generator />

      {mine.length > 0 && (
        <CardGroup title="Мои тексты">
          {mine.map((t) => (
            <TextCard key={t.id} text={t} stat={progress.topics[`text:${t.id}`]} />
          ))}
        </CardGroup>
      )}

      <Segmented
        value={show}
        onChange={setShow}
        ariaLabel="Какие тексты показать"
        style={{ margin: '0.4rem 0 1rem' }}
        options={[
          { value: 'level', label: `Мой уровень (${level})` },
          { value: 'all', label: 'Все' },
        ]}
      />

      {THEMES.map((th) => {
        const list = visible.filter((t) => t.theme === th.id);
        if (!list.length) return null;
        return (
          <CardGroup key={th.id} title={`${th.emoji} ${th.name.ru}`}>
            {list.map((t) => (
              <TextCard key={t.id} text={t} stat={progress.topics[`text:${t.id}`]} />
            ))}
          </CardGroup>
        );
      })}
    </div>
  );
}
