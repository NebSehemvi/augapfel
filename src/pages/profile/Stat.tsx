import { Muted } from '../common/Muted';
import s from './profile.module.css';

export function Stat({ n, label, icon }: { n: number; label: string; icon: string }) {
  return (
    <div className={s.stat}>
      <span className={s.statIcon}>{icon}</span>
      <b className={s.statN}>{n}</b>
      <Muted>{label}</Muted>
    </div>
  );
}
