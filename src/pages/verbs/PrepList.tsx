import { PREP_VERBS } from '../../data/prepVerbs';
import { LevelBadge } from '../common/LevelBadge';
import { WordList } from '../common/WordList';
import { WordRow } from '../common/WordRow';

/** Verbs with prepositions: "warten auf + Akk" with an example. */
export function PrepList({ query }: { query: string }) {
  const q = query.trim().toLowerCase();
  const list = PREP_VERBS.filter((p) => !q || `${p.verb} ${p.prep} ${p.ru} ${p.en}`.toLowerCase().includes(q));
  return (
    <WordList>
      {list.map((p) => (
        <WordRow
          key={`${p.verb}+${p.prep}`}
          word={`${p.verb} ${p.prep} + ${p.case === 'akk' ? 'Akk' : 'Dat'}`}
          meta={p.ru}
          badges={<LevelBadge level={p.level} />}
          detailsLang="de"
          details={p.ex}
        />
      ))}
    </WordList>
  );
}
