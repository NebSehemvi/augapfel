import { chance, int, pick, sample, scramble, shuffle, type Rng } from '../lib/rng';
import type { Ctx } from '../exercises/context';
import { pickActs, type Act } from '../exercises/context';
import type { ChoiceItem, Exercise, FillItem, OrderItem } from '../exercises/types';
import * as B from '../exercises/builders';
import { getVerb } from '../data/verbs';
import { present, weakStem } from '../grammar/conjugate';
import { IMP_FORMS, hasImperative, imperative, impFinite, impWords, type ImpForm, type ImpOpts } from '../grammar/imperative';
import type { Verb } from '../grammar/types';

/*
 * "Imperativ": du / ihr / Sie. Sentences come from the theme's activities (verb + complement).
 * Mistakes are not tracked in Повторение (no new SRS key kind).
 */

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

const FORM_RU: Record<ImpForm, string> = { du: 'du (ты)', ihr: 'ihr (вы, друзья)', Sie: 'Sie (Вы, вежливо)' };
const WHO_RU: Record<ImpForm, string> = { du: 'другу, ребёнку', ihr: 'друзьям, детям', Sie: 'незнакомому человеку, начальнику' };

/** Verbs whose theme sentences sound odd as a command ("Verlier das Spiel!", "Sei müde!"). */
const ODD_AS_COMMAND = new Set(['vergessen', 'verstehen', 'brauchen', 'bekommen', 'husten', 'verlieren', 'sein', 'verlaufen', 'Staub saugen']);

/** Activities that read well as a command: no first person, no negation, no odd verbs. */
const okAct = (a: Act) =>
  hasImperative(a.verb) && !ODD_AS_COMMAND.has(a.verb.inf) && !/\b(ich|mich|mir|wir|uns|nicht|kein\w*)\b/i.test(a.c);

const pickImpActs = (ctx: Ctx, n: number, pred: (a: Act) => boolean = () => true) => pickActs(ctx, n, (a) => okAct(a) && pred(a));

/** Imperative words with the finite verb replaced by a gap → FillItem parts */
function gapParts(v: Verb, f: ImpForm, c: string): (string | number)[] {
  const words = impWords(v, f, { c });
  return [0, ' ' + words.slice(1).join(' ') + '!'];
}

/** Wrong answers for an imperative gap: du-pronoun forms, infinitive, other persons, missing e→i change, kept umlaut. */
export function wrongImperatives(v: Verb, f: ImpForm): string[] {
  const right = impFinite(v, f);
  const out: string[] = [];
  if (f === 'du') {
    out.push(present(v, 1), v.base, present(v, 4));
    if (v.presDuEr) {
      out.push(weakStem(v.base)); // nehm … without the vowel change
      if (/[äö]/.test(v.presDuEr[0])) out.push(v.presDuEr[0].replace(/st$/, '')); // fähr … with the umlaut kept
    }
    if (/(t|d|chn|ffn)e$/.test(right)) out.push(right.slice(0, -1)); // Wart! (-e is missing)
  } else if (f === 'ihr') {
    out.push(present(v, 1), v.base, impFinite(v, 'du'));
  } else {
    out.push(present(v, 4), impFinite(v, 'du'), present(v, 1), present(v, 2));
  }
  return [...new Set(out.filter((w) => w && w.toLowerCase() !== right.toLowerCase()))];
}

function choiceItem(rng: Rng, a: Act, f: ImpForm): ChoiceItem {
  const right = cap(impFinite(a.verb, f));
  const wrong = shuffle(rng, wrongImperatives(a.verb, f).map(cap)).slice(0, 3);
  const options = shuffle(rng, [right, ...wrong]);
  return { parts: gapParts(a.verb, f, a.c), options, answer: options.indexOf(right), context: FORM_RU[f], hint: a.ru };
}

function fillItem(a: Act, f: ImpForm): FillItem {
  return {
    parts: gapParts(a.verb, f, a.c),
    answers: [[cap(impFinite(a.verb, f))]],
    context: `${FORM_RU[f]} · ${B.verbLabel(a.verb)}`,
    hint: a.ru,
    distractors: wrongImperatives(a.verb, f).map(cap),
  };
}

/** Chunks for the tile exercise: finite (+ Sie), reflexive, particle, complement, separable prefix. */
function chunksOf(v: Verb, f: ImpForm, o: ImpOpts): string[] {
  const out = [impFinite(v, f)];
  if (f === 'Sie') out.push('Sie');
  if (v.refl) out.push(REFL[f]);
  if (o.particle) out.push(o.particle);
  if (o.c) out.push(o.c);
  if (v.sep) out.push(v.sep.trim());
  return out;
}

function orderItem(rng: Rng, variants: string[][], hint: string): OrderItem {
  const canon = variants[0];
  const chunks = scramble(rng, canon);
  const toIdx = (seq: string[]): number[] | null => {
    const used = new Set<number>();
    const idx: number[] = [];
    for (const t of seq) {
      const k = chunks.findIndex((x, j) => x === t && !used.has(j));
      if (k < 0) return null;
      used.add(k);
      idx.push(k);
    }
    return idx;
  };
  const answers = [...new Map(variants.map(toIdx).filter((x): x is number[] => !!x).map((a) => [a.join(','), a])).values()];
  return { chunks, answers, punct: '!', hint };
}

/** Accepted tile orders: "bitte" after the verb, or first (Bitte komm …), or at the end (without separable prefix). */
function orderVariants(v: Verb, f: ImpForm, o: ImpOpts): string[][] {
  const canon = chunksOf(v, f, o);
  if (o.particle !== 'bitte') return [canon];
  const without = chunksOf(v, f, { c: o.c });
  const out = [canon, ['bitte', ...without]];
  if (!v.sep) out.push([...without, 'bitte']);
  return out;
}

/** All accepted written answers. */
function writtenAnswers(v: Verb, f: ImpForm, o: ImpOpts): string[] {
  const out = orderVariants(v, f, o).map((seq) => cap(seq.join(' ')) + '!');
  return [...new Set(out)];
}

const MODAL_SOLL: Record<ImpForm, string> = { du: 'Du sollst', ihr: 'Ihr sollt', Sie: 'Sie sollen' };
const REFL: Record<ImpForm, string> = { du: 'dich', ihr: 'euch', Sie: 'sich' };

function sollCue(v: Verb, f: ImpForm, c: string): string {
  return [MODAL_SOLL[f], v.refl ? REFL[f] : '', c, v.inf].filter(Boolean).join(' ') + '.';
}

/** Irregular du-imperatives to match with their infinitive. */
const IRREGULAR = ['nehmen', 'lesen', 'geben', 'essen', 'sehen', 'sprechen', 'fahren', 'schlafen', 'laufen', 'sein', 'warten', 'öffnen', 'arbeiten', 'helfen', 'vergessen', 'finden'];

function imperativPlan(ctx: Ctx): Exercise[] {
  const { rng } = ctx;
  const ex: Exercise[] = [];
  const forms = () => pick(rng, IMP_FORMS);

  // 1. whom do you talk to?
  ex.push({
    type: 'choice',
    title: 'К кому вы обращаетесь?',
    instruction: 'Выберите предложение для нужного собеседника: du, ihr или Sie.',
    layout: 'list',
    items: pickImpActs(ctx, 4).map((a) => {
      const f = forms();
      const opts = IMP_FORMS.map((x) => imperative(a.verb, x, { c: a.c }));
      const options = shuffle(rng, opts);
      return { question: `Вы говорите ${WHO_RU[f]}: «${a.ru}»`, options, answer: options.indexOf(imperative(a.verb, f, { c: a.c })) };
    }),
  });

  // 2. right form (choice)
  ex.push({
    type: 'choice',
    title: 'Императив: выберите форму',
    instruction: 'Выберите правильную форму. У du нет местоимения и окончания -st, у Sie — Sie после глагола.',
    layout: 'inline',
    items: pickImpActs(ctx, 6).map((a) => choiceItem(rng, a, forms())),
  });

  // 3. type it
  ex.push({ type: 'fill', title: 'Императив: впишите форму', instruction: 'Впишите глагол в форме Imperativ. Не забудьте заглавную букву в начале.', items: pickImpActs(ctx, 5).map((a) => fillItem(a, forms())) });

  // 4. word bank
  ex.push(B.asBank(ctx, { type: 'fill', title: 'Императив: банк слов', instruction: '', items: pickImpActs(ctx, 4).map((a) => fillItem(a, forms())) }));

  // 5. conjugation table, preferably a stem-changing verb
  const irr = pickImpActs(ctx, 1, (a) => !!a.verb.presDuEr);
  const [one] = irr.length ? irr : pickImpActs(ctx, 1);
  const given = int(rng, 3);
  ex.push({
    type: 'conj',
    title: `Императив: ${B.verbLabel(one.verb)}`,
    instruction: 'Заполните таблицу: du, ihr, Sie.',
    verb: B.verbLabel(one.verb),
    tense: 'Imperativ',
    rows: IMP_FORMS.map((f, i) => ({ label: f, answers: [cap(impWords(one.verb, f).join(' '))], given: i === given })),
  });

  // 6. sort sentences by form
  const sortActs = pickImpActs(ctx, 6);
  ex.push(
    B.sortEx(
      'du, ihr или Sie?',
      'Кому адресована команда?',
      ['du', 'ihr', 'Sie'],
      shuffle(
        rng,
        sortActs.map((a, i) => {
          const f = IMP_FORMS[i % 3];
          return { text: imperative(a.verb, f, { c: a.c }), cat: i % 3 };
        }),
      ),
    ),
  );

  // 7. irregular forms
  ex.push(
    B.matchEx(
      'Особые формы du',
      'Соедините инфинитив и Imperativ (du).',
      sample(rng, IRREGULAR, 5).map((k) => [k, imperative(getVerb(k), 'du')] as [string, string]),
    ),
  );

  // 8. tiles
  for (const [i, a] of pickImpActs(ctx, 2).entries()) {
    const f = forms();
    const o: ImpOpts = { c: a.c, particle: i === 1 && chance(rng, 0.7) ? 'bitte' : undefined };
    ex.push({
      type: 'order',
      title: 'Составьте предложение',
      instruction: `Составьте приказ или просьбу (${f}).`,
      item: orderItem(rng, orderVariants(a.verb, f, o), `${a.ru} · ${f}`),
    });
  }

  // 9. turn the instruction into an imperative
  for (const [i, a] of pickImpActs(ctx, 2).entries()) {
    const f = forms();
    const o: ImpOpts = { c: a.c, particle: i === 1 ? 'bitte' : undefined };
    ex.push({
      type: 'write',
      title: 'Превратите в приказ',
      instruction: 'Скажите то же самое в Imperativ — без «sollen».',
      item: {
        cues: [sollCue(a.verb, f, a.c)],
        task: o.particle ? `Imperativ (${f}), вежливо — с «bitte».` : `Imperativ (${f}).`,
        answers: writtenAnswers(a.verb, f, o),
        hint: a.ru,
      },
    });
  }

  return ex;
}

export const IMPERATIV_PLANS: Record<string, (ctx: Ctx) => Exercise[]> = { imperativ: imperativPlan };
