import { describe, expect, it } from 'vitest';
import { exportProgress, importProgress } from './progress';
import { addUserText, deleteUserText, findText, getUserTexts } from './userTexts';
import type { ReadingText } from '../data/texts';

const TEXT: ReadingText = {
  id: 'gen-test-1',
  theme: 'custom',
  level: 'A1',
  title: 'Oktoberfest',
  paragraphs: ['Das Oktoberfest ist in München.'],
  glossary: { Oktoberfest: { lemma: 'das Oktoberfest', pos: 'noun', ru: 'Октоберфест', en: 'Oktoberfest' } },
  questions: [{ q: 'Wo ist das Oktoberfest?', options: ['In München.', 'In Berlin.'], answer: 0 }],
  generated: true,
  createdAt: 1,
};

describe('export / import', () => {
  it('round-trips generated texts without duplicating them', () => {
    addUserText(TEXT);
    const file = exportProgress();
    expect(JSON.parse(file).texts.map((t: ReadingText) => t.id)).toContain(TEXT.id);
    expect(file).not.toMatch(/sk-ant|AIza/); // AI keys are never exported

    deleteUserText(TEXT.id);
    expect(findText(TEXT.id)).toBeUndefined();

    expect(importProgress(file).texts).toBe(1);
    expect(findText(TEXT.id)?.glossary.Oktoberfest.lemma).toBe('das Oktoberfest');

    expect(importProgress(file).texts).toBe(0);
    expect(getUserTexts().filter((t) => t.id === TEXT.id).length).toBe(1);
  });

  it('accepts old export files without texts and ignores malformed texts', () => {
    const old = JSON.stringify({ app: 'augapfel', progress: { topics: {}, srs: {} } });
    expect(importProgress(old).texts).toBe(0);
    const bad = JSON.stringify({ app: 'augapfel', progress: {}, texts: [{ id: 1 }, { id: 'x', title: 'T', paragraphs: [3] }] });
    expect(importProgress(bad).texts).toBe(0);
  });
});
