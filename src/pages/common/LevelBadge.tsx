import s from './common.module.css';

export function LevelBadge({ level }: { level: string }) {
  return <span className={`${s.level} ${level === 'A1' ? s.levelA1 : level === 'A2' ? s.levelA2 : s.levelB1}`}>{level}</span>;
}
