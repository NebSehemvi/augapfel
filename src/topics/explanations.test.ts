import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TOPICS } from './index';
import { EXPLAIN } from './explanations';

describe('topic explanations', () => {
  it('has exactly one explanation for every topic', () => {
    expect(Object.keys(EXPLAIN).sort()).toEqual(TOPICS.map((topic) => topic.id).sort());
  });

  it.each(TOPICS)('renders $id without throwing', ({ id }) => {
    const Explanation = EXPLAIN[id];
    expect(Explanation).toBeTypeOf('function');
    expect(() => renderToString(createElement(Explanation))).not.toThrow();
  });
});
