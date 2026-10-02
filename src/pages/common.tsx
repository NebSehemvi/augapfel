import type { TopicStat } from '../lib/progress';
import s from './pages.module.css';

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

export function LevelBadge({ level }: { level: string }) {
  return <span className={`${s.level} ${level === 'A1' ? s.levelA1 : level === 'A2' ? s.levelA2 : s.levelB1}`}>{level}</span>;
}
