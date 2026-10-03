import { defaultRng, sample, shuffle, type Rng } from '../lib/rng';
import type { Exercise, FillItem } from '../exercises/types';
import { gapParts, validGap } from '../exercises/gaps';
import type { Session } from '../exercises/session';
import { pickTheme } from '../exercises/session';
import type { Progress } from '../lib/progress';
import { getTopic } from '../topics';
import { generate, providerLabel } from './llm';
import { GenTextSchema, SYSTEM, TOPIC_FOCUS, TopicSetSchema, textPrompt, topicPrompt, type TopicSet } from './prompts';
import type { ReadingText } from '../data/texts';
import type { GlossEntry } from '../lib/dictionary';
import { fetchSource } from './sources';

const clean = (s: string) => s.trim();
const uniq = (xs: string[]) => [...new Set(xs.map(clean).filter(Boolean))];

/** Converts a Claude topic set into app exercises, silently dropping malformed items. */
export function topicSetToExercises(set: TopicSet, rng: Rng): Exercise[] {
  const gaps = set.fill
    .filter((g) => validGap(g.sentence, g.answer))
    .map((g) => ({ g, parts: gapParts(g.sentence)! }));
  const bankGaps = gaps.slice(0, 4);
  const typedGaps = gaps.slice(4);
  const out: Exercise[] = [];

  if (bankGaps.length) {
    const answers = bankGaps.map((x) => clean(x.g.answer));
    const wrong = uniq(bankGaps.flatMap((x) => x.g.wrong)).filter((w) => !answers.includes(w));
    const extra: string[] = [];
    for (let k = 0; extra.length < bankGaps.length && wrong.length; k++) extra.push(wrong[k % wrong.length]);
    out.push({
      type: 'bank',
      title: 'Банк слов',
      instruction: 'Перетащите слова в пропуски. Лишние слова останутся.',
      items: bankGaps.map((x) => ({ parts: x.parts, answers: [clean(x.g.answer)], hint: x.g.hint_ru })),
      bank: shuffle(rng, [...answers, ...extra]),
    });
  }

  const choices = set.choice
    .map((c) => {
      const options = uniq(c.options);
      const parts = gapParts(c.sentence);
      const answer = options.indexOf(clean(c.answer));
      return parts && answer >= 0 && options.length >= 2 && validGap(c.sentence, c.answer) ? { parts, options, answer, explain: c.explanation_ru } : null;
    })
    .filter((x) => !!x);
  if (choices.length) {
    out.push({
      type: 'choice',
      title: 'Выберите правильный вариант',
      instruction: 'Выберите вариант, который подходит.',
      layout: 'inline',
      items: choices.map((c) => {
        const opts = shuffle(rng, c.options);
        return { parts: c.parts, options: opts, answer: opts.indexOf(c.options[c.answer]), explain: c.explain };
      }),
    });
  }

  for (const o of set.order) {
    const chunks = o.chunks.map(clean).filter(Boolean);
    if (chunks.length < 3) continue;
    const order = chunks.map((_, i) => i);
    const perm = shuffle(rng, order.slice(1));
    const shown = [chunks[0], ...perm.map((i) => chunks[i])];
    out.push({
      type: 'order',
      title: 'Порядок слов',
      instruction: 'Составьте предложение. Первый элемент уже стоит на месте.',
      item: {
        chunks: shown,
        answers: [chunks.map((c) => shown.indexOf(c))],
        fixedFirst: 0,
        punct: o.punctuation,
        hint: o.translation_ru,
      },
    });
  }

  if (typedGaps.length) {
    out.push({
      type: 'fill',
      title: 'Впишите форму',
      instruction: 'Вставьте пропущенное слово в правильной форме.',
      items: typedGaps.map((x): FillItem => ({ parts: x.parts, answers: [[clean(x.g.answer)]], hint: x.g.hint_ru })),
    });
  }

  for (const w of set.write) {
    const answers = uniq(w.answers);
    if (!answers.length || !w.cues.length) continue;
    out.push({
      type: 'write',
      title: 'Напишите предложение',
      instruction: 'Напишите предложение из данных частей.',
      item: { cues: w.cues.map(clean), task: w.task_ru, answers },
    });
  }

  const lefts = new Set<string>();
  const rights = new Set<string>();
  const pairs: [string, string][] = [];
  for (const m of set.match) {
    const l = clean(m.left);
    const r = clean(m.right);
    if (!l || !r || lefts.has(l) || rights.has(r)) continue;
    lefts.add(l);
    rights.add(r);
    pairs.push([l, r]);
  }
  if (pairs.length >= 3) out.push({ type: 'match', title: 'Соедините пары', instruction: 'Соедините левую и правую части.', pairs });

  return out;
}

export async function aiTopicSession(topicId: string, progress: Progress, rng: Rng = defaultRng): Promise<Session> {
  const topic = getTopic(topicId);
  if (!topic) throw new Error('Тема не найдена');
  const theme = pickTheme(progress.recentThemes, rng);
  const vocab = [...sample(rng, theme.nouns, 10).map((n) => n.de), ...sample(rng, theme.acts, 8).map((a) => `${a.c} ${a.v}`.trim())];
  const saved = sample(rng, Object.keys(progress.words), 12);
  const set = await generate(
    TopicSetSchema,
    SYSTEM,
    topicPrompt({
      topicDe: topic.de,
      topicRu: topic.ru,
      level: topic.level,
      focus: TOPIC_FOCUS[topicId] ?? topic.summary,
      theme: `${theme.name.de} (${theme.name.en})`,
      vocab,
      savedWords: saved,
    }),
  );
  const exercises = topicSetToExercises(set, rng);
  if (!exercises.length) throw new Error(`${providerLabel()} вернул пустой набор упражнений. Попробуйте ещё раз.`);
  return { title: topicId, theme, exercises, srsCreate: false };
}

// ---------------------------------------------------------------------------

export async function aiText(topic: string, level: 'A1' | 'A2', onStatus?: (s: string) => void): Promise<ReadingText> {
  onStatus?.('Ищу статью в Klexikon и Википедии…');
  const source = await fetchSource(topic);
  const ai = providerLabel();
  onStatus?.(source ? `Нашёл статью «${source.title}» (${source.site}). ${ai} пишет текст…` : `Статья не найдена — ${ai} пишет текст сам…`);
  const gen = await generate(GenTextSchema, SYSTEM, textPrompt({ topic, level, source: source ?? undefined }));
  const glossary: Record<string, GlossEntry> = {};
  for (const g of gen.glossary) {
    const form = g.form.trim();
    if (form && !glossary[form]) glossary[form] = { lemma: g.lemma.trim(), pos: g.pos, ru: g.ru, en: g.en, ...(g.pos === 'noun' ? { pl: g.plural.trim() } : {}) };
  }
  const questions = gen.questions
    .map((q) => ({ q: q.q, options: uniq(q.options), answer: q.answer, right: q.options[q.answer] }))
    .filter((q) => q.right && q.options.includes(clean(q.right)))
    .map((q) => ({ q: q.q, options: q.options, answer: q.options.indexOf(clean(q.right)) }));
  const fill = gen.fill.filter((f) => validGap(f.sentence, f.answer));
  return {
    id: `gen-${Date.now()}`,
    theme: 'custom',
    level,
    title: gen.title,
    source: source ? `${source.site}: ${source.title}` : undefined,
    sourceUrl: source?.url,
    paragraphs: gen.paragraphs.map(clean).filter(Boolean),
    glossary,
    questions,
    fill,
    generated: true,
    createdAt: Date.now(),
  };
}
