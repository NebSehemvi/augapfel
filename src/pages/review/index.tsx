import { dueKeys, useProgress, INTERVALS } from '../../lib/progress';
import { href } from '../../lib/router';
import { plural } from '../../lib/format';
import { Button } from '../common/Button';
import { Muted } from '../common/Muted';
import { PageTitle } from '../common/PageTitle';
import { Panel } from '../common/Panel';
import { KIND_LABEL } from './describe';
import { WeakList } from './WeakList';
import s from './review.module.css';

export function ReviewPage() {
  const progress = useProgress();
  const due = dueKeys();
  const all = Object.entries(progress.srs);
  const byKind = due.reduce<Record<string, number>>((acc, k) => {
    const kind = k.split('|')[0];
    acc[kind] = (acc[kind] ?? 0) + 1;
    return acc;
  }, {});
  const weakest = all
    .filter(([, v]) => v.wrong > 0)
    .sort((a, b) => b[1].wrong - a[1].wrong || a[1].box - b[1].box)
    .slice(0, 12);
  const learned = all.filter(([, v]) => v.box >= 4).length;

  return (
    <div>
      <PageTitle>Повторение</PageTitle>
      <Panel>
        {due.length > 0 ? (
          <>
            <p className={s.big}>
              <b>{due.length}</b> {plural(due.length, 'карточка', 'карточки', 'карточек')} на сегодня
            </p>
            <ul className={s.kindList}>
              {Object.entries(byKind).map(([k, n]) => (
                <li key={k}>
                  {KIND_LABEL[k] ?? k}: <b>{n}</b>
                </li>
              ))}
            </ul>
            <Button href={href('/review/start')}>Повторить {Math.min(due.length, 30)} →</Button>
          </>
        ) : (
          <p className={s.big}>На сегодня всё повторено ✨</p>
        )}
        <Muted as="p">
          Сюда попадают ошибки из упражнений (формы глаголов, род и множественное число, предлоги, числа и время, сравнительная степень), и всё, что вы учите в разделе
          «Лексика». Правильный ответ отправляет карточку дальше: через {INTERVALS.slice(1, 6).join(', ')} … дней.
        </Muted>
      </Panel>

      <Panel title="Статистика">
        <p>
          Всего карточек: <b>{all.length}</b> · хорошо выучено: <b>{learned}</b>
        </p>
        {weakest.length > 0 && <WeakList items={weakest} />}
      </Panel>
    </div>
  );
}
