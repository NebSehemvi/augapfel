import { useState } from 'react';
import { PREP_VERBS } from '../../data/prepVerbs';
import { navigate } from '../../lib/router';
import { useProgress } from '../../lib/progress';
import { MODE_LABEL, POOL_LABEL, trainerVerbs, type TrainerMode, type TrainerPool } from '../../exercises/session';
import type { Level } from '../../grammar/types';
import { Button } from '../common/Button';
import { Field } from '../common/Field';
import { Muted } from '../common/Muted';
import { Panel } from '../common/Panel';
import { Chips } from '../common/Chips';

const POOLS = Object.keys(POOL_LABEL) as TrainerPool[];
const MODES = Object.keys(MODE_LABEL) as TrainerMode[];
const LEVELS: Level[] = ['A1', 'A2', 'B1'];

/** Verb trainer setup: which verbs, what to drill, level, how many. */
export function Trainer() {
  const progress = useProgress();
  const [pool, setPool] = useState<TrainerPool>('table');
  const [mode, setMode] = useState<TrainerMode>('forms');
  const [levels, setLevels] = useState<Level[]>(progress.settings.level === 'A1' ? ['A1'] : ['A1', 'A2']);
  const [count, setCount] = useState(12);

  const available = pool === 'prep' ? PREP_VERBS.filter((p) => levels.includes(p.level)).length : trainerVerbs({ pool, levels }).length;
  const toggleLevel = (l: Level) => setLevels((prev) => (prev.includes(l) ? (prev.length > 1 ? prev.filter((x) => x !== l) : prev) : [...prev, l]));

  const start = () => {
    const q = new URLSearchParams({ pool, mode, levels: levels.join(','), count: String(count) });
    navigate(`/verbs/train?${q}`);
  };

  return (
    <Panel title="Тренажёр">
      <Field label="Какие глаголы">
        <Chips options={POOLS} value={pool} label={(p) => POOL_LABEL[p]} onChange={setPool} />
      </Field>
      {pool !== 'prep' && (
        <Field label="Что тренируем">
          <Chips options={MODES} value={mode} label={(m) => MODE_LABEL[m]} onChange={setMode} />
        </Field>
      )}
      <Field label="Уровень">
        <Chips options={LEVELS} value={levels} label={(l) => (l === 'B1' ? 'B1 (редкие)' : l)} onChange={toggleLevel} />
      </Field>
      <Field label="Сколько">
        <Chips options={[6, 12, 20, 30]} value={count} label={(n) => String(n)} onChange={setCount} />
      </Field>
      <Button onClick={start} disabled={available === 0}>
        Начать ({Math.min(count, available)} из {available}) →
      </Button>
      <Muted as="p">Сначала идут глаголы, которые пора повторить, потом новые.</Muted>
    </Panel>
  );
}
