import type { ReactNode } from 'react';
import { Spinner } from './Spinner';
import s from './common.module.css';

/** A one-line status message: in progress (with spinner), success or error. */
export function StatusLine({ kind, children }: { kind: 'loading' | 'ok' | 'error'; children: ReactNode }) {
  const cls = kind === 'ok' ? s.statusOk : kind === 'error' ? s.statusError : '';
  return (
    <p className={`${s.status} ${cls}`} role="status">
      {kind === 'loading' && <Spinner />} {children}
    </p>
  );
}
