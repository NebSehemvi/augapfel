import { useState } from 'react';
import type { Route } from '../../lib/router';
import { Runner } from './Runner';
import { specFor } from './spec';

/** Full-screen practice for any route that runs exercises (topic, AI topic, text, verbs, review). */
export function Practice({ route }: { route: Route }) {
  const spec = specFor(route);
  const [nonce, setNonce] = useState(0);
  return <Runner key={`${spec.key}-${nonce}`} spec={spec} restart={() => setNonce((n) => n + 1)} />;
}
