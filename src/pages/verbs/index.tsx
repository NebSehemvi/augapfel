import { PageTitle } from '../common/PageTitle';
import { WordsTabs } from '../common/WordsTabs';
import { Reference } from './Reference';
import { Trainer } from './Trainer';

export function VerbsPage() {
  return (
    <div>
      <WordsTabs active="verbs" />
      <PageTitle>Глаголы</PageTitle>
      <Trainer />
      <Reference />
    </div>
  );
}
