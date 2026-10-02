import s from './verbs.module.css';

/** Pill buttons. `value` may be a single value (radio) or a list (multi-select). */
export function Chips<T extends string | number>({ options, value, label, onChange }: { options: readonly T[]; value: T | readonly T[]; label: (x: T) => string; onChange: (x: T) => void }) {
  const isOn = (o: T) => (Array.isArray(value) ? value.includes(o) : o === value);
  return (
    <div className={s.chips}>
      {options.map((o) => (
        <button key={String(o)} type="button" className={`${s.chip} ${isOn(o) ? s.chipOn : ''}`} onClick={() => onChange(o)}>
          {label(o)}
        </button>
      ))}
    </div>
  );
}
