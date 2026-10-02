import type { CSSProperties, ReactNode } from 'react';
import s from './common.module.css';

export interface SegmentOption<T extends string> {
  value: T;
  label: ReactNode;
  /** render as a link instead of a button */
  href?: string;
}

/** iOS-style segmented switch. Options with `href` render as links (tabs between pages). */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  disabled,
  style,
}: {
  options: SegmentOption<T>[];
  value: T;
  onChange?: (v: T) => void;
  ariaLabel?: string;
  disabled?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div className={s.segment} role="tablist" aria-label={ariaLabel} style={style}>
      {options.map((o) => {
        const cls = `${s.segBtn} ${o.value === value ? s.segOn : ''}`;
        return o.href ? (
          <a key={o.value} role="tab" aria-selected={o.value === value} className={cls} href={o.href}>
            {o.label}
          </a>
        ) : (
          <button key={o.value} type="button" role="tab" aria-selected={o.value === value} className={cls} onClick={() => onChange?.(o.value)} disabled={disabled}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
