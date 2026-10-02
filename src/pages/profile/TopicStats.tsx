import { TOPICS } from '../../topics';
import { href } from '../../lib/router';
import { useProgress } from '../../lib/progress';
import { Muted } from '../common/Muted';
import { Panel } from '../common/Panel';
import { ScoreBadge } from '../common/ScoreBadge';
import s from './profile.module.css';

/** Best score for every grammar topic. */
export function TopicStats() {
  const progress = useProgress();
  return (
    <Panel title="Темы">
      <ul className={s.topicStats}>
        {TOPICS.map((t) => (
          <li key={t.id}>
            <a href={href(`/t/${t.id}`)}>
              <Muted>{t.level}</Muted> {t.ru}
            </a>
            <ScoreBadge stat={progress.topics[t.id]} />
          </li>
        ))}
      </ul>
    </Panel>
  );
}
