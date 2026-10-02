import type { ReactNode } from 'react';
import s from './common.module.css';

/** A titled group of card links. */
export function CardGroup({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <section className={s.group}>
      <h2 className={s.groupTitle}>{title}</h2>
      <div className={s.cards}>{children}</div>
    </section>
  );
}
