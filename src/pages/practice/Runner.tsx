import { useEffect, useRef, useState } from 'react';
import { href } from '../../lib/router';
import type { Session } from '../../exercises/session';
import { Button } from '../common/Button';
import { Spinner } from '../common/Spinner';
import { SessionRunner } from './SessionRunner';
import type { Spec } from './spec';
import s from './practice.module.css';

/** Builds the session (possibly async, e.g. AI generation) and shows loading / error states. */
export function Runner({ spec, restart }: { spec: Spec; restart: () => void }) {
  const [state, setState] = useState<{ session?: Session; error?: string }>({});
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return; // StrictMode runs effects twice in dev — never generate twice
    started.current = true;
    Promise.resolve()
      .then(spec.make)
      .then((session) => setState({ session }))
      .catch((e: Error) => setState({ error: e.message }));
  }, [spec]);

  if (state.error) {
    return (
      <div className={s.empty}>
        <p>😕 {state.error}</p>
        <div className={s.actions}>
          <Button onClick={restart}>Попробовать ещё раз</Button>
          <Button variant="secondary" href={href(spec.back)}>
            Назад
          </Button>
        </div>
      </div>
    );
  }
  if (!state.session) {
    return (
      <div className={s.empty}>
        <Spinner large />
        <p>{spec.loading ?? 'Загрузка…'}</p>
        <Button variant="secondary" href={href(spec.back)}>
          Отмена
        </Button>
      </div>
    );
  }
  return <SessionRunner spec={spec} session={state.session} restart={restart} />;
}
