import { describe, expect, it } from 'vitest';
import { checkTileBuckets, checkTileOrder } from './check';

describe('duplicate tiles', () => {
  it('accepts exchanged identical tiles while preserving sentence order and length', () => {
    const chunks = ['ich', 'weiß,', 'dass', 'ich', 'komme'];
    expect(checkTileOrder(chunks, [3, 1, 2, 0, 4], [[0, 1, 2, 3, 4]])).toBe(true);
    expect(checkTileOrder(chunks, [3, 2, 1, 0, 4], [[0, 1, 2, 3, 4]])).toBe(false);
    expect(checkTileOrder(chunks, [0, 1, 2], [[0, 1, 2, 3, 4]])).toBe(false);
  });
  it('matches duplicate table tiles once each across columns', () => {
    const items = [{ text: 'ich', cat: 0 }, { text: 'ich', cat: 2 }, { text: 'komme', cat: 1 }];
    expect(checkTileBuckets(items, [2, 0, 1])).toEqual([true, true, true]);
    expect(checkTileBuckets(items, [0, 0, 1])).toEqual([true, false, true]);
    expect(checkTileBuckets(items, [null, 2, 0])).toEqual([false, true, false]);
  });
});
