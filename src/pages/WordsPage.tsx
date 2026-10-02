import { useState } from 'react';
import { href } from '../lib/router';
import { addWord, dueKeys, removeWord, useProgress, wordKeys } from '../lib/progress';
import { lookupLocal, lookupWiktionary, POS_LABEL, type Pos, type WordInfo } from '../lib/dictionary';
import { meaning } from '../exercises/vocab';
import { plural } from '../lib/format';
import { VerbsPage } from './VerbsPage';
import s from './pages.module.css';

export function WordsPage({ tab }: { tab: 'mine' | 'verbs' }) {
  return (
    <div>
      <div className={s.segment} style={{ marginBottom: '1rem' }}>
        <a className={`${s.segBtn} ${tab === 'mine' ? s.segOn : ''}`} href={href('/words')}>
          Мои слова
        </a>
        <a className={`${s.segBtn} ${tab === 'verbs' ? s.segOn : ''}`} href={href('/verbs')}>
          Глаголы
        </a>
      </div>
      {tab === 'mine' ? <MyWords /> : <VerbsPage />}
    </div>
  );
}

function MyWords() {
  const progress = useProgress();
  const [query, setQuery] = useState('');
  const words = Object.values(progress.words).sort((a, b) => b.addedAt - a.addedAt);
  const q = query.trim().toLowerCase();
  const shown = q ? words.filter((w) => `${w.lemma} ${w.ru ?? ''} ${w.en ?? ''}`.toLowerCase().includes(q)) : words;
  const dueSet = new Set(dueKeys());
  const due = words.filter((w) => wordKeys(w.lemma).some((k) => dueSet.has(k))).length;

  return (
    <div>
      <h1 className={s.h1}>Мои слова</h1>
      <section className={s.panel}>
        <p className={s.big}>
          <b>{words.length}</b> {plural(words.length, 'слово', 'слова', 'слов')}
          {due > 0 && <span className={s.muted}> · {due} пора повторить</span>}
        </p>
        <a className={`${s.startBtn} ${words.length === 0 ? s.disabledLink : ''}`} href={words.length ? href('/words/train') : undefined} aria-disabled={!words.length}>
          Тренировать слова →
        </a>
        <p className={s.muted}>Две тренировки: выбрать перевод из четырёх карточек и написать слово по-немецки. Слова также попадают в «Повторение».</p>
      </section>

      <AddWord />

      {words.length === 0 ? (
        <p className={s.muted}>
          Пока пусто. Откройте <a href={href('/texts')}>текст</a>, нажмите на незнакомое слово и добавьте его.
        </p>
      ) : (
        <section className={s.panel}>
          <input className={s.search} placeholder="Поиск по словам" value={query} onChange={(e) => setQuery(e.target.value)} />
          <ul className={s.verbList}>
            {shown.map((w) => {
              const box = Math.min(progress.srs[`w|${w.lemma}|rec`]?.box ?? 0, progress.srs[`w|${w.lemma}|prod`]?.box ?? 0);
              return (
                <li key={w.lemma} className={s.verbRow}>
                  <div className={s.verbTop}>
                    <b lang="de">{w.lemma}</b>
                    <span className={s.muted}>{POS_LABEL[w.pos as Pos]}</span>
                    <span className={s.verbBadges}>
                      <span className={s.box} title="Уровень запоминания">
                        {'●'.repeat(box) || '○'}
                      </span>
                      <button className={s.iconBtn} onClick={() => removeWord(w.lemma)} aria-label={`Удалить ${w.lemma}`}>
                        ✕
                      </button>
                    </span>
                  </div>
                  <div className={s.verbForms}>{meaning(w)}</div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

function AddWord() {
  const progress = useProgress();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<WordInfo | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  const find = async () => {
    const w = input.trim();
    if (!w) return;
    setBusy(true);
    setResult(lookupLocal(w) ?? (await lookupWiktionary(w)));
    setBusy(false);
  };

  return (
    <section className={s.panel}>
      <h2 className={s.panelTitle}>Добавить слово</h2>
      <form
        className={s.genRow}
        onSubmit={(e) => {
          e.preventDefault();
          find();
        }}
      >
        <input className={s.search} style={{ marginBottom: 0 }} placeholder="Немецкое слово, например: Brötchen" value={input} onChange={(e) => setInput(e.target.value)} lang="de" autoCapitalize="off" />
        <button className={s.startBtnSmall} disabled={!input.trim() || busy}>
          Найти
        </button>
      </form>
      {result === null && <p className={s.muted}>Не нашёл это слово.</p>}
      {result && (
        <div className={s.addResult}>
          <div>
            <b lang="de">{result.lemma}</b> <span className={s.muted}>{POS_LABEL[result.pos]}</span>
            <div>{meaning(result)}</div>
          </div>
          {progress.words[result.lemma] ? (
            <span className={s.muted}>✓ уже в списке</span>
          ) : (
            <button
              className={s.startBtnSmall}
              onClick={() => {
                addWord({ lemma: result.lemma, pos: result.pos, ru: result.ru, en: result.en, pl: result.pl });
                setInput('');
                setResult(undefined);
              }}
            >
              ＋ Добавить
            </button>
          )}
        </div>
      )}
    </section>
  );
}
