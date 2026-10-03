import type { Case, Gender, Noun } from './types';

export type ArticleType = 'def' | 'indef' | 'kein' | 'mein' | 'none';

const DEF: Record<Gender, Record<Case, string>> = {
  m: { nom: 'der', akk: 'den', dat: 'dem' },
  f: { nom: 'die', akk: 'die', dat: 'der' },
  n: { nom: 'das', akk: 'das', dat: 'dem' },
  pl: { nom: 'die', akk: 'die', dat: 'den' },
};

const EIN_ENDINGS: Record<Gender, Record<Case, string>> = {
  m: { nom: '', akk: 'en', dat: 'em' },
  f: { nom: 'e', akk: 'e', dat: 'er' },
  n: { nom: '', akk: '', dat: 'em' },
  pl: { nom: 'e', akk: 'e', dat: 'en' },
};

export function article(type: ArticleType, g: Gender, c: Case): string {
  switch (type) {
    case 'def':
      return DEF[g][c];
    case 'indef':
      if (g === 'pl') return '';
      return 'ein' + EIN_ENDINGS[g][c];
    case 'kein':
      return 'kein' + EIN_ENDINGS[g][c];
    case 'mein':
      return 'mein' + EIN_ENDINGS[g][c];
    case 'none':
      return '';
  }
}

/** Noun form for the case (singular or plural). */
export function nounForm(n: Noun, c: Case, plural: boolean): string {
  if (plural) {
    const pl = n.pl ?? n.de;
    if (c === 'dat' && !/[ns]$/.test(pl)) return pl + 'n';
    return pl;
  }
  if (n.weak && c !== 'nom') return n.weak;
  return n.de;
}

export function nounPhrase(type: ArticleType, n: Noun, c: Case, plural = false): string {
  const g: Gender = plural ? 'pl' : n.g;
  const art = article(type, g, c);
  const form = nounForm(n, c, plural);
  return art ? `${art} ${form}` : form;
}

export const DAT_PREPS = ['mit', 'bei', 'zu', 'von', 'aus', 'nach', 'seit'] as const;
export const AKK_PREPS = ['für', 'ohne', 'durch', 'gegen', 'um'] as const;
export const WECHSEL_PREPS = ['in', 'an', 'auf', 'unter', 'über', 'vor', 'hinter', 'neben', 'zwischen'] as const;

export function prepCase(p: string): Case | null {
  if ((DAT_PREPS as readonly string[]).includes(p)) return 'dat';
  if ((AKK_PREPS as readonly string[]).includes(p)) return 'akk';
  return null;
}

/** Common contractions: zu dem → zum, in das → ins ... */
const CONTRACT: Record<string, string> = {
  'zu dem': 'zum',
  'zu der': 'zur',
  'bei dem': 'beim',
  'von dem': 'vom',
  'in dem': 'im',
  'in das': 'ins',
  'an dem': 'am',
  'an das': 'ans',
  'auf das': 'aufs',
};

export function contract(prep: string, art: string): string | null {
  return CONTRACT[`${prep} ${art}`] ?? null;
}

export const GENDER_ART: Record<Exclude<Gender, 'pl'>, string> = { m: 'der', f: 'die', n: 'das' };

/** Dictionary form with article: "der Sohn"; plural-only nouns: "die Eltern (мн.)". */
export function nounLemma(n: Noun): string {
  return n.g === 'pl' ? `die ${n.de} (мн.)` : `${GENDER_ART[n.g]} ${n.de}`;
}

/**
 * How a German noun is shown in cards and popups: "der Sohn / die Söhne".
 * `pl` null = no plural; undefined = unknown; plural-only and article-less words stay as they are.
 */
export function withPlural(lemma: string, pl: string | null | undefined): string {
  if (!pl || !/^(der|die|das) /.test(lemma) || lemma.endsWith('(мн.)')) return lemma;
  return `${lemma} / die ${pl}`;
}

// ---- plural classification (for sorting exercises) ----

export function umlaut(word: string): string {
  const map: Record<string, string> = { a: 'ä', o: 'ö', u: 'ü', A: 'Ä', O: 'Ö', U: 'Ü' };
  for (let i = word.length - 1; i >= 0; i--) {
    const ch = word[i];
    if (map[ch]) {
      if ((ch === 'u' || ch === 'U') && i > 0 && (word[i - 1] === 'a' || word[i - 1] === 'A')) {
        return word.slice(0, i - 1) + (word[i - 1] === 'A' ? 'Äu' : 'äu') + word.slice(i + 1);
      }
      return word.slice(0, i) + map[ch] + word.slice(i + 1);
    }
  }
  return word;
}

export type PluralType = '-/¨-' | '-(e)n' | '-e/¨-e' | '-er/¨-er' | '-s';
export const PLURAL_TYPES: PluralType[] = ['-/¨-', '-(e)n', '-e/¨-e', '-er/¨-er', '-s'];

export function pluralType(n: Noun): PluralType | null {
  const s = n.de;
  const p = n.pl;
  if (!p) return null;
  const u = umlaut(s);
  if (p === s || p === u) return '-/¨-';
  if (p === s + 's') return '-s';
  if (p === s + 'n' || p === s + 'en' || p === s + 'nen') return '-(e)n';
  if (p === s + 'e' || p === u + 'e') return '-e/¨-e';
  if (p === s + 'er' || p === u + 'er') return '-er/¨-er';
  return null;
}

/** "article + noun" as shown in the app, with an optional " / plural" part */
export const NOUN_FORM = /^(der|die|das) ([A-ZÄÖÜ].*?)( \/ .*)?$/;

/** Gender of a noun phrase as shown in the app: "der Sohn / die Söhne" → der; "die Eltern (мн.)" → pl. */
export function genderOf(text: string): 'der' | 'die' | 'das' | 'pl' | null {
  const m = NOUN_FORM.exec(text);
  if (!m) return null;
  return m[2].endsWith('(мн.)') ? 'pl' : (m[1] as 'der' | 'die' | 'das');
}
