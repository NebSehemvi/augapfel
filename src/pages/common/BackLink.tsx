import type { ReactNode } from 'react';
import s from './common.module.css';

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className={s.back} href={href}>
      ← {children}
    </a>
  );
}
