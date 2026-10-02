import { TOPICS } from '../topics';
import { href } from '../lib/router';
import { dueKeys, streak, updateSettings, useProgress } from '../lib/progress';
import { ScoreBadge } from './common';
import { plural } from '../lib/format';
import s from './pages.module.css';

export function Home() {
  const progress = useProgress();
  const level = progress.settings.level;
  const due = dueKeys().length;
  const days = streak();
  const topics = TOPICS.filter((t) => t.level === level);
  const groups = [...new Set(topics.map((t) => t.group))];
  const done = topics.filter((t) => progress.topics[t.id]).length;

  return (
    <div>
      <section className={s.hero}>
        <div>
          <h1 className={s.h1}>Hallo! 👋</h1>
          <p className={s.sub}>
            {days > 0 ? `🔥 ${days} ${plural(days, 'день', 'дня', 'дней')} подряд · ` : ''}
            {done} из {topics.length} тем {level} пройдено
          </p>
        </div>
        <div className={s.segment} role="tablist" aria-label="Уровень">
          {(['A1', 'A2'] as const).map((l) => (
            <button key={l} role="tab" aria-selected={level === l} className={`${s.segBtn} ${level === l ? s.segOn : ''}`} onClick={() => updateSettings({ level: l })}>
              {l}
            </button>
          ))}
        </div>
      </section>

      <div className={s.quick}>
        <a className={`${s.quickCard} ${due > 0 ? s.quickHot : ''}`} href={href('/review')}>
          <span className={s.quickIcon}>🔁</span>
          <span>
            <b>Повторение</b>
            <span className={s.quickSub}>{due > 0 ? `${due} ${plural(due, 'карточка ждёт', 'карточки ждут', 'карточек ждут')}` : 'Пока нечего повторять'}</span>
          </span>
        </a>
        <a className={s.quickCard} href={href('/verbs')}>
          <span className={s.quickIcon}>🔤</span>
          <span>
            <b>Тренажёр глаголов</b>
            <span className={s.quickSub}>Таблица сильных глаголов</span>
          </span>
        </a>
        <a className={s.quickCard} href={href('/texts')}>
          <span className={s.quickIcon}>📰</span>
          <span>
            <b>Читать</b>
            <span className={s.quickSub}>Тексты A1–A2 с переводом слов</span>
          </span>
        </a>
      </div>

      {groups.map((g) => (
        <section key={g} className={s.group}>
          <h2 className={s.groupTitle}>{g}</h2>
          <div className={s.cards}>
            {topics
              .filter((t) => t.group === g)
              .map((t) => {
                const st = progress.topics[t.id];
                return (
                  <a key={t.id} className={s.card} href={href(`/t/${t.id}`)}>
                    <div className={s.cardMain}>
                      <div className={s.cardTitle}>{t.ru}</div>
                      <div className={s.cardDe} lang="de">
                        {t.summary}
                      </div>
                    </div>
                    <ScoreBadge stat={st} />
                  </a>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
}
