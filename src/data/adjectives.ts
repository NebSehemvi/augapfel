/*
 * A1/A2 adjectives (and gern / viel / oft) with comparative and superlative.
 * Row format: base|comparative|superlative (without "am")|ru
 */
export interface Adjective {
  base: string;
  comp: string;
  /** superlative stem, used as "am …": am ältesten */
  sup: string;
  ru: string;
  /** comparative is not just base + -er (umlaut, gut → besser, teuer → teurer …) */
  irregular: boolean;
}

const ROWS = `
alt|älter|ältesten|старый
jung|jünger|jüngsten|молодой
groß|größer|größten|большой, высокий
klein|kleiner|kleinsten|маленький
lang|länger|längsten|длинный, долгий
kurz|kürzer|kürzesten|короткий
warm|wärmer|wärmsten|тёплый
kalt|kälter|kältesten|холодный
heiß|heißer|heißesten|жаркий
schnell|schneller|schnellsten|быстрый
langsam|langsamer|langsamsten|медленный
teuer|teurer|teuersten|дорогой
billig|billiger|billigsten|дешёвый
schön|schöner|schönsten|красивый
interessant|interessanter|interessantesten|интересный
gemütlich|gemütlicher|gemütlichsten|уютный
hell|heller|hellsten|светлый
laut|lauter|lautesten|громкий
schwer|schwerer|schwersten|тяжёлый, трудный
stark|stärker|stärksten|сильный
früh|früher|frühesten|ранний
hoch|höher|höchsten|высокий
nah|näher|nächsten|близкий
gut|besser|besten|хороший
viel|mehr|meisten|много
gern|lieber|liebsten|охотно
oft|öfter|häufigsten|часто
`;

export const ADJECTIVES: Adjective[] = ROWS.trim()
  .split('\n')
  .map((line) => {
    const [base, comp, sup, ru] = line.split('|');
    return { base, comp, sup, ru, irregular: comp !== base + 'er' };
  });

const BY_BASE = new Map(ADJECTIVES.map((a) => [a.base, a]));

export function getAdjective(base: string): Adjective {
  const a = BY_BASE.get(base);
  if (!a) throw new Error(`Unknown adjective: ${base}`);
  return a;
}

export const hasAdjective = (base: string) => BY_BASE.has(base);
