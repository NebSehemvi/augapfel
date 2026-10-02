import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { GEMINI_KEYWORDS, geminiJsonSchema } from './jsonSchema';
import { GenTextSchema, TopicSetSchema } from './prompts';

function keywords(node: unknown, inProps = false, acc = new Set<string>()): Set<string> {
  if (Array.isArray(node)) node.forEach((n) => keywords(n, false, acc));
  else if (node && typeof node === 'object')
    for (const [k, v] of Object.entries(node)) {
      if (!inProps) acc.add(k);
      keywords(v, !inProps && (k === 'properties' || k === '$defs'), acc);
    }
  return acc;
}

describe('Gemini JSON schema', () => {
  for (const [name, schema] of [['topic set', TopicSetSchema], ['text', GenTextSchema]] as const) {
    it(`${name} schema uses only supported keywords and keeps the structure`, () => {
      const js = geminiJsonSchema(schema) as { type: string; required: string[]; properties: Record<string, unknown> };
      for (const k of keywords(js)) expect(GEMINI_KEYWORDS.has(k), k).toBe(true);
      expect(js.type).toBe('object');
      expect(js.required.length).toBe(Object.keys(js.properties).length);
    });
  }
  it('keeps field names that look like keywords', () => {
    const js = geminiJsonSchema(z.object({ type: z.string(), format: z.string() })) as { properties: Record<string, unknown> };
    expect(Object.keys(js.properties)).toEqual(['type', 'format']);
  });
});
