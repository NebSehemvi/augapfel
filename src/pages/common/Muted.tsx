import type { ReactNode } from 'react';
import s from './common.module.css';

/** Secondary, smaller grey text. */
export function Muted({ children, as: Tag = 'span' }: { children: ReactNode; as?: 'span' | 'p' | 'li' | 'div' }) {
  return <Tag className={s.muted}>{children}</Tag>;
}
