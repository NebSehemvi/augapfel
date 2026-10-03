import { useEffect, useRef, useState } from 'react';
import type { TypeQuestion } from '../../exercises/lexiconGame';
import { checkText, type CheckResult } from '../../lib/check';
import { germanForm } from '../../exercises/vocab';
import { UInput, UmlautBar, UmlautProvider } from '../../components/exercises/inputs';
import { Button } from '../common/Button';
import ex from '../../components/exercises/ex.module.css';
import s from './game.module.css';

/** Russian word → type the German one (nouns with article). A typo or a missing umlaut still counts. */
export function TypeAnswer({ q, lenient, onAnswer, onNext }: { q: TypeQuestion; lenient: boolean; onAnswer: (ok: boolean) => void; onNext: () => void }) {
  const [value, setValue] = useState('');
  const [res, setRes] = useState<CheckResult | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const settle = (r: CheckResult) => {
    setRes(r);
    const ok = r.verdict !== 'wrong';
    onAnswer(ok);
    if (r.verdict === 'ok' && !r.note) timer.current = window.setTimeout(onNext, 900);
  };

  const submit = () => {
    if (res) return onNext();
    if (value.trim()) settle(checkText(value, q.accepted, { lenientUmlauts: lenient, lenientCommas: false }));
  };

  const ok = res && res.verdict !== 'wrong';
  return (
    <UmlautProvider>
      <form
        className={s.typeForm}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className={s.modeLabel}>Напишите по-немецки</div>
        <div className={ex.cardPrompt} lang="ru">
          {q.prompt}
          {q.sub && <span className={ex.cardSub}>{q.sub}</span>}
        </div>
        <div className={s.typeRow}>
          <UInput
            className={s.typeInput}
            value={value}
            onValue={setValue}
            state={res ? (res.verdict === 'ok' ? 'ok' : res.verdict === 'almost' ? 'almost' : 'bad') : null}
            readOnly={!!res}
            autoFocus
            placeholder={q.entry.pos === 'noun' ? 'der / die / das …' : ''}
            aria-label="Ответ по-немецки"
          />
        </div>
        {!res && q.entry.pos === 'noun' && <p className={s.hint}>С артиклем. Множественное число писать не нужно.</p>}
        {!res && q.entry.kind === 'verb' && <p className={s.hint}>{q.entry.group === 'prep' ? 'Глагол с предлогом.' : 'Инфинитив.'} Падеж писать не нужно.</p>}
        {res && (
          <div className={s.solution} lang="de">
            {ok ? '✓ ' : '✗ '}
            <b>{germanForm(q.entry)}</b>
            {res.note && <div className={s.hint}>{res.note}</div>}
          </div>
        )}
        <div className={s.bottom}>
          <div className={`${s.feedback} ${ok ? s.feedbackOk : s.feedbackBad}`} role="status">
            {res ? (ok ? 'Richtig!' : 'Неверно') : ''}
          </div>
          {!res && <UmlautBar />}
          {res ? (
            <Button type="submit" autoFocus>
              Дальше →
            </Button>
          ) : (
            <>
              <Button type="submit" disabled={!value.trim()}>
                Проверить
              </Button>
              <Button variant="secondary" onClick={() => settle({ verdict: 'wrong', expected: q.accepted[0] })}>
                Не знаю
              </Button>
            </>
          )}
        </div>
      </form>
    </UmlautProvider>
  );
}
