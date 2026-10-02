import { useMemo, useState } from 'react';
import { Frame, Solution } from './Frame';
import type { ViewProps } from './TextViews';
import s from './ex.module.css';

const upper = (ch: string) => (ch === 'ß' ? 'ß' : ch.toUpperCase());

/** Letters of all sentences without spaces/punctuation + indices after which a word ends. */
function build(sentences: string[]) {
  const letters: string[] = [];
  const bounds = new Set<number>();
  for (const sen of sentences) {
    for (const word of sen.split(/\s+/)) {
      const ls = [...word].filter((c) => /\p{L}/u.test(c));
      if (!ls.length) continue;
      letters.push(...ls.map(upper));
      bounds.add(letters.length - 1);
    }
  }
  bounds.delete(letters.length - 1);
  return { letters, bounds };
}

export function SnakeView({ ex, onDone }: ViewProps<'snake'>) {
  const { letters, bounds } = useMemo(() => build(ex.sentences), [ex]);
  const [cuts, setCuts] = useState<Set<number>>(new Set());
  const [checked, setChecked] = useState(false);
  const ok = cuts.size === bounds.size && [...cuts].every((c) => bounds.has(c));
  const toggle = (i: number) => {
    if (checked || i === letters.length - 1) return;
    const next = new Set(cuts);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setCuts(next);
  };
  return (
    <Frame
      title={ex.title}
      instruction={ex.instruction}
      checked={checked}
      canCheck={cuts.size > 0}
      onCheck={() => setChecked(true)}
      onNext={() => onDone({ correct: ok ? 1 : 0, total: 1, srs: [], mistakes: ok ? [] : [ex.sentences.join(' ')] })}
      score={checked ? { correct: ok ? 1 : 0, total: 1 } : undefined}
    >
      <div className={s.snake} lang="de">
        {letters.map((l, i) => {
          const cut = cuts.has(i);
          const st = checked ? (cut && !bounds.has(i) ? s.cutBad : !cut && bounds.has(i) ? s.cutMissing : '') : '';
          return (
            <button key={i} type="button" className={`${s.letter} ${cut ? s.cut : ''} ${st}`} onClick={() => toggle(i)} aria-label={`буква ${l}`}>
              {l}
            </button>
          );
        })}
      </div>
      <p className={s.hint}>Нажмите на последнюю букву слова, чтобы отделить его. Нажмите ещё раз, чтобы убрать разделитель.</p>
      {checked && <Solution>{ex.sentences.join(' ')}</Solution>}
    </Frame>
  );
}
