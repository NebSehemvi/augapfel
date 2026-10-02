import s from './profile.module.css';

/** Checkbox (or radio) with a label and an optional grey hint. */
export function Toggle({ checked, onChange, label, hint, type = 'checkbox', name }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string; type?: 'checkbox' | 'radio'; name?: string }) {
  return (
    <label className={s.toggle}>
      <input type={type} name={name} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        {label}
        {hint && <span className={s.toggleHint}>{hint}</span>}
      </span>
    </label>
  );
}
