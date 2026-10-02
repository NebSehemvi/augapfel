import type { ButtonHTMLAttributes, ReactNode } from 'react';
import s from './common.module.css';

export type ButtonVariant = 'primary' | 'compact' | 'secondary' | 'outline' | 'danger';

type Props = {
  variant?: ButtonVariant;
  /** render as a link */
  href?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/** Button or link styled as a button. A disabled link is greyed out and not clickable. */
export function Button({ variant = 'primary', href, children, className, disabled, type = 'button', ...rest }: Props) {
  const cls = `${s[variant]} ${className ?? ''}`;
  if (href !== undefined) {
    return (
      <a className={`${cls} ${disabled ? s.disabledLink : ''}`} href={disabled ? undefined : href} aria-disabled={disabled || undefined} style={rest.style}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={cls} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
