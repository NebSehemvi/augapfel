import { z } from 'zod';

/** Keywords Gemini's `responseJsonSchema` understands (see @google/genai GenerationConfig docs). */
export const GEMINI_KEYWORDS = new Set([
  '$id', '$defs', '$ref', '$anchor', 'type', 'format', 'title', 'description', 'enum', 'items', 'prefixItems',
  'minItems', 'maxItems', 'minimum', 'maximum', 'anyOf', 'oneOf', 'properties', 'additionalProperties', 'required', 'propertyOrdering',
]);

/** Zod → JSON Schema restricted to the keywords Gemini accepts (unsupported keywords are dropped). */
export function geminiJsonSchema(schema: z.ZodType): unknown {
  const strip = (node: unknown, inProperties = false): unknown => {
    if (Array.isArray(node)) return node.map((n) => strip(n));
    if (!node || typeof node !== 'object') return node;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) {
      // inside "properties"/"$defs" the keys are field names, not keywords
      if (inProperties) out[k] = strip(v);
      else if (GEMINI_KEYWORDS.has(k)) out[k] = strip(v, k === 'properties' || k === '$defs');
    }
    return out;
  };
  return strip(z.toJSONSchema(schema));
}
