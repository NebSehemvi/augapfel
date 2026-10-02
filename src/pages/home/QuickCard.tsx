import s from './home.module.css';

/** Shortcut tile on the home screen; `hot` highlights it (e.g. cards due for review). */
export function QuickCard({ href, icon, title, sub, hot }: { href: string; icon: string; title: string; sub: string; hot?: boolean }) {
  return (
    <a className={`${s.quickCard} ${hot ? s.quickHot : ''}`} href={href}>
      <span className={s.quickIcon}>{icon}</span>
      <span>
        <b>{title}</b>
        <span className={s.quickSub}>{sub}</span>
      </span>
    </a>
  );
}
