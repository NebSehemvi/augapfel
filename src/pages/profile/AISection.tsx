import { useState } from 'react';
import { PROVIDERS, setKey, setModel, setProvider, testKey, useAISettings, type Provider } from '../../ai/llm';
import { Button } from '../common/Button';
import { Field } from '../common/Field';
import { FormRow } from '../common/FormRow';
import { Muted } from '../common/Muted';
import { Panel } from '../common/Panel';
import { Segmented } from '../common/Segmented';
import { StatusLine } from '../common/StatusLine';
import { TextInput } from '../common/TextInput';
import { Toggle } from './Toggle';
import s from './profile.module.css';

/** Optional AI provider: Claude or Gemini key, key check, model choice. */
export function AISection() {
  const ai = useAISettings();
  const p = ai.provider;
  const info = PROVIDERS[p];
  const key = ai.keys[p];
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const check = async (prov: Provider) => {
    setBusy(true);
    setStatus(null);
    try {
      const name = await testKey(prov);
      setStatus({ ok: true, text: `Ключ работает · модель ${name}` });
    } catch (e) {
      setStatus({ ok: false, text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel title="✨ ИИ-помощник (необязательно)">
      <Muted as="p">
        С ключом появятся кнопки «Новые упражнения» в темах и «Новый текст» в разделе «Тексты». Ключи хранятся только на этом устройстве и не попадают в
        файл экспорта.
      </Muted>
      <div className={s.segment}>
        <Segmented
          ariaLabel="Провайдер"
          value={p}
          onChange={(id) => {
            setProvider(id);
            setStatus(null);
            setDraft('');
          }}
          options={(Object.keys(PROVIDERS) as Provider[]).map((id) => ({ value: id, label: `${PROVIDERS[id].label}${ai.keys[id] ? ' ✓' : ''}` }))}
        />
      </div>
      {p === 'claude' ? (
        <Muted as="p">
          Ключ создаётся на{' '}
          <a href={info.keyUrl} target="_blank" rel="noreferrer">
            console.anthropic.com
          </a>
          . Оплата отдельно от подписки Claude — поставьте там месячный лимит расходов.
        </Muted>
      ) : (
        <Muted as="p">
          Ключ создаётся в{' '}
          <a href={info.keyUrl} target="_blank" rel="noreferrer">
            Google AI Studio
          </a>
          . Подписка Google AI Pro его не оплачивает, но у Flash-моделей есть бесплатный тариф с дневными лимитами. На бесплатном тарифе Google
          может использовать запросы для улучшения своих продуктов (в ЕС действуют более строгие правила).
        </Muted>
      )}
      {key ? (
        <div className={s.keyRow}>
          <code className={s.keyMask}>
            {key.slice(0, 8)}…{key.slice(-4)}
          </code>
          <Button variant="secondary" onClick={() => check(p)} disabled={busy}>
            {busy ? 'Проверяю…' : 'Проверить'}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setKey(p, '');
              setStatus(null);
            }}
          >
            Удалить ключ
          </Button>
        </div>
      ) : (
        <FormRow
          onSubmit={() => {
            if (draft.trim()) {
              setKey(p, draft.trim());
              setDraft('');
              check(p);
            }
          }}
        >
          <TextInput type="password" placeholder={info.keyHint} autoComplete="off" value={draft} onValue={setDraft} />
          <Button variant="compact" type="submit" disabled={!draft.trim()}>
            Сохранить
          </Button>
        </FormRow>
      )}
      {status && <StatusLine kind={status.ok ? 'ok' : 'error'}>{status.text}</StatusLine>}
      <Field label={`Модель ${info.label}`} style={{ marginTop: '1rem' }}>
        {info.models.map((m) => (
          <Toggle key={m.id} type="radio" name={`model-${p}`} checked={ai.models[p] === m.id} onChange={() => setModel(p, m.id)} label={m.label} hint={m.note} />
        ))}
      </Field>
      {ai.keys.claude && ai.keys.gemini && <Muted as="p">Сохранены оба ключа — используется выбранная вкладка ({info.label}).</Muted>}
    </Panel>
  );
}
