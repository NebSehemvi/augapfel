import { THEMES } from '../../data/themes';
import { GENERAL_GROUP } from '../../data/lexicon';
import { PRONOUN_GROUP_LABEL } from '../../data/pronouns';
import type { Level } from '../../grammar/types';
import { Chips } from '../common/Chips';
import { Field } from '../common/Field';
import { Panel } from '../common/Panel';
import type { LexFilter } from './filter';

const LEVELS: Level[] = ['A1', 'A2'];
const KINDS: { value: LexFilter['kind']; label: string }[] = [
  { value: 'noun', label: 'Существительные' },
  { value: 'pron', label: 'Местоимения' },
  { value: 'mine', label: '⭐ Мои слова' },
];

/** Nouns, pronouns or saved words; theme / group and level for the first two. */
export function FilterPanel({ filter, onChange }: { filter: LexFilter; onChange: (f: LexFilter) => void }) {
  const groups =
    filter.kind === 'noun'
      ? [{ id: 'all', label: 'Все темы' }, ...THEMES.map((t) => ({ id: t.id, label: `${t.emoji} ${t.name.ru}` })), GENERAL_GROUP]
      : [{ id: 'all', label: 'Все' }, ...Object.entries(PRONOUN_GROUP_LABEL).map(([id, label]) => ({ id, label }))];
  const toggleLevel = (l: Level) =>
    onChange({ ...filter, levels: filter.levels.includes(l) ? (filter.levels.length > 1 ? filter.levels.filter((x) => x !== l) : filter.levels) : [...filter.levels, l] });

  return (
    <Panel>
      <Field label="Что учим">
        <Chips options={KINDS.map((k) => k.value)} value={filter.kind} label={(k) => KINDS.find((x) => x.value === k)!.label} onChange={(kind) => onChange({ ...filter, kind, group: 'all' })} />
      </Field>
      {filter.kind !== 'mine' && (
        <>
          <Field label={filter.kind === 'noun' ? 'Тема' : 'Группа'}>
            <Chips options={groups.map((g) => g.id)} value={filter.group} label={(id) => groups.find((g) => g.id === id)!.label} onChange={(group) => onChange({ ...filter, group })} />
          </Field>
          <Field label="Уровень">
            <Chips options={LEVELS} value={filter.levels} label={(l) => l} onChange={toggleLevel} />
          </Field>
        </>
      )}
    </Panel>
  );
}
