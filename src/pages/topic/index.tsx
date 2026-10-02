import { getTopic, TOPICS } from '../../topics';
import { EXPLAIN } from '../../topics/explanations';
import { href } from '../../lib/router';
import { useProgress } from '../../lib/progress';
import { aiReady, providerLabel, useAISettings } from '../../ai/llm';
import { BackLink } from '../common/BackLink';
import { Button } from '../common/Button';
import { LevelBadge } from '../common/LevelBadge';
import { MetaRow } from '../common/MetaRow';
import { Muted } from '../common/Muted';
import { PageTitle } from '../common/PageTitle';
import { ScoreBadge } from '../common/ScoreBadge';
import { StickyActions } from '../common/StickyActions';
import s from './topic.module.css';

export function TopicPage({ id }: { id: string }) {
  const topic = getTopic(id);
  const progress = useProgress();
  const ai = useAISettings();
  if (!topic) {
    return (
      <p>
        Тема не найдена. <a href={href('/')}>Назад</a>
      </p>
    );
  }
  const Explain = EXPLAIN[id];
  const next = TOPICS[TOPICS.findIndex((t) => t.id === id) + 1];
  const stat = progress.topics[id];

  return (
    <article>
      <BackLink href={href('/')}>Все темы</BackLink>
      <header className={s.header}>
        <MetaRow>
          <LevelBadge level={topic.level} />
          <Muted>{topic.group}</Muted>
          <ScoreBadge stat={stat} />
        </MetaRow>
        <PageTitle>{topic.ru}</PageTitle>
        <p className={s.de} lang="de">
          {topic.de}
        </p>
      </header>

      <section className={s.explain}>
        <Explain />
      </section>

      <p className={s.note}>Упражнения каждый раз на новую тему лексики: еда, квартира, работа, путешествия…</p>
      <StickyActions>
        <Button href={href(`/t/${id}/practice`)}>{stat ? 'Тренироваться снова' : 'Начать упражнения'} →</Button>
        {aiReady(ai) && (
          <Button variant="outline" href={href(`/t/${id}/ai`)}>
            ✨ Новые упражнения от {providerLabel(ai)}
          </Button>
        )}
      </StickyActions>

      {next && (
        <a className={s.next} href={href(`/t/${next.id}`)}>
          Следующая тема: <b>{next.ru}</b> →
        </a>
      )}
    </article>
  );
}
