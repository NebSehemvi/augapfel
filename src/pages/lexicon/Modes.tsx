import { href } from '../../lib/router';
import { useProgress } from '../../lib/progress';
import { hasGender, LEARN_SIZE, LIVES, REVIEW_SIZE, scopeEntries, scopeStats, sessionEntries, SPEED_SECONDS, type LexMode } from '../../exercises/lexiconGame';
import { scopeQuery, type LexFilter } from './filter';
import s from './lexicon.module.css';

/** Ways to train, as in Memrise: learn new words, classic review, speed review — and for nouns a der/die/das round. */
export function Modes({ filter }: { filter: LexFilter }) {
  const progress = useProgress();
  const st = scopeStats(sessionEntries(filter, progress), progress);
  const modes: { mode: LexMode; icon: string; title: string; text: string; disabled: boolean; badge?: string }[] = [
    {
      mode: 'learn',
      icon: '🌱',
      title: 'Учить новые слова',
      text: st.fresh ? `По ${LEARN_SIZE} слов: сначала слово, потом карточки в обе стороны` : filter.kind === 'mine' ? 'Все ваши слова уже выучены' : 'Все слова этой подборки уже выучены',
      disabled: !st.fresh,
      badge: st.fresh ? `${st.fresh} новых` : undefined,
    },
    {
      mode: 'review',
      icon: '🔁',
      title: 'Классическое повторение',
      text: st.learned ? `${REVIEW_SIZE} слов: карточки и ввод с клавиатуры` : 'Сначала выучите несколько слов',
      disabled: !st.learned,
      badge: st.due ? `${st.due} пора повторить` : st.learned ? `${st.learned} выучено` : undefined,
    },
    {
      mode: 'speed',
      icon: '⚡',
      title: 'Быстрое повторение',
      text: st.learned ? `Карточки на время: ${SPEED_SECONDS} секунд на ответ, ${LIVES} жизни` : 'Сначала выучите несколько слов',
      disabled: !st.learned,
    },
  ];
  const nouns = filter.kind === 'noun' ? scopeEntries(filter, progress).filter(hasGender).length : 0;
  if (nouns)
    modes.push({
      mode: 'articles',
      icon: '🎨',
      title: 'der · die · das',
      text: `Артикли на скорость: все существительные подборки, ${SPEED_SECONDS} секунд, ${LIVES} жизни`,
      disabled: false,
      badge: `${nouns} слов`,
    });
  return (
    <div className={s.modes}>
      {modes.map((m) => (
        <a key={m.mode} className={`${s.mode} ${m.disabled ? s.modeOff : ''}`} href={m.disabled ? undefined : href(`/lexicon/${m.mode}?${scopeQuery(filter)}`)} aria-disabled={m.disabled || undefined}>
          <span className={s.modeIcon} aria-hidden>
            {m.icon}
          </span>
          <span className={s.modeBody}>
            <b>{m.title}</b>
            <span className={s.modeText}>{m.text}</span>
          </span>
          {m.badge && <span className={s.modeBadge}>{m.badge}</span>}
        </a>
      ))}
    </div>
  );
}
