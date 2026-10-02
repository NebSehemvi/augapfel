import type { CSSProperties, ReactNode } from 'react';
import s from './common.module.css';

/** A labelled group of controls. */
export function Field({ label, children, style }: { label: ReactNode; children: ReactNode; style?: CSSProperties }) {
  return (
    <div className={s.field} style={style}>
      <div className={s.fieldLabel}>{label}</div>
      {children}
    </div>
  );
}
