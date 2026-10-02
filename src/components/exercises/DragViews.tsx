import { useState } from 'react';
import type { ExerciseResult } from '../../exercises/types';
import { Frame, Solution } from './Frame';
import { DndProvider, DragTile, type DropInfo } from '../dnd';
import type { ViewProps } from './TextViews';
import s from './ex.module.css';

const capFirst = (t: string) => (t ? t[0].toUpperCase() + t.slice(1) : t);

export function OrderView({ ex, onDone }: ViewProps<'order'>) {
  const { item } = ex;
  const fixed = item.fixedFirst;
  const [placed, setPlaced] = useState<number[]>(() => (fixed !== undefined ? [fixed] : []));
  const [checked, setChecked] = useState(false);
  const inBank = item.chunks.map((_, i) => i).filter((i) => !placed.includes(i));
  const ok = item.answers.some((a) => a.length === placed.length && a.every((x, k) => x === placed[k]));
  const solution = item.solution ?? capFirst(item.answers[0].map((k) => item.chunks[k]).join(' ')) + item.punct;

  const insertAt = (chunk: number, index: number) => {
    const without = placed.filter((x) => x !== chunk);
    const min = fixed !== undefined ? 1 : 0;
    const at = Math.max(min, Math.min(index, without.length));
    setPlaced([...without.slice(0, at), chunk, ...without.slice(at)]);
  };
  const remove = (chunk: number) => chunk !== fixed && setPlaced(placed.filter((x) => x !== chunk));
  const onDrop = (chunk: number) => (d: DropInfo | null) => {
    if (checked || !d) return;
    if (d.zone === 'answer') insertAt(chunk, d.index ?? placed.length);
    else if (d.zone === 'bank') remove(chunk);
  };

  return (
    <Frame
      title={ex.title}
      instruction={ex.instruction}
      checked={checked}
      canCheck={inBank.length === 0}
      onCheck={() => setChecked(true)}
      onNext={() => onDone({ correct: ok ? 1 : 0, total: 1, srs: [], mistakes: ok ? [] : [solution] })}
      score={checked ? { correct: ok ? 1 : 0, total: 1 } : undefined}
    >
      {item.hint && <p className={s.hint}>{item.hint}</p>}
      <DndProvider>
        <div className={`${s.answerZone} ${checked ? (ok ? s.ok : s.bad) : ''}`} data-drop="answer">
          {placed.map((c, k) => (
            <DragTile
              key={c}
              id={`c${c}`}
              index={k}
              label={k === 0 ? capFirst(item.chunks[c]) : item.chunks[c]}
              onDrop={onDrop(c)}
              onTap={() => !checked && remove(c)}
              disabled={checked || c === fixed}
              className={c === fixed ? s.tileFixed : ''}
            />
          ))}
          {placed.length === 0 && <span className={s.placeholder}>Нажимайте на слова или перетаскивайте их сюда</span>}
          {placed.length > 0 && <span className={s.punct}>{item.punct}</span>}
        </div>
        {!checked && (
          <div className={s.bank} data-drop="bank">
            {inBank.map((c) => (
              <DragTile key={c} id={`c${c}`} label={item.chunks[c]} onDrop={onDrop(c)} onTap={() => insertAt(c, placed.length)} />
            ))}
          </div>
        )}
      </DndProvider>
      {checked && !ok && <Solution>{solution}</Solution>}
    </Frame>
  );
}

// ---------------------------------------------------------------------------

interface BucketProps {
  buckets: string[];
  items: { text: string; cat: number }[];
  checked: boolean;
  where: (number | null)[];
  setWhere: (w: (number | null)[]) => void;
}

function Buckets({ buckets, items, checked, where, setWhere }: BucketProps) {
  const [sel, setSel] = useState<number | null>(null);
  const put = (item: number, bucket: number | null) => {
    setWhere(where.map((w, i) => (i === item ? bucket : w)));
    setSel(null);
  };
  const onDrop = (item: number) => (d: DropInfo | null) => {
    if (checked || !d) return;
    if (d.zone.startsWith('b-')) put(item, Number(d.zone.slice(2)));
    else if (d.zone === 'bank') put(item, null);
  };
  const free = items.map((_, i) => i).filter((i) => where[i] === null);

  return (
    <DndProvider>
      {!checked && free.length > 0 && (
        <div className={s.bankTop} data-drop="bank">
          {free.map((i) => (
            <DragTile key={i} id={`i${i}`} label={items[i].text} onDrop={onDrop(i)} onTap={() => setSel(sel === i ? null : i)} className={sel === i ? s.tileSel : ''} />
          ))}
        </div>
      )}
      {!checked && free.length > 0 && <p className={s.hint}>Нажмите на элемент, затем на нужную колонку — или перетащите.</p>}
      <div className={s.buckets}>
        {buckets.map((b, bi) => (
          <div
            key={b}
            className={`${s.bucket} ${sel !== null ? s.bucketTarget : ''}`}
            data-drop={`b-${bi}`}
            onClick={(e) => {
              if ((e.target as HTMLElement).closest('button')) return;
              if (sel !== null && !checked) put(sel, bi);
            }}
          >
            <div className={s.bucketLabel}>{b}</div>
            <div className={s.bucketItems}>
              {items.map((it, i) =>
                where[i] === bi ? (
                  <DragTile
                    key={i}
                    id={`i${i}`}
                    label={it.text}
                    onDrop={onDrop(i)}
                    onTap={() => !checked && put(i, null)}
                    disabled={checked}
                    className={checked ? (it.cat === bi ? s.ok : s.bad) : ''}
                  />
                ) : null,
              )}
            </div>
          </div>
        ))}
      </div>
      {checked && items.some((it, i) => where[i] !== it.cat) && (
        <Solution>
          {items
            .filter((it, i) => where[i] !== it.cat)
            .map((it) => `${it.text} → ${buckets[it.cat]}`)
            .join('; ')}
        </Solution>
      )}
    </DndProvider>
  );
}

export function TableView({ ex, onDone }: ViewProps<'table'>) {
  const items = ex.item.chunks.map((c) => ({ text: c.text, cat: c.col }));
  const [where, setWhere] = useState<(number | null)[]>(() => items.map(() => null));
  const [checked, setChecked] = useState(false);
  const correct = items.filter((it, i) => where[i] === it.cat).length;
  return (
    <Frame
      title={ex.title}
      instruction={ex.instruction}
      checked={checked}
      canCheck={where.every((w) => w !== null)}
      onCheck={() => setChecked(true)}
      onNext={() => onDone(result(correct, items.length, correct === items.length ? [] : [ex.item.hint ?? '']))}
      score={checked ? { correct, total: items.length } : undefined}
    >
      {ex.item.hint && (
        <p className={s.tableSentence} lang="de">
          {ex.item.hint}
        </p>
      )}
      <Buckets buckets={ex.columns} items={items} checked={checked} where={where} setWhere={setWhere} />
    </Frame>
  );
}

export function SortView({ ex, onDone }: ViewProps<'sort'>) {
  const [where, setWhere] = useState<(number | null)[]>(() => ex.items.map(() => null));
  const [checked, setChecked] = useState(false);
  const correct = ex.items.filter((it, i) => where[i] === it.cat).length;
  return (
    <Frame
      title={ex.title}
      instruction={ex.instruction}
      checked={checked}
      canCheck={where.every((w) => w !== null)}
      onCheck={() => setChecked(true)}
      onNext={() =>
        onDone({
          correct,
          total: ex.items.length,
          srs: ex.items.flatMap((it, i) => (it.srs ? [{ key: it.srs, ok: where[i] === it.cat }] : [])),
          mistakes: ex.items.filter((it, i) => where[i] !== it.cat).map((it) => `${it.text} → ${ex.categories[it.cat]}`),
        })
      }
      score={checked ? { correct, total: ex.items.length } : undefined}
    >
      <Buckets buckets={ex.categories} items={ex.items} checked={checked} where={where} setWhere={setWhere} />
    </Frame>
  );
}

function result(correct: number, total: number, mistakes: string[]): ExerciseResult {
  return { correct, total, srs: [], mistakes: mistakes.filter(Boolean) };
}
