import type { ReactNode } from 'react';
import s from './common.module.css';

/** Small row of badges/labels above a page title. */
export function MetaRow({ children }: { children: ReactNode }) {
  return <div className={s.metaRow}>{children}</div>;
}
