import type { FormEvent, ReactNode } from 'react';
import s from './common.module.css';

/** Input + button on one line. Renders a <form> when `onSubmit` is given. */
export function FormRow({ children, onSubmit }: { children: ReactNode; onSubmit?: () => void }) {
  if (!onSubmit) return <div className={s.formRow}>{children}</div>;
  return (
    <form
      className={s.formRow}
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {children}
    </form>
  );
}
