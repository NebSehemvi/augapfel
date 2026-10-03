import { useProgress } from '../lib/progress';
import { NOUN_FORM, genderOf } from '../grammar/articles';
import s from './Gendered.module.css';

/**
 * German text with the noun coloured by its gender (der blue, die red, das green; the plural part stays neutral).
 * Anything that isn't "article + noun" is shown as is — except a bare article with `article` (der/die/das buttons).
 * `plain` turns the colours off (e.g. on a marked answer card).
 */
export function Gendered({ text, plain, article }: { text: string; plain?: boolean; article?: boolean }) {
  const { settings } = useProgress();
  if (article && !plain && settings.genderColors && (text === 'der' || text === 'die' || text === 'das')) return <span className={s[text]}>{text}</span>;
  const g = genderOf(text);
  if (!g || plain || !settings.genderColors) return <>{text}</>;
  const m = NOUN_FORM.exec(text)!;
  return (
    <>
      <span className={s[g]}>
        {m[1]} {m[2]}
      </span>
      {m[3] && <span className={s.plural}>{m[3]}</span>}
    </>
  );
}
