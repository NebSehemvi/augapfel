import { useState } from 'react';
import { useProgress } from '../../lib/progress';
import { scopeEntries } from '../../exercises/lexiconGame';
import { PageTitle } from '../common/PageTitle';
import { FilterPanel } from './FilterPanel';
import { AddWord } from './AddWord';
import { LexiconList } from './LexiconList';
import { MyWordsList } from './MyWordsList';
import { Modes } from './Modes';
import { loadFilter, saveFilter, type LexFilter } from './filter';

/** `kind` opens a given part of the lexicon (the home page's "Глаголы" card links to /verbs). */
export function LexiconPage({ kind }: { kind?: LexFilter['kind'] }) {
  const progress = useProgress();
  const [filter, setFilterState] = useState<LexFilter>(() => {
    const f = loadFilter(progress.settings.level);
    return kind && kind !== f.kind ? { ...f, kind, group: 'all' } : f;
  });
  const setFilter = (f: LexFilter) => {
    setFilterState(f);
    saveFilter(f);
  };

  return (
    <div>
      <PageTitle sub="Существительные, глаголы (с падежом) и местоимения A1–A2 и ваши сохранённые слова. Ваши слова понемногу подмешиваются в любую подборку.">Лексика</PageTitle>
      <FilterPanel filter={filter} onChange={setFilter} />
      <Modes filter={filter} />
      {filter.kind === 'mine' ? (
        <>
          <AddWord />
          <MyWordsList />
        </>
      ) : (
        <LexiconList entries={scopeEntries(filter, progress)} />
      )}
    </div>
  );
}
