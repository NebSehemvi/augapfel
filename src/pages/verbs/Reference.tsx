import { useState } from 'react';
import { Panel } from '../common/Panel';
import { TextInput } from '../common/TextInput';
import { Chips } from './Chips';
import { PrepList } from './PrepList';
import { VerbList } from './VerbList';

type ListFilter = 'strong' | 'all' | 'prep';
const FILTER_LABEL: Record<ListFilter, string> = { strong: 'Сильные и неправильные', all: 'Все', prep: 'С предлогами' };

/** Searchable verb reference (all verbs, strong verbs, verbs with prepositions). */
export function Reference() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ListFilter>('strong');
  return (
    <Panel title="Справочник">
      <TextInput placeholder="Поиск: fahren, ехать, fuhr…" value={query} onValue={setQuery} lang="de" autoCapitalize="off" autoCorrect="off" />
      <Chips options={['strong', 'all', 'prep'] as const} value={filter} label={(f) => FILTER_LABEL[f]} onChange={setFilter} />
      {filter === 'prep' ? <PrepList query={query} /> : <VerbList query={query} strongOnly={filter === 'strong'} />}
    </Panel>
  );
}
