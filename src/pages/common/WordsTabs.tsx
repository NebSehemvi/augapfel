import { href } from '../../lib/router';
import { Segmented } from './Segmented';

/** Switch between "Лексика" and "Глаголы" (both live under the Слова tab). */
export function WordsTabs({ active }: { active: 'lexicon' | 'verbs' }) {
  return (
    <Segmented
      value={active}
      ariaLabel="Раздел"
      style={{ marginBottom: '1rem' }}
      options={[
        { value: 'lexicon', label: 'Лексика', href: href('/lexicon') },
        { value: 'verbs', label: 'Глаголы', href: href('/verbs') },
      ]}
    />
  );
}
