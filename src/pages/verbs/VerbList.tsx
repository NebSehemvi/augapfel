import { useMemo } from 'react';
import { CLASS_LABELS, VERBS, verbKey } from '../../data/verbs';
import { praet3, pres3 } from '../../grammar/conjugate';
import { useProgress } from '../../lib/progress';
import { srsKey, verbLabel } from '../../exercises/builders';
import { LevelBadge } from '../common/LevelBadge';
import { MemoryDots } from '../common/MemoryDots';
import { Muted } from '../common/Muted';
import { WordList } from '../common/WordList';
import { WordRow } from '../common/WordRow';
import s from './verbs.module.css';

/** Verb reference: infinitive, meaning, er-form · Präteritum · Perfekt, ablaut class. */
export function VerbList({ query, strongOnly }: { query: string; strongOnly: boolean }) {
  const progress = useProgress();
  const q = query.trim().toLowerCase();
  const verbs = useMemo(
    () =>
      VERBS.filter((v) => (!strongOnly || v.kind !== 'weak') && (!q || [v.inf, v.ru, v.en, v.praet.join(' '), v.pp.join(' ')].join(' ').toLowerCase().includes(q))).sort(
        (a, b) => a.inf.localeCompare(b.inf, 'de'),
      ),
    [q, strongOnly],
  );
  return (
    <WordList>
      {verbs.slice(0, 300).map((v) => {
        const srs = progress.srs[srsKey.pp(v)];
        return (
          <WordRow
            key={verbKey(v)}
            word={verbLabel(v)}
            meta={v.ru}
            badges={
              <>
                {srs && <MemoryDots box={srs.box} />}
                <LevelBadge level={v.level} />
              </>
            }
            detailsLang="de"
            details={
              <>
                {pres3(v)} · {praet3(v)[0]} · {v.aux[0] === 'sein' ? 'ist' : 'hat'} {v.pp[0]}
                {v.cls && CLASS_LABELS[v.cls] && <span className={s.cls}> {CLASS_LABELS[v.cls]}</span>}
              </>
            }
          />
        );
      })}
      {verbs.length === 0 && <Muted as="li">Ничего не найдено</Muted>}
    </WordList>
  );
}
