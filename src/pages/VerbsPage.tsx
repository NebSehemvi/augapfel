import { useMemo, useState, type ReactNode } from 'react';
import { VERBS, verbKey, CLASS_LABELS } from '../data/verbs';
import { PREP_VERBS } from '../data/prepVerbs';
import { pres3, praet3 } from '../grammar/conjugate';
import { navigate } from '../lib/router';
import { useProgress } from '../lib/progress';
import { MODE_LABEL, POOL_LABEL, trainerVerbs, type TrainerMode, type TrainerPool } from '../exercises/session';
import { srsKey, verbLabel } from '../exercises/builders';
import type { Level } from '../grammar/types';
import { LevelBadge } from './common';
import s from './pages.module.css';

const POOLS = Object.keys(POOL_LABEL) as TrainerPool[];
const MODES = Object.keys(MODE_LABEL) as TrainerMode[];

export function VerbsPage() {
  const progress = useProgress();
  const [pool, setPool] = useState<TrainerPool>('table');
  const [mode, setMode] = useState<TrainerMode>('forms');
  const [levels, setLevels] = useState<Level[]>(progress.settings.level === 'A1' ? ['A1'] : ['A1', 'A2']);
  const [count, setCount] = useState(12);
  const [query, setQuery] = useState('');
  const [listFilter, setListFilter] = useState<'all' | 'strong' | 'prep'>('strong');

  const available = pool === 'prep' ? PREP_VERBS.filter((p) => levels.includes(p.level)).length : trainerVerbs({ pool, levels }).length;
  const toggleLevel = (l: Level) => setLevels((prev) => (prev.includes(l) ? (prev.length > 1 ? prev.filter((x) => x !== l) : prev) : [...prev, l]));

  const start = () => {
    const q = new URLSearchParams({ pool, mode, levels: levels.join(','), count: String(count) });
    navigate(`/verbs/train?${q}`);
  };

  return (
    <div>
      <h1 className={s.h1}>Глаголы</h1>
      <section className={s.panel}>
        <h2 className={s.panelTitle}>Тренажёр</h2>
        <Field label="Какие глаголы">
          <Chips options={POOLS} value={pool} label={(p) => POOL_LABEL[p]} onChange={setPool} />
        </Field>
        {pool !== 'prep' && (
          <Field label="Что тренируем">
            <Chips options={MODES} value={mode} label={(m) => MODE_LABEL[m]} onChange={setMode} />
          </Field>
        )}
        <Field label="Уровень">
          <div className={s.chips}>
            {(['A1', 'A2', 'B1'] as Level[]).map((l) => (
              <button key={l} type="button" className={`${s.chip} ${levels.includes(l) ? s.chipOn : ''}`} onClick={() => toggleLevel(l)}>
                {l}
                {l === 'B1' ? ' (редкие)' : ''}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Сколько">
          <Chips options={[6, 12, 20, 30]} value={count} label={(n) => String(n)} onChange={setCount} />
        </Field>
        <button className={s.startBtn} onClick={start} disabled={available === 0}>
          Начать ({Math.min(count, available)} из {available}) →
        </button>
        <p className={s.muted}>Сначала идут глаголы, которые пора повторить, потом новые.</p>
      </section>

      <section className={s.panel}>
        <h2 className={s.panelTitle}>Справочник</h2>
        <input className={s.search} placeholder="Поиск: fahren, ехать, fuhr…" value={query} onChange={(e) => setQuery(e.target.value)} lang="de" autoCapitalize="off" autoCorrect="off" />
        <div className={s.chips}>
          <Chips
            options={['strong', 'all', 'prep'] as const}
            value={listFilter}
            label={(f) => (f === 'strong' ? 'Сильные и неправильные' : f === 'all' ? 'Все' : 'С предлогами')}
            onChange={setListFilter}
          />
        </div>
        {listFilter === 'prep' ? <PrepList query={query} /> : <VerbList query={query} strongOnly={listFilter === 'strong'} />}
      </section>
    </div>
  );
}

function VerbList({ query, strongOnly }: { query: string; strongOnly: boolean }) {
  const progress = useProgress();
  const q = query.trim().toLowerCase();
  const verbs = useMemo(
    () =>
      VERBS.filter((v) => (!strongOnly || v.kind !== 'weak') && (!q || [v.inf, v.ru, v.en, v.praet.join(' '), v.pp.join(' ')].join(' ').toLowerCase().includes(q))).sort(
        (a, b) => a.inf.localeCompare(b.inf, 'de'),
      ),
    [q, strongOnly],
  );
  return (
    <ul className={s.verbList}>
      {verbs.slice(0, 300).map((v) => {
        const srs = progress.srs[srsKey.pp(v)];
        return (
          <li key={verbKey(v)} className={s.verbRow}>
            <div className={s.verbTop}>
              <b lang="de">{verbLabel(v)}</b>
              <span className={s.muted}>{v.ru}</span>
              <span className={s.verbBadges}>
                {srs && <span className={s.box} title="Уровень запоминания">{'●'.repeat(Math.min(srs.box, 6)) || '○'}</span>}
                <LevelBadge level={v.level} />
              </span>
            </div>
            <div className={s.verbForms} lang="de">
              {pres3(v)} · {praet3(v)[0]} · {v.aux[0] === 'sein' ? 'ist' : 'hat'} {v.pp[0]}
              {v.cls && CLASS_LABELS[v.cls] && <span className={s.cls}> {CLASS_LABELS[v.cls]}</span>}
            </div>
          </li>
        );
      })}
      {verbs.length === 0 && <li className={s.muted}>Ничего не найдено</li>}
    </ul>
  );
}

function PrepList({ query }: { query: string }) {
  const q = query.trim().toLowerCase();
  const list = PREP_VERBS.filter((p) => !q || `${p.verb} ${p.prep} ${p.ru} ${p.en}`.toLowerCase().includes(q));
  return (
    <ul className={s.verbList}>
      {list.map((p) => (
        <li key={`${p.verb}+${p.prep}`} className={s.verbRow}>
          <div className={s.verbTop}>
            <b lang="de">
              {p.verb} {p.prep} + {p.case === 'akk' ? 'Akk' : 'Dat'}
            </b>
            <span className={s.muted}>{p.ru}</span>
            <span className={s.verbBadges}>
              <LevelBadge level={p.level} />
            </span>
          </div>
          <div className={s.verbForms} lang="de">
            {p.ex}
          </div>
        </li>
      ))}
    </ul>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={s.field}>
      <div className={s.fieldLabel}>{label}</div>
      {children}
    </div>
  );
}

function Chips<T extends string | number>({ options, value, label, onChange }: { options: readonly T[]; value: T; label: (x: T) => string; onChange: (x: T) => void }) {
  return (
    <div className={s.chips}>
      {options.map((o) => (
        <button key={String(o)} type="button" className={`${s.chip} ${o === value ? s.chipOn : ''}`} onClick={() => onChange(o)}>
          {label(o)}
        </button>
      ))}
    </div>
  );
}
