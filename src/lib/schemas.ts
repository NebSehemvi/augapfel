import { z } from 'zod';

/** Schemas for the export file. Unknown extra fields are ignored; missing optional fields are filled in by the stores. */

const num = z.number().finite();

const topicStat = z.object({ sessions: num, best: num, last: num, lastAt: num });
const srsItem = z.object({ box: num, due: num, seen: num, wrong: num });
const savedWord = z.object({
  lemma: z.string(),
  pos: z.string(),
  ru: z.string().optional(),
  en: z.string().optional(),
  pl: z.string().nullable().optional(),
  addedAt: num,
  source: z.string().optional(),
});
const settings = z
  .object({
    level: z.enum(['A1', 'A2']),
    includeRare: z.boolean(),
    lenientUmlauts: z.boolean(),
    genderColors: z.boolean(),
  })
  .partial();

/** Progress as stored/exported. Legacy files may lack any of the collections. */
export const progressSchema = z.object({
  v: z.literal(1).optional(),
  topics: z.record(z.string(), topicStat).optional(),
  srs: z.record(z.string(), srsItem).optional(),
  words: z.record(z.string(), savedWord).optional(),
  recentThemes: z.array(z.string()).optional(),
  days: z.array(z.string()).optional(),
  settings: settings.optional(),
});

const glossEntry = z.object({
  lemma: z.string(),
  pos: z.string().optional(),
  ru: z.string().optional(),
  en: z.string().optional(),
  pl: z.string().optional(),
  note: z.string().optional(),
});

const question = z.object({
  q: z.string(),
  options: z.array(z.string()),
  answer: z.number().int().min(0),
});

export const readingTextSchema = z
  .object({
    id: z.string().min(1),
    theme: z.string().optional(),
    level: z.enum(['A1', 'A2']).optional(),
    title: z.string(),
    source: z.string().optional(),
    sourceUrl: z.string().optional(),
    paragraphs: z.array(z.string()),
    glossary: z.record(z.string(), glossEntry).optional(),
    questions: z.array(question).optional(),
    generated: z.boolean().optional(),
    createdAt: num.optional(),
    fill: z
      .array(z.object({ sentence: z.string(), answer: z.string(), hint_ru: z.string(), wrong: z.array(z.string()) }))
      .optional(),
  })
  .refine((t) => (t.questions ?? []).every((q) => q.answer < q.options.length), { message: 'ответ на вопрос вне списка вариантов' });

export const userTextsSchema = z.array(readingTextSchema);

export const exportFileSchema = z.object({
  app: z.literal('augapfel'),
  exportedAt: z.string().optional(),
  progress: progressSchema,
  texts: userTextsSchema.optional(),
});

export type ExportFile = z.infer<typeof exportFileSchema>;

/** Parses and validates a whole export file. Throws an Error with a Russian message. */
export function parseExportFile(json: string): ExportFile {
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    throw new Error('Файл повреждён: это не JSON.');
  }
  if (typeof data !== 'object' || data === null || (data as { app?: unknown }).app !== 'augapfel' || !('progress' in data)) {
    throw new Error('Это не файл прогресса Augapfel.');
  }
  const r = exportFileSchema.safeParse(data);
  if (!r.success) {
    const issue = r.error.issues[0];
    const path = issue.path.join('.') || 'файл';
    throw new Error(`Файл прогресса повреждён или имеет неизвестный формат (поле «${path}»). Данные не изменены.`);
  }
  return r.data;
}
