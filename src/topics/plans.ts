import { pick, sample, shuffle } from '../lib/rng';
import type { Ctx } from '../exercises/context';
import type { Exercise, ChoiceItem } from '../exercises/types';
import * as B from '../exercises/builders';
import { CLASS_LABELS, TABLE_VERBS, VERBS, getVerb } from '../data/verbs';
import type { Verb } from '../grammar/types';
import { PLURAL_TYPES, pluralType, AKK_PREPS, DAT_PREPS, GENDER_ART } from '../grammar/articles';
import { PREP_VERBS } from '../data/prepVerbs';
import { verbAllowed } from '../exercises/context';

const noGe = (v: Verb) => B.ppType(v) === 2;
const isRegular = (v: Verb) => v.kind === 'weak' && !v.sep && !v.refl;
const isStemChanger = (v: Verb) => !!v.presDuEr && !v.sep && !v.refl;
const pickVerbs = (ctx: Ctx, pred: (v: Verb) => boolean, n: number) =>
  sample(ctx.rng, VERBS.filter((v) => verbAllowed(ctx, v) && v.level !== 'B1' && pred(v)), n);

function staticChoice(ctx: Ctx, title: string, instruction: string, pool: ChoiceItem[], n: number): Exercise {
  return {
    type: 'choice',
    title,
    instruction,
    layout: 'inline',
    items: sample(ctx.rng, pool, n).map((it) => {
      const right = it.options[it.answer];
      const options = shuffle(ctx.rng, it.options);
      return { ...it, options, answer: options.indexOf(right) };
    }),
  };
}

/** "Wo wohnst du? – In Berlin." */
const W_ITEMS: ChoiceItem[] = [
  ['Wo', 'wohnst du? — In Berlin.'],
  ['Woher', 'kommst du? — Aus Spanien.'],
  ['Wohin', 'fährst du im Sommer? — Nach Italien.'],
  ['Wann', 'beginnt der Kurs? — Um neun Uhr.'],
  ['Wie', 'heißt du? — Ich heiße Lena.'],
  ['Was', 'machst du am Wochenende? — Ich besuche meine Oma.'],
  ['Wer', 'ist das? — Das ist mein Bruder.'],
  ['Wie viel', 'kostet der Pullover? — 30 Euro.'],
  ['Warum', 'lernst du Deutsch? — Weil ich in Wien arbeite.'],
  ['Wie lange', 'dauert der Film? — Zwei Stunden.'],
  ['Wen', 'besuchst du morgen? — Meine Tante.'],
  ['Wem', 'hilfst du? — Meinem Nachbarn.'],
  ['Wie alt', 'bist du? — Ich bin 25.'],
  ['Wo', 'ist die Apotheke? — Neben der Bank.'],
  ['Was', 'trinkst du? — Einen Tee, bitte.'],
  ['Wann', 'hast du Geburtstag? — Im Mai.'],
  ['Wie oft', 'gehst du ins Fitnessstudio? — Zweimal pro Woche.'],
  ['Woher', 'kennst du Tom? — Aus dem Deutschkurs.'],
].map(([w, rest]) => {
  const options = [...new Set([w, ...['Wo', 'Wann', 'Was', 'Wie', 'Woher', 'Wohin', 'Wer', 'Warum'].filter((x) => x !== w)])].slice(0, 4);
  return { parts: [0, ' ' + rest], options, answer: 0 };
});

/** Personal pronouns: Akk / Dat */
const PRONOUN_ITEMS: ChoiceItem[] = [
  ['Kannst du', 'helfen? (ich)', 'mir', ['mich', 'mir', 'ich']],
  ['Ich liebe', '. (du)', 'dich', ['dich', 'dir', 'du']],
  ['Der Film gefällt', 'nicht. (er)', 'ihm', ['ihn', 'ihm', 'er']],
  ['Ich rufe', 'morgen an. (sie, она)', 'sie', ['sie', 'ihr', 'ihn']],
  ['Wir besuchen', 'am Sonntag. (ihr)', 'euch', ['euch', 'ihr', 'uns']],
  ['Das Buch gehört', '. (ich)', 'mir', ['mir', 'mich', 'mein']],
  ['Ich schenke', 'ein Buch. (sie, она)', 'ihr', ['ihr', 'sie', 'ihm']],
  ['Kennst du', '? (er)', 'ihn', ['ihn', 'ihm', 'er']],
  ['Wie geht es', '? (du)', 'dir', ['dir', 'dich', 'du']],
  ['Ich danke', '! (Sie)', 'Ihnen', ['Ihnen', 'Sie', 'Ihr']],
  ['Kannst du', 'abholen? (wir)', 'uns', ['uns', 'wir', 'euch']],
  ['Ich frage', '. (er)', 'ihn', ['ihn', 'ihm', 'er']],
  ['Die Suppe schmeckt', 'sehr gut. (ich)', 'mir', ['mir', 'mich', 'ich']],
  ['Ich verstehe', 'nicht. (du)', 'dich', ['dich', 'dir', 'du']],
].map(([a, b, right, opts]) => ({ parts: [a + ' ', 0, ' ' + b], options: opts as string[], answer: (opts as string[]).indexOf(right as string) }));

const REFL_DAT_ITEMS: ChoiceItem[] = [
  ['Ich wasche', 'die Hände.', 'mir', ['mich', 'mir']],
  ['Ich wasche', '.', 'mich', ['mich', 'mir']],
  ['Du putzt', 'die Zähne.', 'dir', ['dich', 'dir']],
  ['Ich ziehe', 'die Jacke an.', 'mir', ['mich', 'mir']],
  ['Ich ziehe', 'schnell an.', 'mich', ['mich', 'mir']],
  ['Kaufst du', 'ein neues Handy?', 'dir', ['dich', 'dir']],
  ['Ich wünsche', 'ein Fahrrad.', 'mir', ['mich', 'mir']],
  ['Du freust', 'auf den Urlaub.', 'dich', ['dich', 'dir']],
  ['Ich kämme', 'die Haare.', 'mir', ['mich', 'mir']],
  ['Ich setze', 'auf das Sofa.', 'mich', ['mich', 'mir']],
].map(([a, b, right, opts]) => ({ parts: [a + ' ', 0, ' ' + b], options: opts as string[], answer: (opts as string[]).indexOf(right as string) }));

const SEP_VERBS = ['aufstehen', 'einkaufen', 'anrufen', 'fernsehen', 'mitkommen', 'ankommen', 'abholen', 'aufräumen', 'einladen', 'anfangen', 'zumachen', 'mitbringen', 'einschlafen', 'aussteigen', 'umziehen'];
const INSEP_VERBS = ['verstehen', 'bezahlen', 'besuchen', 'erzählen', 'vergessen', 'bekommen', 'bestellen', 'beginnen', 'verdienen', 'erklären', 'gehören', 'verlieren', 'empfehlen', 'versuchen', 'wiederholen'];

const COMMON_SEIN = ['gehen', 'kommen', 'fahren', 'fliegen', 'laufen', 'bleiben', 'aufstehen', 'einschlafen', 'umziehen', 'ankommen', 'reisen', 'wandern', 'sein', 'werden', 'sterben', 'fallen', 'einsteigen', 'aufwachen'];
const COMMON_HABEN = ['essen', 'trinken', 'schreiben', 'lesen', 'sehen', 'machen', 'kaufen', 'arbeiten', 'schlafen', 'finden', 'nehmen', 'helfen', 'sprechen', 'treffen', 'singen', 'backen', 'liegen', 'sitzen', 'stehen', 'bringen', 'denken'];

// ---------------------------------------------------------------------------

export const PLANS: Record<string, (ctx: Ctx) => Exercise[]> = {
  'praesens-regular': (ctx) => [
    B.choiceVerbForm(ctx, { tense: 'pres', pred: (a) => isRegular(a.verb), title: 'Präsens: выберите форму' }),
    B.asBank(ctx, B.choiceVerbForm(ctx, { tense: 'pres', pred: (a) => isRegular(a.verb), n: 4, title: 'Präsens: банк слов' })),
    B.fillVerb(ctx, { tense: 'pres', pred: (a) => isRegular(a.verb), order: 'S', title: 'Präsens: вставьте глагол' }),
    B.conjEx(ctx, pick(ctx.rng, B.themeVerbs(ctx, 5, isRegular))),
    B.orderEx(ctx, { tense: 'pres', order: 'S', pred: (a) => isRegular(a.verb), fixFirst: true }),
    B.fillVerb(ctx, {
      tense: 'pres',
      pred: (a) => isRegular(a.verb) && /([dt]|[sßzx])en$/.test(a.verb.inf),
      n: 4,
      title: 'Особые случаи: -t-, -d-, -s-',
      instruction: 'Внимание: arbeiten → du arbeitest, tanzen → du tanzt.',
    }),
    B.writeEx(ctx, { tense: 'pres', start: 'subj', pred: (a) => isRegular(a.verb) }),
  ],

  'praesens-irregular': (ctx) => [
    B.sortEx(
      'Какая смена гласной?',
      'Распределите глаголы по типу смены гласной в du/er.',
      ['e → i', 'e → ie', 'a → ä, au → äu'],
      sample(ctx.rng, VERBS.filter((v) => isStemChanger(v) && v.level !== 'B1'), 8).map((v) => {
        const er = v.presDuEr![1];
        const cat = er.includes('ä') ? 2 : er.includes('ie') ? 1 : 0;
        return { text: `${v.inf} → er ${er}`, cat, srs: B.srsKey.pres(v) };
      }),
    ),
    B.fillVerb(ctx, { tense: 'pres', pred: (a) => !!a.verb.presDuEr, n: 6, title: 'Präsens: сильные глаголы' }),
    B.conjEx(ctx, pick(ctx.rng, [...B.themeVerbs(ctx, 4, isStemChanger), getVerb('fahren'), getVerb('essen')])),
    B.choiceVerbForm(ctx, { tense: 'pres', pred: (a) => ['sein', 'haben', 'werden', 'wissen'].includes(a.v) || !!a.verb.presDuEr, title: 'sein, haben и сильные глаголы' }),
    B.conjEx(ctx, getVerb(pick(ctx.rng, ['sein', 'haben', 'werden', 'wissen', 'nehmen']))),
    B.writeEx(ctx, { tense: 'pres', pred: (a) => !!a.verb.presDuEr }),
  ],

  'satzbau-inversion': (ctx) => [
    B.tableEx(ctx, { tense: 'pres', order: 'T' }),
    B.orderEx(ctx, { tense: 'pres', order: 'T', fixFirst: true, title: 'Инверсия: Präsens' }),
    B.choiceCorrectOrder(ctx, { tense: 'perf', order: 'T' }),
    B.orderEx(ctx, { tense: 'perf', order: 'T', fixFirst: true, title: 'Инверсия: Perfekt' }),
    B.tableEx(ctx, { tense: 'perf', order: 'T' }),
    B.writeEx(ctx, { tense: 'pres', start: 'time', title: 'Начните со времени' }),
    B.snakeEx(ctx, { tense: 'pres' }),
    B.writeEx(ctx, { tense: 'perf', start: 'time', title: 'Начните со времени (Perfekt)' }),
  ],

  fragen: (ctx) => [
    staticChoice(ctx, 'W-вопросы', 'Выберите вопросительное слово.', W_ITEMS, 6),
    B.orderEx(ctx, { tense: 'pres', order: 'Y', withTime: true, title: 'Вопрос без вопросительного слова', instruction: 'Составьте вопрос (да/нет): глагол на первом месте!' }),
    B.matchQA(ctx, 'pres'),
    B.orderEx(ctx, { tense: 'pres', order: 'W', lead: 'Wann', withTime: false, fixFirst: true, title: 'Вопрос с Wann', instruction: 'Составьте вопрос.' }),
    B.orderEx(ctx, { tense: 'perf', order: 'Y', withTime: true, title: 'Вопрос в Perfekt', instruction: 'Составьте вопрос (да/нет).' }),
    B.matchQA(ctx, 'perf'),
  ],

  trennbare: (ctx) => [
    B.sortEx(
      'Отделяемая приставка или нет?',
      'Распределите глаголы: отделяемая (trennbar) или неотделяемая (untrennbar) приставка.',
      ['trennbar', 'untrennbar'],
      shuffle(ctx.rng, [
        ...sample(ctx.rng, SEP_VERBS, 4).map((t) => ({ text: t, cat: 0 })),
        ...sample(ctx.rng, INSEP_VERBS, 4).map((t) => ({ text: t, cat: 1 })),
      ]),
    ),
    B.fillVerb(ctx, { tense: 'pres', pred: (a) => !!a.verb.sep && !a.verb.refl, n: 5, title: 'Отделяемые глаголы в Präsens', instruction: 'Вставьте глагол и приставку.' }),
    B.tableEx(ctx, { tense: 'pres', order: 'T', pred: (a) => !!a.verb.sep }),
    B.orderEx(ctx, { tense: 'pres', order: 'S', pred: (a) => !!a.verb.sep, fixFirst: true }),
    B.orderEx(ctx, { tense: 'pres', order: 'S', pred: (a) => !!a.verb.sep, modal: true, fixFirst: true, title: 'С модальным глаголом', instruction: 'С модальным глаголом приставка не отделяется: Ich muss früh aufstehen.' }),
    B.conjEx(ctx, pick(ctx.rng, B.themeVerbs(ctx, 4, (v) => !!v.sep && !v.refl))),
    B.writeEx(ctx, { tense: 'pres', pred: (a) => !!a.verb.sep }),
  ],

  modalverben: (ctx) => [
    B.asBank(ctx, B.fillVerb(ctx, { tense: 'pres', modal: true, n: 5, title: 'Модальные глаголы' })),
    B.fillVerb(ctx, { tense: 'pres', modal: true, n: 4, title: 'Модальные глаголы', instruction: 'Вставьте модальный глагол в правильной форме.' }),
    B.conjEx(ctx, getVerb(pick(ctx.rng, ['können', 'müssen', 'wollen', 'dürfen', 'möchten', 'sollen']))),
    B.tableEx(ctx, { tense: 'pres', order: 'T', modal: true }),
    B.writeEx(ctx, { tense: 'pres', modal: true, title: 'Предложение с модальным глаголом' }),
    B.orderEx(ctx, { tense: 'pres', order: 'T', modal: true, fixFirst: true }),
    B.choiceCorrectOrder(ctx, { tense: 'pres', order: 'T', modal: true }),
    B.writeEx(ctx, { tense: 'pres', modal: true, start: 'time' }),
  ],

  'perfekt-haben': (ctx) => [
    B.formsEx(B.themeVerbs(ctx, 4, (v) => v.kind === 'weak' && v.aux[0] === 'haben' && B.ppType(v) === 0), ['pp'], 'Partizip II: ge…t'),
    B.fillVerb(ctx, { tense: 'perf', pred: (a) => a.verb.kind === 'weak' && a.verb.aux[0] === 'haben', n: 5, title: 'Perfekt с haben' }),
    B.matchQA(ctx, 'perf'),
    B.orderEx(ctx, { tense: 'perf', order: 'S', pred: (a) => a.verb.kind === 'weak', fixFirst: true }),
    B.tableEx(ctx, { tense: 'perf', order: 'S', pred: (a) => a.verb.kind === 'weak' }),
    B.writeEx(ctx, { tense: 'perf', pred: (a) => a.verb.kind === 'weak' }),
  ],

  'perfekt-sein': (ctx) => [
    B.sortEx(
      'haben или sein?',
      'С каким вспомогательным глаголом образуется Perfekt?',
      ['haben', 'sein'],
      shuffle(ctx.rng, [
        ...sample(ctx.rng, COMMON_HABEN, 5).map((v) => ({ text: v, cat: 0, srs: B.srsKey.aux(getVerb(v)) })),
        ...sample(ctx.rng, COMMON_SEIN, 5).map((v) => ({ text: v, cat: 1, srs: B.srsKey.aux(getVerb(v)) })),
      ]),
    ),
    B.asBank(ctx, B.choiceAux(ctx)),
    B.formsEx(B.themeVerbs(ctx, 4, (v) => v.kind !== 'weak' && v.kind !== 'modal'), ['pp', 'aux'], 'Partizip II сильных глаголов'),
    B.fillVerb(ctx, { tense: 'perf', pred: (a) => a.verb.kind !== 'weak', n: 5, title: 'Perfekt: сильные глаголы' }),
    B.orderEx(ctx, { tense: 'perf', order: 'T', pred: (a) => a.verb.aux[0] === 'sein', fixFirst: true }),
    B.writeEx(ctx, { tense: 'perf', start: 'time', pred: (a) => a.verb.kind !== 'weak' }),
  ],

  'perfekt-besonders': (ctx) => [
    B.sortEx(
      'Как образуется Partizip II?',
      'Распределите глаголы по типу причастия.',
      ['ge- … (обычно)', '…-ge-… (отделяемые)', 'без ge- (be-, ver-, -ieren…)'],
      shuffle(ctx.rng, [
        ...([0, 1, 2] as const).flatMap((t) =>
          pickVerbs(ctx, (v) => B.ppType(v) === t && !v.refl, 3).map((v) => ({ text: `${v.inf} → ${v.pp[0]}`, cat: t })),
        ),
      ]),
    ),
    B.formsEx(
      shuffle(ctx.rng, [
        ...B.themeVerbs(ctx, 2, (v) => B.ppType(v) === 1),
        ...B.themeVerbs(ctx, 2, noGe),
      ]),
      ['pp', 'aux'],
      'Partizip II: приставки и -ieren',
    ),
    B.fillVerb(ctx, { tense: 'perf', pred: (a) => !!a.verb.sep, n: 4, title: 'Perfekt: отделяемые глаголы' }),
    B.fillVerb(ctx, { tense: 'perf', pred: (a) => noGe(a.verb), n: 4, title: 'Perfekt: без ge-' }),
    B.orderEx(ctx, { tense: 'perf', order: 'T', pred: (a) => !!a.verb.sep, fixFirst: true }),
    B.writeEx(ctx, { tense: 'perf', pred: (a) => !!a.verb.sep || a.verb.base.endsWith('ieren') }),
  ],

  'artikel-plural': (ctx) => {
    const sortable = B.themeNouns(ctx, 8, (n) => !!pluralType(n));
    return [
      B.choiceGender(ctx, 8),
      B.sortEx(
        'Множественное число',
        'Распределите существительные по типу множественного числа (как в таблице из учебника).',
        PLURAL_TYPES,
        sortable.map((n) => ({ text: `${GENDER_ART[n.g as 'm' | 'f' | 'n']} ${n.de} → ${n.pl}`, cat: PLURAL_TYPES.indexOf(pluralType(n)!), srs: B.srsKey.plural(n.de) })),
      ),
      B.fillPlural(ctx, 5),
      B.framesEx(ctx, (f) => !f.p && (f.case ?? 'akk') === 'akk' && (!f.arts || f.arts.includes('indef') || f.arts.includes('kein')), 'choice', 5, 'ein / kein', 'Выберите правильную форму артикля.'),
      B.choiceGender(ctx, 6),
    ];
  },

  akkusativ: (ctx) => [
    B.framesEx(ctx, (f) => !f.p && (f.case ?? 'akk') === 'akk', 'choice', 6, 'Akkusativ: артикль', 'Выберите артикль в винительном падеже.'),
    staticChoice(ctx, 'Личные местоимения', 'Выберите местоимение (Akkusativ или Dativ).', PRONOUN_ITEMS.filter((i) => ['mich', 'dich', 'ihn', 'sie', 'uns', 'euch'].includes(i.options[i.answer])), 5),
    B.framesEx(ctx, (f) => !f.p && (f.case ?? 'akk') === 'akk', 'fill', 5, 'Akkusativ: впишите артикль', 'Впишите артикль в нужной форме.'),
    B.framesEx(ctx, (f) => !!f.p && (AKK_PREPS as readonly string[]).includes(f.p), 'choice', 4, 'Предлоги с Akkusativ', 'für, ohne, durch, gegen, um + Akkusativ.'),
    B.sortEx(
      'Akkusativ или Dativ?',
      'Какой падеж требует предлог?',
      ['+ Akkusativ', '+ Dativ'],
      shuffle(ctx.rng, [...AKK_PREPS.map((p) => ({ text: p, cat: 0 })), ...sample(ctx.rng, [...DAT_PREPS], 5).map((p) => ({ text: p, cat: 1 }))]),
    ),
  ],

  dativ: (ctx) => [
    B.asBank(ctx, B.framesEx(ctx, (f) => !!f.p && (DAT_PREPS as readonly string[]).includes(f.p), 'choice', 5, 'Предлоги с Dativ', 'mit, bei, zu, von, aus, nach + Dativ.')),
    B.framesEx(ctx, (f) => !f.p && f.case === 'dat', 'choice', 4, 'Глаголы с Dativ', 'helfen, danken, gehören, schenken (кому?) + Dativ.'),
    staticChoice(ctx, 'Личные местоимения', 'Выберите местоимение.', PRONOUN_ITEMS, 6),
    B.framesEx(ctx, isDatOrAkk, 'fill', 6, 'Akkusativ или Dativ?', 'Впишите артикль в нужном падеже.'),
    B.sortEx(
      'Akkusativ или Dativ?',
      'Какой падеж требует предлог?',
      ['+ Akkusativ', '+ Dativ'],
      shuffle(ctx.rng, [...sample(ctx.rng, [...AKK_PREPS], 4).map((p) => ({ text: p, cat: 0 })), ...DAT_PREPS.map((p) => ({ text: p, cat: 1 }))]),
    ),
  ],

  'konnektoren-a1': (ctx) => [
    B.connectorChoiceEx(ctx, ['aber', 'denn', 'oder'], 6),
    B.weilWriteEx(ctx, 'denn'),
    B.orderEx(ctx, { tense: 'pres', order: 'A', lead: 'dann', fixFirst: true, title: 'dann — инверсия', instruction: '«Dann» стоит на 1-й позиции, значит глагол — сразу после него.' }),
    B.connectorChoiceEx(ctx, ['aber', 'denn', 'oder'], 4),
    B.weilWriteEx(ctx, 'denn'),
  ],

  'praeteritum-basis': (ctx) => [
    B.conjEx(ctx, getVerb(pick(ctx.rng, ['sein', 'haben'])), 'praet'),
    B.asBank(ctx, B.fillVerb(ctx, { tense: 'praet', pred: (a) => a.v === 'sein' || a.v === 'haben', n: 4, title: 'war / hatte' })),
    B.fillVerb(ctx, { tense: 'praet', modal: true, n: 4, title: 'Модальные глаголы в Präteritum' }),
    B.conjEx(ctx, getVerb(pick(ctx.rng, ['können', 'müssen', 'wollen', 'dürfen'])), 'praet'),
    B.orderEx(ctx, { tense: 'praet', order: 'T', modal: true, fixFirst: true }),
    B.writeEx(ctx, { tense: 'praet', start: 'time', modal: true }),
  ],

  'praeteritum-verben': (ctx) => {
    const classVerbs = TABLE_VERBS.filter((v) => v.level !== 'B1' && v.cls && /^\d/.test(v.cls));
    const classes = shuffle(ctx.rng, [...new Set(classVerbs.map((v) => v.cls!))]).slice(0, 3);
    return [
      B.formsEx(B.themeVerbs(ctx, 4, (v) => v.kind === 'strong' || v.kind === 'mixed'), ['praet'], 'Präteritum сильных глаголов'),
      B.sortEx(
        'Ряды чередования гласных',
        'Распределите глаголы по рядам (как в таблице сильных глаголов).',
        classes.map((c) => CLASS_LABELS[c]),
        shuffle(
          ctx.rng,
          classes.flatMap((c, i) =>
            sample(ctx.rng, classVerbs.filter((v) => v.cls === c), 3).map((v) => ({ text: `${v.inf} – ${v.praet[0]} – ${v.pp[0]}`, cat: i })),
          ),
        ),
      ),
      B.fillVerb(ctx, { tense: 'praet', pred: (a) => a.verb.kind !== 'weak', n: 5, title: 'Präteritum: вставьте глагол' }),
      B.conjEx(ctx, pick(ctx.rng, B.themeVerbs(ctx, 4, (v) => v.kind === 'strong' && !v.refl)), 'praet'),
      B.matchEx(
        'Инфинитив — Präteritum',
        'Соедините инфинитив и форму Präteritum.',
        uniqueBy(B.themeVerbs(ctx, 8, (v) => v.kind !== 'weak' && !v.sep && !v.refl), (v) => v.praet[0])
          .slice(0, 5)
          .map((v) => [v.inf, v.praet[0]] as [string, string]),
      ),
      B.fillVerb(ctx, { tense: 'praet', pred: (a) => a.verb.kind === 'weak', n: 4, title: 'Präteritum слабых глаголов (-te)' }),
    ];
  },

  'verben-praep': (ctx) => [
    B.asBank(ctx, B.prepChoiceEx(ctx, 6)),
    B.matchEx(
      'Глагол — предлог',
      'Соедините глагол с его предлогом.',
      uniquePrepPairs(ctx),
    ),
    B.prepQuestionEx(ctx, 4),
    B.prepDaEx(ctx, 4),
    B.prepChoiceEx(ctx, 5),
  ],

  reflexiv: (ctx) => [
    B.conjEx(ctx, pick(ctx.rng, B.themeVerbs(ctx, 4, (v) => v.refl && !v.sep).concat([getVerb('sich freuen')]))),
    B.fillVerb(ctx, { tense: 'pres', pred: (a) => a.verb.refl, n: 5, title: 'Возвратные глаголы', instruction: 'Вставьте глагол вместе с возвратным местоимением там, где нужно.' }),
    B.orderEx(ctx, { tense: 'pres', order: 'T', pred: (a) => a.verb.refl, fixFirst: true }),
    staticChoice(ctx, 'mich или mir?', 'Если есть ещё одно дополнение в Akkusativ — местоимение в Dativ (mir, dir).', REFL_DAT_ITEMS, 6),
    B.orderEx(ctx, { tense: 'perf', order: 'S', pred: (a) => a.verb.refl, fixFirst: true }),
    B.writeEx(ctx, { tense: 'pres', pred: (a) => a.verb.refl }),
  ],

  nebensaetze: (ctx) => [
    B.connectorChoiceEx(ctx, ['weil', 'denn'], 4),
    B.subOrderEx(ctx, 'weil'),
    B.tableEx(ctx, { tense: pick(ctx.rng, ['pres', 'perf'] as const), order: 'SUB', lead: pick(ctx.rng, ['weil', 'dass', 'wenn']) }),
    B.weilWriteEx(ctx, 'weil'),
    B.subOrderEx(ctx, 'wenn'),
    B.choiceCorrectOrder(ctx, { tense: 'pres', order: 'SUB', lead: 'weil' }),
    B.weilWriteEx(ctx, 'dass'),
    B.weilWriteEx(ctx, 'wenn'),
    B.subOrderEx(ctx, 'dass', 'perf'),
  ],

  'deshalb-trotzdem': (ctx) => [
    B.connectorChoiceEx(ctx, ['weil', 'denn', 'deshalb', 'trotzdem'], 6),
    B.weilWriteEx(ctx, 'deshalb'),
    B.orderEx(ctx, { tense: 'pres', order: 'A', lead: 'deshalb', fixFirst: true, title: 'deshalb + инверсия' }),
    B.weilWriteEx(ctx, 'trotzdem'),
    B.orderEx(ctx, { tense: 'perf', order: 'A', lead: 'trotzdem', fixFirst: true, title: 'trotzdem + инверсия' }),
    B.orderEx(ctx, { tense: 'pres', order: 'A', lead: pick(ctx.rng, ['danach', 'zuerst', 'dann']), fixFirst: true, title: 'zuerst, dann, danach' }),
  ],

  wechselpraep: (ctx) => [
    B.wechselEx(ctx, 6),
    B.wechselVerbEx(ctx, 4),
    B.wechselEx(ctx, 6),
  ],
};

function uniqueBy<T>(xs: T[], key: (x: T) => string): T[] {
  const seen = new Set<string>();
  return xs.filter((x) => (seen.has(key(x)) ? false : (seen.add(key(x)), true)));
}

function isDatOrAkk(f: { p?: string; case?: string }) {
  return !f.p || (AKK_PREPS as readonly string[]).includes(f.p) || (DAT_PREPS as readonly string[]).includes(f.p);
}

function uniquePrepPairs(ctx: Ctx): [string, string][] {
  const seen = new Set<string>();
  const out: [string, string][] = [];
  for (const pv of shuffle(ctx.rng, PREP_VERBS.filter((p) => p.level !== 'B1'))) {
    const right = `${pv.prep} + ${pv.case === 'akk' ? 'Akk' : 'Dat'}`;
    if (seen.has(right) || seen.has(pv.verb)) continue;
    seen.add(right);
    seen.add(pv.verb);
    out.push([pv.verb, right]);
    if (out.length === 5) break;
  }
  return out;
}
