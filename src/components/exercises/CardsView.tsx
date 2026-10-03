import { useEffect, useRef, useState } from 'react';
import { Frame } from './Frame';
import type { ViewProps } from './TextViews';
import s from './ex.module.css';

/** One word at a time, four cards with meanings. Correct → next automatically; wrong → shows the right card. */
export function CardsView({ ex, onDone }: ViewProps<'cards'>) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const timer = useRef<number | undefined>(undefined);
  const done = results.length === ex.items.length;
  const item = ex.items[Math.min(i, ex.items.length - 1)];

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const next = () => {
    setPicked(null);
    setI((k) => k + 1);
  };

  const pick = (k: number) => {
    if (picked !== null || done) return;
    setPicked(k);
    const ok = k === item.answer;
    setResults((r) => [...r, ok]);
    if (ok && i < ex.items.length - 1) timer.current = window.setTimeout(next, 650);
  };

  const correct = results.filter(Boolean).length;
  const showNext = picked !== null && picked !== item.answer && i < ex.items.length - 1;

  return (
    <Frame
      title={ex.title}
      instruction={ex.instruction}
      checked={done}
      canCheck={false}
      hideCheck
      onCheck={() => undefined}
      onNext={() =>
        onDone({
          correct,
          total: ex.items.length,
          srs: ex.items.flatMap((it, k) => (it.srs ? [{ key: it.srs, ok: results[k] }] : [])),
          mistakes: ex.items.filter((_, k) => !results[k]).map((it) => `${it.prompt} — ${it.options[it.answer]}`),
        })
      }
      score={done ? { correct, total: ex.items.length } : undefined}
    >
      <div className={s.cardDots} aria-hidden>
        {ex.items.map((_, k) => (
          <span key={k} className={`${s.cardDot} ${k < results.length ? (results[k] ? s.dotOk : s.dotBad) : k === i ? s.dotNow : ''}`} />
        ))}
      </div>
      <div className={s.cardPrompt} lang={item.promptLang ?? 'de'}>
        {item.prompt}
        {item.sub && <span className={s.cardSub}>{item.sub}</span>}
      </div>
      <div className={s.cardGrid}>
        {item.options.map((o, k) => {
          const st = picked === null ? '' : k === item.answer ? s.optOk : k === picked ? s.optBad : s.optDim;
          return (
            <button key={k} type="button" lang={item.optionsLang ?? 'ru'} className={`${s.cardOpt} ${st}`} onClick={() => pick(k)}>
              {o}
            </button>
          );
        })}
      </div>
      {showNext && (
        <button type="button" className={s.cardNext} onClick={next}>
          Следующее слово →
        </button>
      )}
    </Frame>
  );
}
