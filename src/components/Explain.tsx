import type { ReactNode } from 'react';
import s from './Explain.module.css';

/** Renders **bold** segments as highlighted German. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') ? (
          <mark key={i} className={s.mark}>
            {p.slice(2, -2)}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function H({ children }: { children: ReactNode }) {
  return <h3 className={s.h}>{children}</h3>;
}

export function P({ children }: { children: ReactNode }) {
  return <p className={s.p}>{children}</p>;
}

export function Ex({ de, ru, en }: { de: string; ru?: string; en?: string }) {
  return (
    <div className={s.ex}>
      <div className={s.de} lang="de">
        <Rich text={de} />
      </div>
      {(ru || en) && (
        <div className={s.tr}>
          {ru}
          {ru && en ? ' · ' : ''}
          {en && <span className={s.en}>{en}</span>}
        </div>
      )}
    </div>
  );
}

export function Tbl({ head, rows, caption }: { head: string[]; rows: string[][]; caption?: string }) {
  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} lang="de">
                  <Rich text={c} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Sentence-position scheme: columns are fields, each row a sentence. */
export function Scheme({ cols, rows }: { cols: string[]; rows: string[][] }) {
  return (
    <div className={s.tableWrap}>
      <table className={`${s.table} ${s.scheme}`}>
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} lang="de" className={s[`col${j}`]}>
                  <Rich text={c} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Tip({ children, kind = 'tip' }: { children: ReactNode; kind?: 'tip' | 'warn' | 'en' }) {
  const icon = kind === 'warn' ? '⚠️' : kind === 'en' ? '🇬🇧' : '💡';
  return (
    <div className={`${s.tip} ${s[kind]}`}>
      <span className={s.icon} aria-hidden>
        {icon}
      </span>
      <div>{children}</div>
    </div>
  );
}

export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className={s.list}>
      {items.map((it, i) => (
        <li key={i}>{typeof it === 'string' ? <Rich text={it} /> : it}</li>
      ))}
    </ul>
  );
}
