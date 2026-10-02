import { useState } from 'react';
import type { Exercise, ExerciseResult } from '../../exercises/types';
import { fillParts } from '../../lib/format';
import { checkText, diffWords, type CheckResult } from '../../lib/check';
import { Frame, Note, Solution } from './Frame';
import { UInput, UTextarea } from './inputs';
import s from './ex.module.css';

export interface ViewProps<T extends Exercise['type']> {
  ex: Extract<Exercise, { type: T }>;
  lenient: boolean;
  onDone: (r: ExerciseResult) => void;
}

const verdictState = (r?: CheckResult) => (r ? (r.verdict === 'ok' ? 'ok' : r.verdict === 'almost' ? 'almost' : 'bad') : null);

// ---------------------------------------------------------------------------

export function FillView({ ex, lenient, onDone }: ViewProps<'fill'>) {
  const [values, setValues] = useState<string[][]>(() => ex.items.map((it) => it.answers.map(() => '')));
  const [results, setResults] = useState<CheckResult[][] | null>(null);

  const setVal = (i: number, g: number, v: string) =>
    setValues((prev) => prev.map((row, k) => (k === i ? row.map((x, j) => (j === g ? v : x)) : row)));

  const check = () => {
    setResults(ex.items.map((it, i) => it.answers.map((acc, g) => checkText(values[i][g], acc, { lenientUmlauts: lenient }))));
  };

  const result = (): ExerciseResult => {
    const r = results!;
    let correct = 0;
    let total = 0;
    const srs: ExerciseResult['srs'] = [];
    const mistakes: string[] = [];
    ex.items.forEach((it, i) => {
      let rowOk = true;
      it.answers.forEach((_, g) => {
        total++;
        const ok = r[i][g].verdict === 'ok';
        if (ok) correct++;
        else rowOk = false;
        const key = it.srs?.[g];
        if (key) srs.push({ key, ok });
      });
      if (!rowOk) mistakes.push(fillParts(it.parts, it.answers.map((a) => a[0])));
    });
    return { correct, total, srs, mistakes };
  };

  const score = results ? { correct: results.flat().filter((x) => x.verdict === 'ok').length, total: results.flat().length } : undefined;

  return (
    <Frame
      title={ex.title}
      instruction={ex.instruction}
      checked={!!results}
      canCheck={values.flat().some((v) => v.trim())}
      onCheck={check}
      onNext={() => onDone(result())}
      score={score}
      umlauts
    >
      <ol className={s.items}>
        {ex.items.map((it, i) => {
          const width = (g: number) => Math.max(5, ...it.answers[g].map((a) => a.length)) + 2;
          const wrong = results?.[i].some((r) => r.verdict !== 'ok');
          return (
            <li key={i} className={s.item}>
              <div className={s.sentence} lang="de">
                {it.parts.map((p, k) =>
                  typeof p === 'number' ? (
                    <UInput
                      key={k}
                      value={values[i][p]}
                      onValue={(v) => setVal(i, p, v)}
                      state={verdictState(results?.[i][p])}
                      widthCh={width(p)}
                      readOnly={!!results}
                      aria-label={`пропуск ${p + 1}`}
                    />
                  ) : (
                    <span key={k}>{p}</span>
                  ),
                )}
                {it.hint && (
                  <span className={s.hint}>
                    {' '}
                    ({it.hint}
                    {it.firstLetter && !results ? `; ${it.answers.map((a) => a[0][0] + '…').join(' … ')}` : ''})
                  </span>
                )}
              </div>
              {wrong && <Solution>{fillParts(it.parts, it.answers.map((a) => a[0]))}</Solution>}
              {results?.[i].map((r, g) => r.note && <Note key={g}>{r.note}</Note>)}
            </li>
          );
        })}
      </ol>
    </Frame>
  );
}

// ---------------------------------------------------------------------------

export function ConjView({ ex, lenient, onDone }: ViewProps<'conj'>) {
  const [values, setValues] = useState<string[]>(() => ex.rows.map((r) => (r.given ? r.answers[0] : '')));
  const [results, setResults] = useState<CheckResult[] | null>(null);
  const check = () => setResults(ex.rows.map((r, i) => checkText(values[i], r.answers, { lenientUmlauts: lenient })));
  const open = ex.rows.map((r, i) => (r.given ? -1 : i)).filter((i) => i >= 0);
  const score = results ? { correct: open.filter((i) => results[i].verdict === 'ok').length, total: open.length } : undefined;
  const result = (): ExerciseResult => {
    const ok = score!.correct === score!.total;
    return {
      ...score!,
      srs: ex.srs ? [{ key: ex.srs, ok }] : [],
      mistakes: open.filter((i) => results![i].verdict !== 'ok').map((i) => `${ex.rows[i].label} ${ex.rows[i].answers[0]} (${ex.verb})`),
    };
  };
  return (
    <Frame
      title={ex.title}
      instruction={ex.instruction}
      checked={!!results}
      canCheck={open.some((i) => values[i].trim())}
      onCheck={check}
      onNext={() => onDone(result())}
      score={score}
      umlauts
    >
      <div className={s.conjHead} lang="de">
        <b>{ex.verb}</b> · {ex.tense}
      </div>
      <div className={s.conj}>
        {ex.rows.map((r, i) => (
          <label key={r.label} className={s.conjRow}>
            <span className={s.conjLabel} lang="de">
              {r.label}
            </span>
            <span className={s.conjCell}>
              <UInput
                value={values[i]}
                onValue={(v) => setValues((prev) => prev.map((x, k) => (k === i ? v : x)))}
                readOnly={r.given || !!results}
                state={r.given ? null : verdictState(results?.[i])}
                className={r.given ? s.given : ''}
              />
              {results && !r.given && results[i].verdict !== 'ok' && <Solution>{r.answers.join(' / ')}</Solution>}
            </span>
          </label>
        ))}
      </div>
    </Frame>
  );
}

// ---------------------------------------------------------------------------

export function FormsView({ ex, lenient, onDone }: ViewProps<'forms'>) {
  const [values, setValues] = useState<string[][]>(() => ex.items.map((it) => it.fields.map(() => '')));
  const [results, setResults] = useState<CheckResult[][] | null>(null);
  const check = () =>
    setResults(ex.items.map((it, i) => it.fields.map((f, k) => checkText(values[i][k], f.answers, { lenientUmlauts: lenient }))));
  const flat = results?.flat() ?? [];
  const score = results ? { correct: flat.filter((r) => r.verdict === 'ok').length, total: flat.length } : undefined;
  const result = (): ExerciseResult => {
    const srs: ExerciseResult['srs'] = [];
    const mistakes: string[] = [];
    ex.items.forEach((it, i) =>
      it.fields.forEach((f, k) => {
        const ok = results![i][k].verdict === 'ok';
        if (f.srs) srs.push({ key: f.srs, ok });
        if (!ok) mistakes.push(`${it.prompt} → ${f.label}: ${f.answers[0]}`);
      }),
    );
    return { ...score!, srs, mistakes };
  };
  const set = (i: number, k: number, v: string) => setValues((prev) => prev.map((row, a) => (a === i ? row.map((x, b) => (b === k ? v : x)) : row)));

  return (
    <Frame
      title={ex.title}
      instruction={ex.instruction}
      checked={!!results}
      canCheck={values.flat().some((v) => v.trim())}
      onCheck={check}
      onNext={() => onDone(result())}
      score={score}
      umlauts
    >
      <div className={s.forms}>
        {ex.items.map((it, i) => (
          <div key={it.prompt} className={s.formCard}>
            <div className={s.formPrompt} lang="de">
              {it.prompt}
              {it.sub && <span className={s.formSub}>{it.sub}</span>}
            </div>
            {it.fields.map((f, k) => {
              const isAux = f.label === 'haben / sein';
              const r = results?.[i][k];
              return (
                <div key={f.label} className={s.formField}>
                  <span className={s.formLabel}>{f.label}</span>
                  {isAux ? (
                    <div className={s.segment} role="radiogroup">
                      {['haben', 'sein'].map((opt) => {
                        const selected = values[i][k] === opt;
                        const st = r && selected ? (r.verdict === 'ok' ? s.ok : s.bad) : '';
                        return (
                          <button
                            key={opt}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            className={`${s.segBtn} ${selected ? s.segOn : ''} ${st}`}
                            onClick={() => !results && set(i, k, opt)}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <UInput value={values[i][k]} onValue={(v) => set(i, k, v)} state={verdictState(r)} readOnly={!!results} />
                  )}
                  {r && r.verdict !== 'ok' && <Solution>{f.answers.join(' / ')}</Solution>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Frame>
  );
}

// ---------------------------------------------------------------------------

export function WriteView({ ex, lenient, onDone }: ViewProps<'write'>) {
  const [value, setValue] = useState('');
  const [res, setRes] = useState<CheckResult | null>(null);
  const { item } = ex;
  const score = res ? { correct: res.verdict === 'ok' ? 1 : 0, total: 1 } : undefined;
  return (
    <Frame
      title={ex.title}
      instruction={ex.instruction}
      checked={!!res}
      canCheck={value.trim().length > 2}
      onCheck={() => setRes(checkText(value, item.answers, { lenientUmlauts: lenient }))}
      onNext={() => onDone({ ...score!, srs: [], mistakes: res!.verdict === 'ok' ? [] : [item.answers[0]] })}
      score={score}
      umlauts
    >
      <div className={s.cues} lang="de">
        {item.cues.map((c, i) => (
          <span key={i} className={s.cue}>
            {c}
          </span>
        ))}
      </div>
      <p className={s.task}>{item.task}</p>
      {item.hint && <p className={s.hint}>{item.hint}</p>}
      <UTextarea value={value} onValue={setValue} state={verdictState(res ?? undefined)} disabled={!!res} />
      {res && res.verdict !== 'ok' && (
        <Solution>
          {diffWords(value, res.expected).map((w, i) => (
            <span key={i} className={w.ok ? '' : s.diffBad}>
              {w.word}{' '}
            </span>
          ))}
        </Solution>
      )}
      {res?.note && <Note>{res.note}</Note>}
      {res && item.answers.length > 1 && (
        <Note>
          Тоже правильно: <span lang="de">{item.answers.filter((a) => a !== res.expected).slice(0, 2).join(' / ')}</span>
        </Note>
      )}
    </Frame>
  );
}
