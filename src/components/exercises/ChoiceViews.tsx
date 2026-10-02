import { useMemo, useState, type ReactNode } from 'react';
import type { ExerciseResult, Seg } from '../../exercises/types';
import { shuffle } from '../../lib/rng';
import { Frame, Note, Solution } from './Frame';
import { DndProvider, DragTile, type DropInfo } from '../dnd';
import type { ViewProps } from './TextViews';
import { fillParts } from '../../lib/format';
import s from './ex.module.css';

export function ChoiceView({ ex, onDone }: ViewProps<'choice'>) {
  const [sel, setSel] = useState<(number | null)[]>(() => ex.items.map(() => null));
  const [checked, setChecked] = useState(false);
  const correct = ex.items.filter((it, i) => sel[i] === it.answer).length;
  const result = (): ExerciseResult => ({
    correct,
    total: ex.items.length,
    srs: ex.items.flatMap((it, i) => (it.srs ? [{ key: it.srs, ok: sel[i] === it.answer }] : [])),
    mistakes: ex.items
      .filter((it, i) => sel[i] !== it.answer)
      .map((it) => (it.parts ? fillParts(it.parts, [it.options[it.answer]]) : `${it.question}: ${it.options[it.answer]}`)),
  });
  const list = ex.layout === 'list';

  return (
    <Frame
      title={ex.title}
      instruction={ex.instruction}
      checked={checked}
      canCheck={sel.some((x) => x !== null)}
      onCheck={() => setChecked(true)}
      onNext={() => onDone(result())}
      score={checked ? { correct, total: ex.items.length } : undefined}
    >
      <ol className={s.items}>
        {ex.items.map((it, i) => {
          const chosen = sel[i];
          return (
            <li key={i} className={s.item}>
              {it.parts ? (
                <div className={s.sentence} lang="de">
                  <GapText parts={it.parts} fill={chosen !== null ? it.options[chosen] : null} state={checked ? (chosen === it.answer ? 'ok' : 'bad') : null} />
                  {it.hint && <span className={s.hint}> ({it.hint})</span>}
                </div>
              ) : (
                <div className={s.question}>{it.question}</div>
              )}
              <div className={list ? s.optionsList : s.options}>
                {it.options.map((o, k) => {
                  const st = checked ? (k === it.answer ? s.optOk : k === chosen ? s.optBad : s.optDim) : k === chosen ? s.optOn : '';
                  return (
                    <button
                      key={k}
                      type="button"
                      lang="de"
                      className={`${list ? s.optionWide : s.option} ${st}`}
                      onClick={() => !checked && setSel((p) => p.map((x, j) => (j === i ? k : x)))}
                      aria-pressed={k === chosen}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
              {checked && it.explain && <Note>{it.explain}</Note>}
            </li>
          );
        })}
      </ol>
    </Frame>
  );
}

function GapText({ parts, fill, state }: { parts: Seg[]; fill: string | null; state: 'ok' | 'bad' | null }) {
  return (
    <>
      {parts.map((p, k) =>
        typeof p === 'number' ? (
          <span key={k} className={`${s.gap} ${fill ? s.gapFilled : ''} ${state ? s[state] : ''}`}>
            {fill ?? '  '}
          </span>
        ) : (
          <span key={k}>{p}</span>
        ),
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Slots + bank (word bank exercise and matching)

interface SlotBankProps {
  slots: { render: (filled: ReactNode) => ReactNode }[];
  tiles: string[];
  isCorrect: (slot: number, tile: string) => boolean;
  checked: boolean;
  assign: (number | null)[];
  setAssign: (a: (number | null)[]) => void;
  layout: 'inline' | 'stack';
}

function SlotBank({ slots, tiles, isCorrect, checked, assign, setAssign, layout }: SlotBankProps) {
  const [selSlot, setSelSlot] = useState<number | null>(null);
  const [selTile, setSelTile] = useState<number | null>(null);
  const used = new Set(assign.filter((x): x is number => x !== null));

  const place = (slot: number, tile: number) => {
    const next = assign.map((t) => (t === tile ? null : t));
    next[slot] = tile;
    setAssign(next);
    setSelSlot(null);
    setSelTile(null);
  };
  const unplace = (slot: number) => setAssign(assign.map((t, i) => (i === slot ? null : t)));

  const tapTile = (tile: number) => {
    if (checked) return;
    const target = selSlot ?? assign.findIndex((t) => t === null);
    if (target >= 0 && target !== null) place(target, tile);
    else setSelTile(tile);
  };
  const tapSlot = (slot: number) => {
    if (checked) return;
    if (assign[slot] !== null) return unplace(slot);
    if (selTile !== null) place(slot, selTile);
    else setSelSlot(selSlot === slot ? null : slot);
  };
  const dropTile = (tile: number) => (d: DropInfo | null) => {
    if (checked || !d) return;
    if (d.zone.startsWith('slot-')) place(Number(d.zone.slice(5)), tile);
    else if (d.zone === 'bank') setAssign(assign.map((t) => (t === tile ? null : t)));
  };

  return (
    <DndProvider>
      <ol className={layout === 'stack' ? s.matchList : s.items}>
        {slots.map((slot, i) => {
          const t = assign[i];
          const state = checked ? (t !== null && isCorrect(i, tiles[t]) ? s.ok : s.bad) : '';
          const filled =
            t !== null ? (
              <DragTile id={`t${t}`} label={tiles[t]} onDrop={dropTile(t)} onTap={() => tapSlot(i)} className={`${s.slotTile} ${state}`} disabled={checked} />
            ) : (
              <span className={`${s.slotEmpty} ${selSlot === i ? s.slotSel : ''} ${state}`}>{'   '}</span>
            );
          return (
            <li key={i} className={s.item}>
              <div
                className={s.slotWrap}
                data-drop={`slot-${i}`}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button')) return;
                  tapSlot(i);
                }}
              >
                {slot.render(filled)}
              </div>
            </li>
          );
        })}
      </ol>
      {!checked && (
        <div className={s.bank} data-drop="bank">
          {tiles.map((t, k) =>
            used.has(k) ? null : (
              <DragTile key={k} id={`t${k}`} label={t} onDrop={dropTile(k)} onTap={() => tapTile(k)} className={selTile === k ? s.tileSel : ''} />
            ),
          )}
          {used.size === tiles.length && <span className={s.bankEmpty}>Все слова использованы</span>}
        </div>
      )}
    </DndProvider>
  );
}

export function BankView({ ex, onDone }: ViewProps<'bank'>) {
  const [assign, setAssign] = useState<(number | null)[]>(() => ex.items.map(() => null));
  const [checked, setChecked] = useState(false);
  const ok = (i: number) => assign[i] !== null && ex.items[i].answers.includes(ex.bank[assign[i]!]);
  const correct = ex.items.filter((_, i) => ok(i)).length;
  return (
    <Frame
      title={ex.title}
      instruction={ex.instruction}
      checked={checked}
      canCheck={assign.some((x) => x !== null)}
      onCheck={() => setChecked(true)}
      onNext={() =>
        onDone({
          correct,
          total: ex.items.length,
          srs: ex.items.flatMap((it, i) => (it.srs ? [{ key: it.srs, ok: ok(i) }] : [])),
          mistakes: ex.items.filter((_, i) => !ok(i)).map((it) => fillParts(it.parts, [it.answers[0]])),
        })
      }
      score={checked ? { correct, total: ex.items.length } : undefined}
    >
      <SlotBank
        layout="inline"
        tiles={ex.bank}
        assign={assign}
        setAssign={setAssign}
        checked={checked}
        isCorrect={(i, t) => ex.items[i].answers.includes(t)}
        slots={ex.items.map((it, i) => ({
          render: (filled) => (
            <>
              <div className={s.sentence} lang="de">
                {it.parts.map((p, k) => (typeof p === 'number' ? <span key={k}>{filled}</span> : <span key={k}>{p}</span>))}
                {it.hint && <span className={s.hint}> ({it.hint})</span>}
              </div>
              {checked && !ok(i) && <Solution>{fillParts(it.parts, [it.answers[0]])}</Solution>}
            </>
          ),
        }))}
      />
    </Frame>
  );
}

export function MatchView({ ex, onDone }: ViewProps<'match'>) {
  const tiles = useMemo(() => shuffle(Math.random, ex.pairs.map((p) => p[1])), [ex]);
  const [assign, setAssign] = useState<(number | null)[]>(() => ex.pairs.map(() => null));
  const [checked, setChecked] = useState(false);
  const ok = (i: number) => assign[i] !== null && tiles[assign[i]!] === ex.pairs[i][1];
  const correct = ex.pairs.filter((_, i) => ok(i)).length;
  return (
    <Frame
      title={ex.title}
      instruction={ex.instruction + ' Перетащите ответ к вопросу или нажмите на него.'}
      checked={checked}
      canCheck={assign.some((x) => x !== null)}
      onCheck={() => setChecked(true)}
      onNext={() =>
        onDone({
          correct,
          total: ex.pairs.length,
          srs: [],
          mistakes: ex.pairs.filter((_, i) => !ok(i)).map((p) => `${p[0]} — ${p[1]}`),
        })
      }
      score={checked ? { correct, total: ex.pairs.length } : undefined}
    >
      <SlotBank
        layout="stack"
        tiles={tiles}
        assign={assign}
        setAssign={setAssign}
        checked={checked}
        isCorrect={(i, t) => ex.pairs[i][1] === t}
        slots={ex.pairs.map((p, i) => ({
          render: (filled) => (
            <div className={s.matchRow}>
              <div className={s.matchLeft} lang="de">
                {p[0]}
              </div>
              <div className={s.matchRight}>{filled}</div>
              {checked && !ok(i) && <Solution>{p[1]}</Solution>}
            </div>
          ),
        }))}
      />
    </Frame>
  );
}
