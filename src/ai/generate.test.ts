import { describe, expect, it } from 'vitest';
import { topicSetToExercises } from './generate';
import { seeded } from '../lib/rng';
import { BUILTIN_TEXTS } from '../data/texts';
import { textSession, textWords } from '../exercises/session';
import { getProgress } from '../lib/progress';
import { cardsEx } from '../exercises/vocab';

const SET = {
  fill: [
    { sentence: 'Am Abend ___ ich einen Kuchen.', answer: 'backe', hint_ru: 'печь', wrong: ['backt', 'backst'] },
    { sentence: 'Du ___ nach Berlin.', answer: 'fährst', hint_ru: 'ехать', wrong: ['fahrst', 'fährt'] },
    { sentence: 'Kein Gap hier.', answer: 'x', hint_ru: '', wrong: [] },
    { sentence: 'Zwei ___ Gaps ___ hier.', answer: 'x', hint_ru: '', wrong: [] },
    { sentence: 'Wir ___ Fußball.', answer: 'spielen', hint_ru: 'играть', wrong: ['spielt'] },
    { sentence: 'Er ___ ein Buch.', answer: 'liest', hint_ru: 'читать', wrong: ['lest'] },
  ],
  choice: [
    { sentence: 'Ich fahre mit ___ Bus.', options: ['dem', 'den', 'der'], answer: 'dem', explanation_ru: 'mit + Dativ' },
    { sentence: 'Answer missing ___.', options: ['a', 'b'], answer: 'c', explanation_ru: '' },
  ],
  order: [
    { chunks: ['Am Abend', 'habe', 'ich', 'einen Kuchen', 'gebacken'], punctuation: '.' as const, translation_ru: 'Вечером я испёк торт.' },
    { chunks: ['zu', 'kurz'], punctuation: '.' as const, translation_ru: '' },
  ],
  write: [{ cues: ['ich', 'heute', 'Deutsch lernen'], task_ru: 'Präsens', answers: ['Ich lerne heute Deutsch.', 'Heute lerne ich Deutsch.'] }],
  match: [
    { left: 'warten', right: 'auf' },
    { left: 'denken', right: 'an' },
    { left: 'träumen', right: 'von' },
    { left: 'träumen', right: 'mit' },
  ],
};

describe('Claude output conversion', () => {
  const exs = topicSetToExercises(SET, seeded(1));
  it('drops malformed items and keeps valid ones', () => {
    const types = exs.map((e) => e.type);
    // 2 of 6 gaps are malformed → the 4 valid ones all go to the word bank, none left for typing
    expect(types).toEqual(['bank', 'choice', 'order', 'write', 'match']);
    const bank = exs[0] as Extract<(typeof exs)[number], { type: 'bank' }>;
    expect(bank.items.length).toBe(4);
    expect(bank.bank.length).toBe(8);
    const choice = exs[1] as Extract<(typeof exs)[number], { type: 'choice' }>;
    expect(choice.items.length).toBe(1);
    expect(choice.items[0].options[choice.items[0].answer]).toBe('dem');
    const order = exs[2] as Extract<(typeof exs)[number], { type: 'order' }>;
    expect(order.item.answers[0].map((k) => order.item.chunks[k]).join(' ')).toBe('Am Abend habe ich einen Kuchen gebacken');
    expect(order.item.fixedFirst).toBe(0);
    const match = exs[4] as Extract<(typeof exs)[number], { type: 'match' }>;
    expect(match.pairs.length).toBe(3);
  });
});

describe('reading & vocabulary sessions', () => {
  it('every built-in text yields questions and word practice', () => {
    for (const t of BUILTIN_TEXTS) {
      const words = textWords(t);
      expect(words.length, t.id).toBeGreaterThan(8);
      const session = textSession(t, getProgress(), seeded(3));
      expect(session.exercises.map((e) => e.type), t.id).toEqual(['choice', 'cards', 'fill']);
      const cards = session.exercises[1] as Extract<(typeof session.exercises)[number], { type: 'cards' }>;
      for (const c of cards.items) {
        expect(new Set(c.options).size, `${t.id}: ${c.prompt}`).toBe(4);
        expect(c.answer).toBeGreaterThanOrEqual(0);
      }
    }
  });


  it('card distractors never repeat the right meaning', () => {
    const ex = cardsEx([{ lemma: 'der Tisch', pos: 'noun', ru: 'стол', en: 'table' }], seeded(5));
    if (ex.type !== 'cards') throw new Error();
    expect(ex.items[0].options.filter((o) => o === 'стол').length).toBe(1);
  });
});
