import { dueKeys, useProgress, INTERVALS } from '../lib/progress';
import { href } from '../lib/router';
import { hasVerb, getVerb } from '../data/verbs';
import { verbLabel } from '../exercises/builders';
import { plural } from '../lib/format';
import s from './pages.module.css';

const KIND_LABEL: Record<string, string> = { v: 'Формы глаголов', n: 'Существительные (род, мн. ч.)', p: 'Глаголы с предлогами' };
const FORM_LABEL: Record<string, string> = { pres: 'Präsens', praet: 'Präteritum', pp: 'Partizip II', aux: 'haben/sein', inf: 'перевод', g: 'род', pl: 'мн. ч.' };

function describe(key: string): string {
  const [kind, a, b] = key.split('|');
  if (kind === 'v') return `${hasVerb(a) ? verbLabel(getVerb(a)) : a} — ${FORM_LABEL[b] ?? b}`;
  if (kind === 'n') return `${a} — ${FORM_LABEL[b] ?? b}`;
  if (kind === 'p') return `${a} ${b} …`;
  return key;
}

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
      <h1 className={s.h1}>Повторение</h1>
      <section className={s.panel}>
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
            <a className={s.startBtn} href={href('/review/start')}>
              Повторить {Math.min(due.length, 30)} →
            </a>
          </>
        ) : (
          <p className={s.big}>На сегодня всё повторено ✨</p>
        )}
        <p className={s.muted}>
          Сюда попадают ошибки из упражнений (формы глаголов, род и множественное число, предлоги) и всё, что вы тренируете в разделе
          «Глаголы». Правильный ответ отправляет карточку дальше: через {INTERVALS.slice(1, 6).join(', ')} … дней.
        </p>
      </section>

      <section className={s.panel}>
        <h2 className={s.panelTitle}>Статистика</h2>
        <p>
          Всего карточек: <b>{all.length}</b> · хорошо выучено: <b>{learned}</b>
        </p>
        {weakest.length > 0 && (
          <>
            <h3 className={s.panelSub}>Чаще всего ошибки</h3>
            <ul className={s.weakList}>
              {weakest.map(([k, v]) => (
                <li key={k}>
                  <span lang="de">{describe(k)}</span>
                  <span className={s.muted}>
                    ✗ {v.wrong} · {'●'.repeat(v.box) || '○'}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
