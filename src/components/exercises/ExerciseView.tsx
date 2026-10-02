import type { Exercise, ExerciseResult } from '../../exercises/types';
import { ConjView, FillView, FormsView, WriteView } from './TextViews';
import { BankView, ChoiceView, MatchView } from './ChoiceViews';
import { OrderView, SortView, TableView } from './DragViews';
import { SnakeView } from './SnakeView';
import { UmlautProvider } from './inputs';

export function ExerciseView({ ex, lenient, onDone }: { ex: Exercise; lenient: boolean; onDone: (r: ExerciseResult) => void }) {
  const props = { lenient, onDone };
  let view;
  switch (ex.type) {
    case 'fill':
      view = <FillView ex={ex} {...props} />;
      break;
    case 'choice':
      view = <ChoiceView ex={ex} {...props} />;
      break;
    case 'order':
      view = <OrderView ex={ex} {...props} />;
      break;
    case 'table':
      view = <TableView ex={ex} {...props} />;
      break;
    case 'match':
      view = <MatchView ex={ex} {...props} />;
      break;
    case 'sort':
      view = <SortView ex={ex} {...props} />;
      break;
    case 'conj':
      view = <ConjView ex={ex} {...props} />;
      break;
    case 'write':
      view = <WriteView ex={ex} {...props} />;
      break;
    case 'snake':
      view = <SnakeView ex={ex} {...props} />;
      break;
    case 'forms':
      view = <FormsView ex={ex} {...props} />;
      break;
    case 'bank':
      view = <BankView ex={ex} {...props} />;
      break;
  }
  return <UmlautProvider>{view}</UmlautProvider>;
}
