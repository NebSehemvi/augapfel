import type { InputHTMLAttributes } from 'react';
import s from './common.module.css';

/** Full-width rounded text input (search, keys, topics). Inside a FormRow it shares the line with a button. */
export function TextInput({ value, onValue, className, ...rest }: { value: string; onValue: (v: string) => void } & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  return <input className={`${s.input} ${className ?? ''}`} value={value} onChange={(e) => onValue(e.target.value)} {...rest} />;
}
