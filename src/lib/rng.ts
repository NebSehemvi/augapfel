export type Rng = () => number;

export const defaultRng: Rng = Math.random;

/** Deterministic PRNG for tests (mulberry32). */
export function seeded(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function int(rng: Rng, max: number): number {
  return Math.floor(rng() * max);
}

export function pick<T>(rng: Rng, arr: readonly T[]): T {
  if (arr.length === 0) throw new Error('pick from empty array');
  return arr[int(rng, arr.length)];
}

export function shuffle<T>(rng: Rng, arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = int(rng, i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** n distinct elements (or fewer if arr is shorter). */
export function sample<T>(rng: Rng, arr: readonly T[], n: number): T[] {
  return shuffle(rng, arr).slice(0, n);
}

/** Shuffle that is guaranteed to differ from the input order (when possible). */
export function scramble<T>(rng: Rng, arr: readonly T[]): T[] {
  if (arr.length < 2) return arr.slice();
  for (let i = 0; i < 10; i++) {
    const s = shuffle(rng, arr);
    if (s.some((x, k) => x !== arr[k])) return s;
  }
  return arr.slice().reverse();
}

export function chance(rng: Rng, p: number): boolean {
  return rng() < p;
}
