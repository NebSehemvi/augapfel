import { describe, expect, it } from 'vitest';
import { BUILTIN_TEXTS } from '.';
import { lookupLocal, tokenize } from '../../lib/dictionary';
import { THEMES } from '../themes';

describe('reading texts', () => {
  it('have valid structure', () => {
    const ids = new Set<string>();
    for (const t of BUILTIN_TEXTS) {
      expect(ids.has(t.id), t.id).toBe(false);
      ids.add(t.id);
      expect(THEMES.some((th) => th.id === t.theme), t.id).toBe(true);
      expect(t.paragraphs.length, t.id).toBeGreaterThan(1);
      expect(t.questions.length, t.id).toBeGreaterThanOrEqual(3);
      for (const q of t.questions) expect(q.options[q.answer], `${t.id}: ${q.q}`).toBeTruthy();
    }
    for (const th of THEMES) expect(BUILTIN_TEXTS.filter((t) => t.theme === th.id).length, th.id).toBeGreaterThanOrEqual(3);
  });

  it('every word resolves offline (text glossary, app vocabulary or common words)', () => {
    const missing: Record<string, string[]> = {};
    for (const t of BUILTIN_TEXTS) {
      for (const p of t.paragraphs)
        for (const tok of tokenize(p)) {
          if (!tok.word) continue;
          if (!lookupLocal(tok.word, t.glossary)) (missing[t.id] ??= []).push(tok.word);
        }
    }
    const report = Object.entries(missing).map(([id, ws]) => `${id}: ${[...new Set(ws)].join(', ')}`);
    if (process.env.MISSING) console.log(report.join('\n'));
    expect(report).toEqual([]);
  });
});
