import type { TopicStat } from '../../lib/progress';
import s from './common.module.css';

/** Best score of a topic/text, or "новое" when it was never practised. */
export function ScoreBadge({ stat }: { stat?: TopicStat }) {
  if (!stat) return <span className={`${s.score} ${s.scoreNew}`}>новое</span>;
  const pct = Math.round(stat.best * 100);
  const cls = pct >= 90 ? s.scoreGreat : pct >= 70 ? s.scoreGood : s.scoreLow;
  return (
    <span className={`${s.score} ${cls}`} title={`Лучший результат: ${pct}%, занятий: ${stat.sessions}`}>
      {pct}%
    </span>
  );
}
