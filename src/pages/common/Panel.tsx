import type { ReactNode } from 'react';
import s from './common.module.css';

/** White card section with an optional heading. */
export function Panel({ title, children }: { title?: ReactNode; children: ReactNode }) {
  return (
    <section className={s.panel}>
      {title && <h2 className={s.panelTitle}>{title}</h2>}
      {children}
    </section>
  );
}
