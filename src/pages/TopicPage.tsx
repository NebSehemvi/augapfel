import { getTopic, TOPICS } from '../topics';
import { EXPLAIN } from '../topics/explanations';
import { href } from '../lib/router';
import { useProgress } from '../lib/progress';
import { LevelBadge, ScoreBadge } from './common';
import { aiReady, providerLabel, useAISettings } from '../ai/llm';
import s from './pages.module.css';

export function TopicPage({ id }: { id: string }) {
  const topic = getTopic(id);
  const progress = useProgress();
  const ai = useAISettings();
  if (!topic) return <p>Тема не найдена. <a href={href('/')}>Назад</a></p>;
  const Explain = EXPLAIN[id];
  const idx = TOPICS.findIndex((t) => t.id === id);
  const next = TOPICS[idx + 1];
  const stat = progress.topics[id];

  return (
    <article className={s.topic}>
      <a className={s.back} href={href('/')}>
        ← Все темы
      </a>
      <header className={s.topicHead}>
        <div className={s.topicMeta}>
          <LevelBadge level={topic.level} />
          <span className={s.muted}>{topic.group}</span>
          <ScoreBadge stat={stat} />
        </div>
        <h1 className={s.h1}>{topic.ru}</h1>
        <p className={s.topicDe} lang="de">
          {topic.de}
        </p>
      </header>

      <section className={s.explain}>
        <Explain />
      </section>

      <p className={s.startNote}>Упражнения каждый раз на новую тему лексики: еда, квартира, работа, путешествия…</p>
      <div className={s.startBar}>
        <a className={s.startBtn} href={href(`/t/${id}/practice`)}>
          {stat ? 'Тренироваться снова' : 'Начать упражнения'} →
        </a>
        {aiReady(ai) && (
          <a className={s.aiBtn} href={href(`/t/${id}/ai`)}>
            ✨ Новые упражнения от {providerLabel(ai)}
          </a>
        )}
      </div>

      {next && (
        <a className={s.nextTopic} href={href(`/t/${next.id}`)}>
          Следующая тема: <b>{next.ru}</b> →
        </a>
      )}
    </article>
  );
}
