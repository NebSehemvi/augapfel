import type { ReactNode } from 'react';
import s from './common.module.css';

/** Page heading with an optional muted subtitle. */
export function PageTitle({ children, sub, as: Tag = 'h1', lang }: { children: ReactNode; sub?: ReactNode; as?: 'h1' | 'h2'; lang?: string }) {
  return (
    <>
      <Tag className={s.title} lang={lang}>
        {children}
      </Tag>
      {sub && <p className={s.sub}>{sub}</p>}
    </>
  );
}
