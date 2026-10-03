import { useState } from 'react';
import type { Route } from '../../lib/router';
import type { Level } from '../../grammar/types';
import type { LexMode, LexScope } from '../../exercises/lexiconGame';
import { Game } from './Game';

/** /lexicon/<learn|review|speed|articles>?kind&group&levels */
export function LexiconGamePage({ route }: { route: Route }) {
  const mode = route.path[1] as LexMode;
  const q = route.query;
  const scope: LexScope = {
    kind: (['verb', 'pron', 'mine'] as const).find((k) => k === q.get('kind')) ?? 'noun',
    group: q.get('group') ?? 'all',
    levels: (q.get('levels') ?? 'A1,A2').split(',') as Level[],
  };
  const [nonce, setNonce] = useState(0);
  return <Game key={`${nonce}|${q.toString()}`} mode={mode} scope={scope} back="/lexicon" restart={() => setNonce((n) => n + 1)} />;
}
