import type { Level } from '../grammar/types';

export interface PrepVerb {
  /** verb key (with "sich " for reflexive verbs) */
  verb: string;
  /** Display form, e.g. "Angst haben" when it differs from the verb */
  display?: string;
  prep: string;
  case: 'akk' | 'dat';
  ru: string;
  en: string;
  level: Level;
  /** Example complement for theme-independent exercises */
  ex: string;
}

// verb|prep|case|ru|en|level|example complement
const ROWS = `
denken|an|akk|думать о|to think of|A2|an den Urlaub
warten|auf|akk|ждать (кого/что)|to wait for|A1|auf den Bus
sich freuen|auf|akk|радоваться (будущему)|to look forward to|A2|auf das Wochenende
sich freuen|über|akk|радоваться (тому, что есть)|to be happy about|A2|über das Geschenk
sich interessieren|für|akk|интересоваться|to be interested in|A2|für Musik
sprechen|über|akk|говорить о|to talk about|A2|über das Wetter
sprechen|mit|dat|говорить с|to talk to|A1|mit dem Lehrer
träumen|von|dat|мечтать о|to dream of|A2|von einer Reise
teilnehmen|an|dat|участвовать в|to take part in|A2|an einem Kurs
fragen|nach|dat|спрашивать о|to ask about|A2|nach dem Weg
sich kümmern|um|akk|заботиться о|to take care of|A2|um die Kinder
sich erinnern|an|akk|вспоминать (о)|to remember|A2|an die Reise
glauben|an|akk|верить в|to believe in|A2|an die Liebe
bitten|um|akk|просить о|to ask for|A2|um Hilfe
sich ärgern|über|akk|злиться на|to be annoyed about|A2|über den Lärm
helfen|bei|dat|помогать с|to help with|A2|bei den Hausaufgaben
telefonieren|mit|dat|говорить по телефону с|to talk on the phone with|A1|mit der Mutter
sich treffen|mit|dat|встречаться с|to meet with|A2|mit Freunden
sich verabreden|mit|dat|договориться о встрече с|to make a date with|A2|mit einer Freundin
sich beschweren|über|akk|жаловаться на|to complain about|A2|über das Essen
sich bewerben|um|akk|претендовать на (место)|to apply for|A2|um eine Stelle
sich entschuldigen|für|akk|извиняться за|to apologise for|A2|für den Fehler
achten|auf|akk|обращать внимание на|to pay attention to|A2|auf die Grammatik
antworten|auf|akk|отвечать на|to reply to|A2|auf die E-Mail
sich gewöhnen|an|akk|привыкать к|to get used to|A2|an das Wetter
sich konzentrieren|auf|akk|сосредоточиться на|to concentrate on|A2|auf die Arbeit
sich unterhalten|über|akk|беседовать о|to chat about|A2|über den Film
sich verlieben|in|akk|влюбиться в|to fall in love with|A2|in eine Kollegin
erzählen|von|dat|рассказывать о|to tell about|A2|von der Reise
lachen|über|akk|смеяться над|to laugh about|A2|über den Witz
diskutieren|über|akk|дискутировать о|to discuss|A2|über das Problem
sich vorbereiten|auf|akk|готовиться к|to prepare for|A2|auf die Prüfung
aufhören|mit|dat|прекращать|to stop (doing)|A2|mit dem Rauchen
anfangen|mit|dat|начинать (что-то)|to start (with)|A2|mit der Arbeit
beginnen|mit|dat|начинать (что-то)|to begin (with)|A2|mit dem Kurs
sich bedanken|für|akk|благодарить за|to thank for|A2|für die Einladung
sich anmelden|für|akk|записываться на|to sign up for|A2|für einen Kurs
suchen|nach|dat|искать (что-то)|to search for|A2|nach einem Geschenk
sich entscheiden|für|akk|выбрать, решиться на|to decide on|B1|für die blaue Jacke
sich beschäftigen|mit|dat|заниматься чем-то|to deal with|B1|mit dem Thema
`;

export const PREP_VERBS: PrepVerb[] = ROWS.trim()
  .split('\n')
  .map((line) => {
    const [verb, prep, c, ru, en, level, ex] = line.split('|');
    return { verb, prep, case: c as 'akk' | 'dat', ru, en, level: level as Level, ex };
  });

export function prepVerbId(pv: PrepVerb): string {
  return `${pv.verb}+${pv.prep}`;
}

export function findPrepVerb(verb: string, prep: string): PrepVerb | undefined {
  return PREP_VERBS.find((p) => p.verb === verb && p.prep === prep);
}

/** worauf / wofür / womit … */
export function woForm(prep: string): string {
  return (/^[aeiouäöü]/.test(prep) ? 'wor' : 'wo') + prep;
}

/** darauf / dafür / damit … */
export function daForm(prep: string): string {
  return (/^[aeiouäöü]/.test(prep) ? 'dar' : 'da') + prep;
}

export const ALL_PREPS = ['an', 'auf', 'für', 'über', 'mit', 'von', 'um', 'nach', 'bei', 'in', 'zu', 'vor'];
