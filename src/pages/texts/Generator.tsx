import { useState } from 'react';
import { href, navigate } from '../../lib/router';
import { useProgress } from '../../lib/progress';
import { addUserText } from '../../lib/userTexts';
import { aiReady, providerLabel, useAISettings } from '../../ai/llm';
import { Button } from '../common/Button';
import { FormRow } from '../common/FormRow';
import { Panel } from '../common/Panel';
import { Segmented } from '../common/Segmented';
import { StatusLine } from '../common/StatusLine';
import { TextInput } from '../common/TextInput';
import s from './texts.module.css';

/** "New text with Claude/Gemini" form, or a hint to add an AI key. */
export function Generator() {
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
      const { aiText } = await import('../../ai/generate');
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
    <Panel title={<>✨ Новый текст с {providerLabel(ai)}</>}>
      <form
        className={s.form}
        onSubmit={(e) => {
          e.preventDefault();
          if (topic.trim() && !busy) run();
        }}
      >
        <TextInput placeholder="Тема: Oktoberfest, Kaffee, Alpen, Fahrrad…" value={topic} onValue={setTopic} disabled={busy} lang="de" />
        <FormRow>
          <Segmented
            value={level}
            onChange={setLevel}
            disabled={busy}
            ariaLabel="Уровень текста"
            options={[
              { value: 'A1', label: 'A1' },
              { value: 'A2', label: 'A2' },
            ]}
          />
          <Button variant="compact" type="submit" disabled={!topic.trim() || busy}>
            {busy ? 'Создаю…' : 'Создать текст'}
          </Button>
        </FormRow>
      </form>
      {status && <StatusLine kind="loading">{status}</StatusLine>}
      {error && <StatusLine kind="error">{error}</StatusLine>}
    </Panel>
  );
}
