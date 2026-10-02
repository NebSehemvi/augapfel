import { useState } from 'react';
import { BUILTIN_TEXTS, type ReadingText } from '../data/texts';
import { THEMES } from '../data/themes';
import { href, navigate } from '../lib/router';
import { useProgress } from '../lib/progress';
import { addUserText, useUserTexts } from '../lib/userTexts';
import { aiReady, providerLabel, useAISettings } from '../ai/llm';
import { LevelBadge, ScoreBadge } from './common';
import s from './pages.module.css';

export function TextsPage() {
  const progress = useProgress();
  const mine = useUserTexts();
  const level = progress.settings.level;
  const [show, setShow] = useState<'level' | 'all'>('level');
  const visible = BUILTIN_TEXTS.filter((t) => show === 'all' || t.level === level || (level === 'A2' && t.level === 'A1'));

  return (
    <div>
      <h1 className={s.h1}>Тексты</h1>
      <p className={s.sub}>Нажмите на любое слово в тексте — появится перевод, и слово можно добавить в «Мои слова».</p>

      <Generator />

      {mine.length > 0 && (
        <section className={s.group}>
          <h2 className={s.groupTitle}>Мои тексты</h2>
          <div className={s.cards}>
            {mine.map((t) => (
              <TextCard key={t.id} t={t} stat={progress.topics[`text:${t.id}`]} />
            ))}
          </div>
        </section>
      )}

      <div className={s.segment} style={{ margin: '0.4rem 0 1rem' }}>
        <button className={`${s.segBtn} ${show === 'level' ? s.segOn : ''}`} onClick={() => setShow('level')}>
          Мой уровень ({level})
        </button>
        <button className={`${s.segBtn} ${show === 'all' ? s.segOn : ''}`} onClick={() => setShow('all')}>
          Все
        </button>
      </div>

      {THEMES.map((th) => {
        const list = visible.filter((t) => t.theme === th.id);
        if (!list.length) return null;
        return (
          <section key={th.id} className={s.group}>
            <h2 className={s.groupTitle}>
              {th.emoji} {th.name.ru}
            </h2>
            <div className={s.cards}>
              {list.map((t) => (
                <TextCard key={t.id} t={t} stat={progress.topics[`text:${t.id}`]} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function TextCard({ t, stat }: { t: ReadingText; stat?: Parameters<typeof ScoreBadge>[0]['stat'] }) {
  return (
    <a className={s.card} href={href(`/read/${t.id}`)}>
      <div className={s.cardMain}>
        <div className={s.cardTitle} lang="de">
          {t.title} <LevelBadge level={t.level} />
        </div>
        <div className={s.cardDe} lang="de">
          {t.paragraphs[0]}
        </div>
      </div>
      <ScoreBadge stat={stat} />
    </a>
  );
}

function Generator() {
  const ai = useAISettings();
  const progress = useProgress();
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<'A1' | 'A2'>(progress.settings.level);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const busy = status !== null;

  if (!aiReady(ai)) {
    return (
      <div className={s.aiHint}>
        ✨ Хотите тексты на свою тему? Добавьте ключ Claude или Gemini в <a href={href('/me')}>профиле</a> — ИИ найдёт статью в Klexikon или Википедии
        и перескажет её простым немецким с переводом слов и упражнениями.
      </div>
    );
  }

  const run = async () => {
    setError(null);
    setStatus('Начинаю…');
    try {
      const { aiText } = await import('../ai/generate');
      const text = await aiText(topic.trim(), level, setStatus);
      addUserText(text);
      navigate(`/read/${text.id}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setStatus(null);
    }
  };

  return (
    <section className={s.panel}>
      <h2 className={s.panelTitle}>✨ Новый текст с {providerLabel(ai)}</h2>
      <form
        className={s.genForm}
        onSubmit={(e) => {
          e.preventDefault();
          if (topic.trim() && !busy) run();
        }}
      >
        <input className={s.search} placeholder="Тема: Oktoberfest, Kaffee, Alpen, Fahrrad…" value={topic} onChange={(e) => setTopic(e.target.value)} disabled={busy} lang="de" />
        <div className={s.genRow}>
          <div className={s.segment}>
            {(['A1', 'A2'] as const).map((l) => (
              <button type="button" key={l} className={`${s.segBtn} ${level === l ? s.segOn : ''}`} onClick={() => setLevel(l)} disabled={busy}>
                {l}
              </button>
            ))}
          </div>
          <button className={s.startBtnSmall} disabled={!topic.trim() || busy}>
            {busy ? 'Создаю…' : 'Создать текст'}
          </button>
        </div>
      </form>
      {status && (
        <p className={s.statusLine}>
          <span className={s.spinner} aria-hidden /> {status}
        </p>
      )}
      {error && <p className={s.errorLine}>{error}</p>}
    </section>
  );
}
