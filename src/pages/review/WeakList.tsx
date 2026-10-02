import type { SrsItem } from '../../lib/progress';
import { MemoryDots } from '../common/MemoryDots';
import { Muted } from '../common/Muted';
import { describe } from './describe';
import s from './review.module.css';

/** Items with the most mistakes. */
export function WeakList({ items }: { items: [string, SrsItem][] }) {
  return (
    <>
      <h3 className={s.subTitle}>Чаще всего ошибки</h3>
      <ul className={s.weakList}>
        {items.map(([k, v]) => (
          <li key={k}>
            <span lang="de">{describe(k)}</span>
            <Muted>
              ✗ {v.wrong} · <MemoryDots box={v.box} />
            </Muted>
          </li>
        ))}
      </ul>
    </>
  );
}
