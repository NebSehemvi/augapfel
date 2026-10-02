export type Verdict = 'ok' | 'almost' | 'wrong';

export interface CheckResult {
  verdict: Verdict;
  /** the accepted answer closest to the input */
  expected: string;
  note?: string;
}

export interface CheckOptions {
  /** accept ae/oe/ue/ss for ä/ö/ü/ß */
  lenientUmlauts?: boolean;
  /** ignore commas (with a note) */
  lenientCommas?: boolean;
}

export function normalize(s: string): string {
  return s
    .replace(/[’‘]/g, "'")
    .replace(/[„“”]/g, '"')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?])/g, '$1')
    .trim()
    .replace(/[.!?]+$/, '')
    .trim();
}

function deUmlaut(s: string): string {
  return s
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/Ä/g, 'Ae')
    .replace(/Ö/g, 'Oe')
    .replace(/Ü/g, 'Ue')
    .replace(/ß/g, 'ss');
}

function noCommas(s: string): string {
  return s.replace(/,/g, '').replace(/\s+/g, ' ');
}

export function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[b.length];
}

/** Compare free input against accepted answers. */
export function checkText(input: string, accepted: string[], opts: CheckOptions = {}): CheckResult {
  const inp = normalize(input);
  const acc = accepted.map(normalize);
  if (acc.includes(inp)) return { verdict: 'ok', expected: accepted[acc.indexOf(inp)] };

  const lower = inp.toLowerCase();
  const iLower = acc.findIndex((a) => a.toLowerCase() === lower);
  if (iLower >= 0) return { verdict: 'ok', expected: accepted[iLower], note: 'Обратите внимание на заглавные буквы.' };

  if (opts.lenientUmlauts !== false) {
    const iU = acc.findIndex((a) => deUmlaut(a) === deUmlaut(inp));
    if (iU >= 0 && /[äöüßÄÖÜ]/.test(acc[iU])) {
      return { verdict: 'ok', expected: accepted[iU], note: 'Принято, но правильно пишется с ä/ö/ü/ß.' };
    }
  }

  if (opts.lenientCommas !== false) {
    const iC = acc.findIndex((a) => noCommas(a).toLowerCase() === noCommas(inp).toLowerCase());
    if (iC >= 0) return { verdict: 'ok', expected: accepted[iC], note: 'Не забывайте запятую перед придаточным.' };
  }

  // closest answer for feedback
  let best = 0;
  let bestD = Infinity;
  acc.forEach((a, i) => {
    const d = levenshtein(a.toLowerCase(), lower);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  const expected = accepted[best];
  if (bestD === 1 && acc[best].length >= 5) return { verdict: 'almost', expected, note: 'Почти! Одна опечатка.' };
  return { verdict: 'wrong', expected };
}

/** Word-level diff to show which words differ: returns expected words flagged when missing/misplaced in input. */
export function diffWords(input: string, expected: string): { word: string; ok: boolean }[] {
  const a = normalize(input).toLowerCase().split(' ');
  const b = normalize(expected).split(' ');
  // LCS on words
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j].toLowerCase() ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const okIdx = new Set<number>();
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j].toLowerCase()) {
      okIdx.add(j);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return b.map((word, k) => ({ word, ok: okIdx.has(k) }));
}
