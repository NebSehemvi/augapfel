import { href } from '../../lib/router';
import { Segmented } from './Segmented';

/** Switch between "Мои слова" and "Глаголы" (both live under the Слова tab). */
export function WordsTabs({ active }: { active: 'words' | 'verbs' }) {
  return (
    <Segmented
      value={active}
      ariaLabel="Раздел"
      style={{ marginBottom: '1rem' }}
      options={[
        { value: 'words', label: 'Мои слова', href: href('/words') },
        { value: 'verbs', label: 'Глаголы', href: href('/verbs') },
      ]}
    />
  );
}
