import { describe, expect, it } from 'vitest';
import { dateDat, dateNom, formalTime, informalTimes, numberWord, numberWords, ordinalStem, priceText, priceWord, yearWord } from './numbers';

describe('numbers', () => {
  it('spells numbers', () => {
    const cases: [number, string][] = [
      [0, 'null'],
      [1, 'eins'],
      [7, 'sieben'],
      [11, 'elf'],
      [16, 'sechzehn'],
      [17, 'siebzehn'],
      [21, 'einundzwanzig'],
      [30, 'dreißig'],
      [67, 'siebenundsechzig'],
      [70, 'siebzig'],
      [99, 'neunundneunzig'],
      [100, 'hundert'],
      [101, 'hunderteins'],
      [121, 'hunderteinundzwanzig'],
      [340, 'dreihundertvierzig'],
      [1000, 'tausend'],
      [2024, 'zweitausendvierundzwanzig'],
      [9999, 'neuntausendneunhundertneunundneunzig'],
    ];
    for (const [n, w] of cases) expect(numberWord(n), String(n)).toBe(w);
    expect(numberWords(100)).toEqual(['hundert', 'einhundert']);
    expect(numberWords(250)).toEqual(['zweihundertfünfzig']);
  });

  it('says years in hundreds before 2000', () => {
    expect(yearWord(1989)).toBe('neunzehnhundertneunundachtzig');
    expect(yearWord(1900)).toBe('neunzehnhundert');
    expect(yearWord(2005)).toBe('zweitausendfünf');
  });

  it('reads prices', () => {
    expect(priceText(349)).toBe('3,49 €');
    expect(priceText(1205)).toBe('12,05 €');
    expect(priceWord(349)).toBe('drei Euro neunundvierzig');
    expect(priceWord(100)).toBe('ein Euro');
    expect(priceWord(150)).toBe('ein Euro fünfzig');
    expect(priceWord(50)).toBe('fünfzig Cent');
    expect(priceWord(2101)).toBe('einundzwanzig Euro eins');
  });

  it('tells the time, formally and in everyday German', () => {
    expect(formalTime(15, 30)).toBe('fünfzehn Uhr dreißig');
    expect(formalTime(1, 0)).toBe('ein Uhr');
    expect(formalTime(21, 5)).toBe('einundzwanzig Uhr fünf');
    expect(informalTimes(15, 30)).toEqual(['halb vier']);
    expect(informalTimes(3, 15)).toEqual(['Viertel nach drei']);
    expect(informalTimes(7, 45)).toEqual(['Viertel vor acht']);
    expect(informalTimes(12, 30)).toEqual(['halb eins']);
    expect(informalTimes(0, 0)).toEqual(['zwölf']);
    expect(informalTimes(13, 0)).toEqual(['eins']);
    expect(informalTimes(9, 10)).toEqual(['zehn nach neun']);
    expect(informalTimes(9, 20)).toEqual(['zwanzig nach neun', 'zehn vor halb zehn']);
    expect(informalTimes(9, 25)).toEqual(['fünf vor halb zehn']);
    expect(informalTimes(9, 35)).toEqual(['fünf nach halb zehn']);
    expect(informalTimes(9, 40)).toEqual(['zwanzig vor zehn', 'zehn nach halb zehn']);
    expect(informalTimes(9, 55)).toEqual(['fünf vor zehn']);
  });

  it('builds ordinals and dates', () => {
    expect([1, 2, 3, 4, 7, 8, 12, 19, 20, 21, 31].map(ordinalStem)).toEqual(['erst', 'zweit', 'dritt', 'viert', 'siebt', 'acht', 'zwölft', 'neunzehnt', 'zwanzigst', 'einundzwanzigst', 'einunddreißigst']);
    expect(dateNom(3, 4)).toBe('der dritte Mai');
    expect(dateDat(1, 0)).toBe('am ersten Januar');
    expect(dateDat(24, 11)).toBe('am vierundzwanzigsten Dezember');
  });
});
