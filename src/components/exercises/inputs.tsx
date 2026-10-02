import { createContext, useContext, useRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import s from './ex.module.css';

interface Target {
  el: HTMLInputElement | HTMLTextAreaElement;
  set: (v: string) => void;
}

interface Registry {
  get: () => Target | null;
  set: (t: Target) => void;
}

const UmlautCtx = createContext<Registry | null>(null);

/** Remembers the last focused text field so the ä/ö/ü bar can type into it. */
export function UmlautProvider({ children }: { children: ReactNode }) {
  const ref = useRef<Target | null>(null);
  const [registry] = useState<Registry>(() => ({ get: () => ref.current, set: (t) => (ref.current = t) }));
  return <UmlautCtx.Provider value={registry}>{children}</UmlautCtx.Provider>;
}

const CHARS = ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'];

export function UmlautBar() {
  const registry = useContext(UmlautCtx);
  const insert = (ch: string) => {
    const t = registry?.get();
    if (!t) return;
    const { el, set } = t;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const next = el.value.slice(0, start) + ch + el.value.slice(end);
    set(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + 1, start + 1);
    });
  };
  return (
    <div className={s.umlauts} aria-label="Немецкие буквы">
      {CHARS.map((c) => (
        <button key={c} type="button" className={s.umlaut} onPointerDown={(e) => e.preventDefault()} onClick={() => insert(c)} lang="de">
          {c}
        </button>
      ))}
    </div>
  );
}

type UInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  value: string;
  onValue: (v: string) => void;
  state?: 'ok' | 'bad' | 'almost' | null;
  widthCh?: number;
};

export function UInput({ value, onValue, state, widthCh, className, style, ...rest }: UInputProps) {
  const ctx = useContext(UmlautCtx);
  return (
    <input
      {...rest}
      lang="de"
      autoCapitalize="off"
      autoCorrect="off"
      autoComplete="off"
      spellCheck={false}
      className={`${s.input} ${state ? s[state] : ''} ${className ?? ''}`}
      style={{ ...style, ...(widthCh ? { width: `${widthCh}ch` } : {}) }}
      value={value}
      onChange={(e) => onValue(e.target.value)}
      onFocus={(e) => {
        ctx?.set({ el: e.currentTarget, set: onValue });
      }}
    />
  );
}

export function UTextarea({ value, onValue, state, disabled }: { value: string; onValue: (v: string) => void; state?: 'ok' | 'bad' | 'almost' | null; disabled?: boolean }) {
  const ctx = useContext(UmlautCtx);
  return (
    <textarea
      lang="de"
      rows={3}
      autoCapitalize="sentences"
      autoCorrect="off"
      autoComplete="off"
      spellCheck={false}
      disabled={disabled}
      className={`${s.textarea} ${state ? s[state] : ''}`}
      value={value}
      placeholder="Schreiben Sie hier …"
      onChange={(e) => onValue(e.target.value)}
      onFocus={(e) => {
        ctx?.set({ el: e.currentTarget, set: onValue });
      }}
    />
  );
}
