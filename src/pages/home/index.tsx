import { TOPICS } from '../../topics';
import { href } from '../../lib/router';
import { dueKeys, streak, updateSettings, useProgress } from '../../lib/progress';
import { plural } from '../../lib/format';
import { PageTitle } from '../common/PageTitle';
import { Segmented } from '../common/Segmented';
import { CardGroup } from '../common/CardGroup';
import { CardLink } from '../common/CardLink';
import { ScoreBadge } from '../common/ScoreBadge';
import { QuickCard } from './QuickCard';
import s from './home.module.css';

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
          <PageTitle
            sub={
              <>
                {days > 0 ? `🔥 ${days} ${plural(days, 'день', 'дня', 'дней')} подряд · ` : ''}
                {done} из {topics.length} тем {level} пройдено
              </>
            }
          >
            Hallo! 👋
          </PageTitle>
        </div>
        <Segmented
          ariaLabel="Уровень"
          value={level}
          onChange={(l) => updateSettings({ level: l })}
          options={[
            { value: 'A1', label: 'A1' },
            { value: 'A2', label: 'A2' },
          ]}
        />
      </section>

      <div className={s.quick}>
        <QuickCard
          href={href('/review')}
          icon="🔁"
          title="Повторение"
          sub={due > 0 ? `${due} ${plural(due, 'карточка ждёт', 'карточки ждут', 'карточек ждут')}` : 'Пока нечего повторять'}
          hot={due > 0}
        />
        <QuickCard href={href('/verbs')} icon="🔤" title="Глаголы" sub="Падеж, Perfekt и предлоги" />
        <QuickCard href={href('/texts')} icon="📰" title="Читать" sub="Тексты A1–A2 с переводом слов" />
      </div>

      {groups.map((g) => (
        <CardGroup key={g} title={g}>
          {topics
            .filter((t) => t.group === g)
            .map((t) => (
              <CardLink key={t.id} href={href(`/t/${t.id}`)} title={t.ru} sub={t.summary} badge={<ScoreBadge stat={progress.topics[t.id]} />} />
            ))}
        </CardGroup>
      ))}
    </div>
  );
}
