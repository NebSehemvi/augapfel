import { describe, expect, it } from 'vitest';
import { addWord, exportProgress, getProgress, importProgress, recordSrs, removeWord } from './progress';
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

describe('saved words', () => {
  it('old saved-word review keys become lexicon keys; never practised words become new again', () => {
    const old = JSON.stringify({
      app: 'augapfel',
      progress: {
        v: 1,
        words: { gehen: { lemma: 'gehen', pos: 'verb', ru: 'идти', addedAt: 1 }, laufen: { lemma: 'laufen', pos: 'verb', ru: 'бегать', addedAt: 2 } },
        srs: {
          'w|gehen|rec': { box: 3, due: 5, seen: 4, wrong: 1 },
          'w|gehen|prod': { box: 1, due: 6, seen: 2, wrong: 1 },
          'w|laufen|rec': { box: 0, due: 7, seen: 0, wrong: 0 },
        },
      },
    });
    importProgress(old);
    const srs = getProgress().srs;
    expect(srs['l|gehen|de-ru']).toEqual({ box: 3, due: 5, seen: 4, wrong: 1 });
    expect(srs['l|gehen|ru-de']?.box).toBe(1);
    expect(srs['l|laufen|de-ru']).toBeUndefined();
    expect(Object.keys(srs).some((k) => k.startsWith('w|'))).toBe(false);
  });

  it('removing a saved word keeps progress of lexicon words only', () => {
    addWord({ lemma: 'der Sohn', pos: 'noun', ru: 'сын' });
    addWord({ lemma: 'googeln', pos: 'verb', ru: 'гуглить' });
    recordSrs([{ key: 'l|der Sohn|de-ru', ok: true }, { key: 'l|googeln|de-ru', ok: true }], true);
    removeWord('der Sohn');
    removeWord('googeln');
    expect(getProgress().srs['l|der Sohn|de-ru']).toBeDefined();
    expect(getProgress().srs['l|googeln|de-ru']).toBeUndefined();
  });
});
