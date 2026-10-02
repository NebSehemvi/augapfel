import type { ReactNode } from 'react';
import s from './common.module.css';

export function WordList({ children }: { children: ReactNode }) {
  return <ul className={s.wordList}>{children}</ul>;
}
