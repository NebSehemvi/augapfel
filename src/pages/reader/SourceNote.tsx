import { sourceLabel, type ReadingText } from '../../data/texts';
import s from './reader.module.css';

/** Attribution of the article a text is based on. */
export function SourceNote({ text }: { text: ReadingText }) {
  const label = sourceLabel(text);
  if (!label) return null;
  return (
    <p className={s.source}>
      {text.sourceUrl ? (
        <a href={text.sourceUrl} target="_blank" rel="noreferrer">
          {label}
        </a>
      ) : (
        label
      )}
    </p>
  );
}
