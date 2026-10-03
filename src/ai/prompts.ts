import { z } from 'zod';

/*
 * Prompts for Claude-generated content. Each exercise type has its own instruction block;
 * a request combines the shared system prompt, the topic focus, the vocabulary theme and the
 * blocks of the exercise types it asks for. Output shape is enforced by structured outputs.
 */

export const SYSTEM = `You write German exercises and reading texts for a learner app.

The learner is an adult native Russian speaker (fluent in English) studying German at level A1–A2.

Rules that apply to everything you write:
- German must be correct standard German (Duden spelling, ß/ä/ö/ü, correct capitalisation and commas).
- Stay within the requested CEFR level: A1 = Präsens, Perfekt, modal verbs, simple main clauses; A2 adds Präteritum, weil/dass/wenn clauses, reflexive verbs, verbs with prepositions, Dativ, Wechselpräpositionen.
- Use everyday vocabulary from the requested theme. Vary subjects (ich, du, er/sie, wir, ihr, Sie, names) and situations.
- Every task must have exactly one correct answer. If a sentence could reasonably be completed in two ways, rewrite it.
- Hints and explanations for the learner are in Russian. Never put the German answer itself into a hint.
- Gaps are written as three underscores: ___ (exactly one gap per sentence).
- Before answering, re-read every task with its correct answer inserted and fix anything unnatural, repetitive or ambiguous.`;

/** What each grammar topic drills — keeps generated exercises on target. */
export const TOPIC_FOCUS: Record<string, string> = {
  'praesens-regular': 'Present tense of regular verbs: endings -e, -st, -t, -en, -t, -en; stems ending in -t/-d (arbeitest, findet) and -s/-z (du tanzt).',
  'praesens-irregular': 'Present tense of strong verbs with vowel change in du/er (e→i: nimmt, e→ie: liest, a→ä: fährt) and sein/haben/werden/wissen.',
  'satzbau-inversion': 'Verb-second word order and inversion: when a time/place expression starts the sentence the subject follows the verb (Am Abend habe ich …). Include the verb bracket with Perfekt and modal verbs.',
  fragen: 'Questions: W-questions (W-word + verb + subject) and yes/no questions (verb first), also in Perfekt.',
  trennbare: 'Separable verbs: prefix at the end in main clauses (Ich stehe um 7 Uhr auf), together with modal verbs (Ich muss aufstehen); inseparable prefixes be-, ver-, er- …',
  modalverben: 'Modal verbs können, müssen, wollen, dürfen, sollen, möchten: conjugation (ich kann, er will) and the infinitive at the end.',
  'perfekt-haben': 'Perfekt with haben of regular verbs: ge-…-t participle (gekocht, gearbeitet); verb bracket.',
  'perfekt-sein': 'Perfekt of strong verbs (gegessen, geschrieben) and the choice between haben and sein (movement/change of state → sein).',
  'perfekt-besonders': 'Partizip II of separable verbs (aufgestanden, eingekauft), inseparable verbs (besucht, verstanden) and -ieren verbs (studiert).',
  'artikel-plural': 'Articles der/die/das, ein/eine, kein/keine and plural forms (-e, -er, -(e)n, -s, umlaut).',
  akkusativ: 'Accusative: den/einen/keinen for masculine nouns, accusative prepositions für, ohne, durch, gegen, um, personal pronouns mich/dich/ihn.',
  dativ: 'Dative: dem/der/den+n, einem/einer; dative prepositions mit, bei, zu, von, aus, nach, seit; dative verbs helfen, danken, gehören, schenken; pronouns mir/dir/ihm.',
  'konnektoren-a1': 'Connectors in position 0 (und, aber, oder, denn — normal word order) versus dann at position 1 (inversion).',
  'praeteritum-basis': 'Präteritum of sein, haben and modal verbs (war, hatte, konnte, musste, wollte).',
  futur: 'Futur I: werden (werde, wirst, wird, werden, werdet, werden) + infinitive at the end; with a separable verb the infinitive stays joined (Ich werde dich anrufen); in a subordinate clause werden goes last (…, dass es morgen regnen wird). Use it for plans, promises and predictions with a future time expression; no modal verbs in Futur.',
  'verben-praep': 'Verbs with fixed prepositions (warten auf, denken an, sich freuen auf/über, sich interessieren für, träumen von …) and the case they govern; wo(r)-/da(r)- forms.',
  reflexiv: 'Reflexive verbs with the correct pronoun (ich freue mich, du ziehst dich an) and dative reflexive pronouns with an accusative object (ich wasche mir die Hände).',
  nebensaetze: 'Subordinate clauses with weil, dass, wenn: the finite verb goes to the end; a fronted subordinate clause causes inversion in the main clause.',
  'deshalb-trotzdem': 'deshalb, trotzdem, dann, danach at position 1 followed by the verb (inversion), contrasted with weil/denn.',
  wechselpraep: 'Two-way prepositions: Wohin? + Akkusativ (Ich lege das Buch auf den Tisch) vs. Wo? + Dativ (Das Buch liegt auf dem Tisch); stellen/stehen, legen/liegen, contractions im/ins/am.',
};

/** One instruction block per exercise type. */
export const TYPE_PROMPTS = {
  fill: `"fill" — gap sentences (used both as a word bank and as typing tasks).
- One natural, meaningful sentence with exactly one ___ where the drilled form goes. Read it with the answer filled in: it must be something a native speaker would actually say.
- The answer word must not appear anywhere else in the sentence, and the sentence must not repeat a noun (never "Der ___ im Ofen ist heiß" → "Der Ofen im Ofen").
- The gap must have exactly one correct filling; the surrounding words must make it clear (subject, article, time expression).
- "answer": the single correct word or short form (e.g. "fährt", "den", "aufgestanden").
- "hint_ru": a short Russian hint — the Russian meaning of the missing verb or noun, or the grammatical cue (e.g. "ехать", "Akkusativ, m"). Never the German answer or the German infinitive.
- "wrong": 2 plausible but wrong forms that a learner might confuse with the answer (other person forms, the other article, haben vs. sein …). They must be clearly wrong in this sentence.`,
  choice: `"choice" — multiple choice.
- "sentence": one natural sentence with exactly one ___; the correct option must not already appear in the sentence.
- "options": 3 or 4 different options; exactly one of them fits.
- "answer": the correct option, copied exactly.
- "explanation_ru": one short sentence in Russian explaining the rule.`,
  order: `"order" — build a sentence from chunks.
- "chunks": the sentence split into 4–7 chunks in the CORRECT order (constituents, not single letters: e.g. ["Am Abend", "habe", "ich", "einen Kuchen", "gebacken"]). No final punctuation inside the chunks.
- Choose sentences whose word order is unambiguous once the first chunk is fixed.
- "punctuation": "." or "?".
- "translation_ru": Russian translation of the sentence.`,
  write: `"write" — the learner writes a whole sentence from cues (like a textbook: "Malo – heute – Deutsch lernen (wollen)").
- "cues": 3–4 cues: subject, time/place, verb phrase in the infinitive.
- "task_ru": the instruction in Russian (tense, start with …, use the modal verb …).
- "answers": all acceptable correct sentences (at least one; add variants with a different but correct word order).`,
  match: `"match" — pairs to connect (questions ↔ answers, sentence halves, verb ↔ preposition).
- Each "left" must match exactly one "right" and vice versa — no pair may fit two partners.`,
};

// ---------------------------------------------------------------------------
// schemas

const Gap = z.object({ sentence: z.string(), answer: z.string(), hint_ru: z.string(), wrong: z.array(z.string()) });
const Choice = z.object({ sentence: z.string(), options: z.array(z.string()), answer: z.string(), explanation_ru: z.string() });
const Order = z.object({ chunks: z.array(z.string()), punctuation: z.enum(['.', '?']), translation_ru: z.string() });
const Write = z.object({ cues: z.array(z.string()), task_ru: z.string(), answers: z.array(z.string()) });
const Match = z.object({ left: z.string(), right: z.string() });

export const TopicSetSchema = z.object({
  fill: z.array(Gap),
  choice: z.array(Choice),
  order: z.array(Order),
  write: z.array(Write),
  match: z.array(Match),
});
export type TopicSet = z.infer<typeof TopicSetSchema>;
export type GapT = z.infer<typeof Gap>;

export function topicPrompt(o: { topicDe: string; topicRu: string; level: string; focus: string; theme: string; vocab: string[]; savedWords: string[] }): string {
  return `Create a practice set for the grammar topic "${o.topicDe}" (${o.topicRu}), level ${o.level}.

Grammar focus: ${o.focus}

Vocabulary theme: ${o.theme}. Useful words: ${o.vocab.join(', ')}.
${o.savedWords.length ? `If they fit naturally, also use some of the learner's saved words: ${o.savedWords.join(', ')}.\n` : ''}
Produce exactly: 8 "fill", 5 "choice", 3 "order", 2 "write", 5 "match" items. Every item must practise the grammar focus.

${TYPE_PROMPTS.fill}

${TYPE_PROMPTS.choice}

${TYPE_PROMPTS.order}

${TYPE_PROMPTS.write}

${TYPE_PROMPTS.match}`;
}

// ---------------------------------------------------------------------------
// reading texts

const POS = z.enum(['noun', 'verb', 'adj', 'adv', 'prep', 'pron', 'art', 'conj', 'num', 'other']);

export const GenTextSchema = z.object({
  title: z.string(),
  paragraphs: z.array(z.string()),
  glossary: z.array(z.object({ form: z.string(), lemma: z.string(), pos: POS, plural: z.string(), ru: z.string(), en: z.string() })),
  questions: z.array(z.object({ q: z.string(), options: z.array(z.string()), answer: z.number().int() })),
  fill: z.array(Gap),
});
export type GenText = z.infer<typeof GenTextSchema>;

export function textPrompt(o: { topic: string; level: 'A1' | 'A2'; source?: { title: string; site: string; text: string } }): string {
  const length = o.level === 'A1' ? '100–140 words, 3–4 short paragraphs' : '150–200 words, 3–4 paragraphs';
  const grammar =
    o.level === 'A1'
      ? 'Short main clauses, Präsens and some Perfekt, no subordinate clauses except a rare "denn".'
      : 'Präsens, Perfekt, Präteritum of sein/haben/modals, some weil/dass/wenn clauses. End with a short personal paragraph in the first person (Perfekt).';
  return `Write a reading text in German for level ${o.level} about: "${o.topic}".

Length: ${length}. ${grammar}
Explain the topic in simple words for an adult; keep facts correct. ${o.source ? 'Base the facts on the source below, but simplify — do not copy its sentences.' : 'Use well-known, uncontroversial facts.'}
"title": a short German title.
"paragraphs": the text, one string per paragraph.

"glossary": an entry for EVERY noun, verb, adjective and adverb in the text (not for articles, pronouns, common prepositions, und/oder/aber, numbers):
- "form": the word exactly as it appears in the text (same case and ending), one entry per distinct form.
- "lemma": dictionary form — nouns with article ("der Apfel"; plural-only nouns "die Leute (мн.)"), verbs in the infinitive (for a separable verb split in the sentence, give the full infinitive for both parts, e.g. "steht" and "auf" → "aufstehen"), adjectives in the base form.
- "plural": for nouns the nominative plural without article ("Äpfel", "Kinder"); "" if the noun has no plural in normal use or is plural-only; "" for all other parts of speech.
- "ru" and "en": short translations that fit the meaning in this text.

"questions": 3–4 comprehension questions in simple German, each with 3 options (German), exactly one correct; "answer" is the 0-based index of the correct option.

"fill": 5 new gap sentences about the text that practise its key words or grammar.
${TYPE_PROMPTS.fill}
${o.source ? `\nSource (${o.source.site}, article "${o.source.title}"):\n"""\n${o.source.text}\n"""` : ''}`;
}
