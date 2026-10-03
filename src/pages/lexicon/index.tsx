import { useState } from 'react';
import { useProgress } from '../../lib/progress';
import { scopeEntries } from '../../exercises/lexiconGame';
import { PageTitle } from '../common/PageTitle';
import { WordsTabs } from '../common/WordsTabs';
import { FilterPanel } from './FilterPanel';
import { AddWord } from './AddWord';
import { LexiconList } from './LexiconList';
import { MyWordsList } from './MyWordsList';
import { Modes } from './Modes';
import { loadFilter, saveFilter, type LexFilter } from './filter';

export function LexiconPage() {
  const progress = useProgress();
  const [filter, setFilterState] = useState<LexFilter>(() => loadFilter(progress.settings.level));
  const setFilter = (f: LexFilter) => {
    setFilterState(f);
    saveFilter(f);
  };

  return (
    <div>
      <WordsTabs active="lexicon" />
      <PageTitle sub="Существительные и местоимения A1–A2 и ваши сохранённые слова. Ваши слова понемногу подмешиваются в любую подборку.">Лексика</PageTitle>
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
