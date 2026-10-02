import type { ReactNode } from 'react';
import s from './common.module.css';

/** Main call-to-action buttons that stay visible above the tab bar while scrolling. */
export function StickyActions({ children }: { children: ReactNode }) {
  return <div className={s.stickyActions}>{children}</div>;
}
