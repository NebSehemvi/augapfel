import type { ReactNode } from 'react';
import s from './common.module.css';

/** List card: title, one-line German preview and a badge on the right. */
export function CardLink({ href, title, sub, badge, titleLang }: { href: string; title: ReactNode; sub: ReactNode; badge?: ReactNode; titleLang?: string }) {
  return (
    <a className={s.card} href={href}>
      <div className={s.cardMain}>
        <div className={s.cardTitle} lang={titleLang}>
          {title}
        </div>
        <div className={s.cardSub} lang="de">
          {sub}
        </div>
      </div>
      {badge}
    </a>
  );
}
