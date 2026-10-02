import s from './common.module.css';

/** Spaced-repetition box as dots (●●●) — how well an item is learned. */
export function MemoryDots({ box }: { box: number }) {
  return (
    <span className={s.memory} title="Уровень запоминания">
      {'●'.repeat(Math.min(box, 6)) || '○'}
    </span>
  );
}
