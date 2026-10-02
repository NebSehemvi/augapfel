import { useRef, useState } from 'react';
import { exportProgress, importProgress, resetProgress, streak, updateSettings, useProgress } from '../lib/progress';
import { TOPICS } from '../topics';
import { href } from '../lib/router';
import { ScoreBadge } from './common';
import { plural } from '../lib/format';
import { PROVIDERS, setKey, setModel, setProvider, testKey, useAISettings, type Provider } from '../ai/llm';
import s from './pages.module.css';

export function ProfilePage() {
  const progress = useProgress();
  const { settings } = progress;
  const [msg, setMsg] = useState<string | null>(null);
  const [paste, setPaste] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const sessions = Object.values(progress.topics).reduce((a, t) => a + t.sessions, 0);
  const days = streak();

  const download = () => {
    const blob = new Blob([exportProgress()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `augapfel-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const share = async () => {
    const file = new File([exportProgress()], 'augapfel-progress.json', { type: 'application/json' });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'Augapfel — прогресс' });
      } catch {
        /* cancelled */
      }
    } else download();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(exportProgress());
      setMsg('Скопировано в буфер обмена. Вставьте текст на другом устройстве в поле ниже.');
    } catch {
      setMsg('Не удалось скопировать — используйте «Скачать файл».');
    }
  };

  const doImport = (text: string) => {
    try {
      const r = importProgress(text);
      setMsg(`Импортировано: ${r.topics} тем, ${r.items} карточек, ${r.texts} новых текстов. Прогресс объединён с текущим.`);
      setPaste('');
    } catch (e) {
      setMsg(`Ошибка импорта: ${(e as Error).message}`);
    }
  };

  return (
    <div>
      <h1 className={s.h1}>Профиль</h1>

      <section className={s.stats}>
        <Stat n={days} label={plural(days, 'день подряд', 'дня подряд', 'дней подряд')} icon="🔥" />
        <Stat n={sessions} label={plural(sessions, 'занятие', 'занятия', 'занятий')} icon="✅" />
        <Stat n={Object.keys(progress.srs).length} label="карточек" icon="🗂️" />
      </section>

      <section className={s.panel}>
        <h2 className={s.panelTitle}>Темы</h2>
        <ul className={s.topicStats}>
          {TOPICS.map((t) => (
            <li key={t.id}>
              <a href={href(`/t/${t.id}`)}>
                <span className={s.muted}>{t.level}</span> {t.ru}
              </a>
              <ScoreBadge stat={progress.topics[t.id]} />
            </li>
          ))}
        </ul>
      </section>

      <section className={s.panel}>
        <h2 className={s.panelTitle}>Настройки</h2>
        <Toggle
          checked={settings.lenientUmlauts}
          onChange={(v) => updateSettings({ lenientUmlauts: v })}
          label="Принимать ae / oe / ue / ss вместо ä / ö / ü / ß"
          hint="Удобно, если нет немецкой клавиатуры. Ответ засчитывается, но правильное написание покажется."
        />
        <Toggle
          checked={settings.includeRare}
          onChange={(v) => updateSettings({ includeRare: v })}
          label="Использовать редкие глаголы (B1) в упражнениях"
          hint="Например gießen, genießen, messen."
        />
      </section>

      <AISection />

      <section className={s.panel}>
        <h2 className={s.panelTitle}>Перенос прогресса между устройствами</h2>
        <p className={s.muted}>
          Прогресс, «Мои слова» и созданные вами тексты хранятся на этом устройстве. Чтобы перенести их на iPhone или Mac, экспортируйте файл
          и импортируйте его на другом устройстве — данные объединятся. Ключи ИИ в файл не попадают.
        </p>
        <div className={s.btnRow}>
          <button className={s.ghostBtn} onClick={share}>
            📤 Экспорт / поделиться
          </button>
          <button className={s.ghostBtn} onClick={download}>
            ⬇️ Скачать файл
          </button>
          <button className={s.ghostBtn} onClick={copy}>
            📋 Скопировать текст
          </button>
        </div>
        <div className={s.btnRow}>
          <button className={s.ghostBtn} onClick={() => fileRef.current?.click()}>
            📥 Импорт из файла
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) doImport(await f.text());
              e.target.value = '';
            }}
          />
        </div>
        <textarea className={s.paste} rows={3} placeholder="…или вставьте сюда скопированный текст" value={paste} onChange={(e) => setPaste(e.target.value)} />
        {paste.trim() && (
          <button className={s.ghostBtn} onClick={() => doImport(paste)}>
            Импортировать текст
          </button>
        )}
        {msg && <p className={s.msg}>{msg}</p>}
      </section>

      <section className={s.panel}>
        <h2 className={s.panelTitle}>Установка на iPhone</h2>
        <ol className={s.steps}>
          <li>Откройте сайт в Safari.</li>
          <li>
            Нажмите «Поделиться» <span aria-hidden>⬆️</span>.
          </li>
          <li>Выберите «На экран „Домой“».</li>
        </ol>
        <p className={s.muted}>Приложение работает и без интернета после первого открытия.</p>
      </section>

      <section className={s.panel}>
        <button
          className={s.dangerBtn}
          onClick={() => {
            if (confirm('Удалить весь прогресс на этом устройстве? Это нельзя отменить.')) resetProgress();
          }}
        >
          Сбросить прогресс
        </button>
      </section>
    </div>
  );
}

function Stat({ n, label, icon }: { n: number; label: string; icon: string }) {
  return (
    <div className={s.stat}>
      <span className={s.statIcon}>{icon}</span>
      <b className={s.statN}>{n}</b>
      <span className={s.muted}>{label}</span>
    </div>
  );
}

function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <label className={s.toggle}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        {label}
        {hint && <span className={s.toggleHint}>{hint}</span>}
      </span>
    </label>
  );
}

function AISection() {
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
    <section className={s.panel}>
      <h2 className={s.panelTitle}>✨ ИИ-помощник (необязательно)</h2>
      <p className={s.muted}>
        С ключом появятся кнопки «Новые упражнения» в темах и «Новый текст» в разделе «Тексты». Ключи хранятся только на этом устройстве и не попадают в
        файл экспорта.
      </p>
      <div className={s.segment} style={{ margin: '0.4rem 0 0.8rem' }} role="tablist" aria-label="Провайдер">
        {(Object.keys(PROVIDERS) as Provider[]).map((id) => (
          <button
            key={id}
            role="tab"
            aria-selected={p === id}
            className={`${s.segBtn} ${p === id ? s.segOn : ''}`}
            onClick={() => {
              setProvider(id);
              setStatus(null);
              setDraft('');
            }}
          >
            {PROVIDERS[id].label}
            {ai.keys[id] ? ' ✓' : ''}
          </button>
        ))}
      </div>
      {p === 'claude' ? (
        <p className={s.muted}>
          Ключ создаётся на{' '}
          <a href={info.keyUrl} target="_blank" rel="noreferrer">
            console.anthropic.com
          </a>
          . Оплата отдельно от подписки Claude — поставьте там месячный лимит расходов.
        </p>
      ) : (
        <p className={s.muted}>
          Ключ создаётся в{' '}
          <a href={info.keyUrl} target="_blank" rel="noreferrer">
            Google AI Studio
          </a>
          . Подписка Google AI Pro его не оплачивает, но у Flash-моделей есть бесплатный тариф с дневными лимитами. На бесплатном тарифе Google
          может использовать запросы для улучшения своих продуктов (в ЕС действуют более строгие правила).
        </p>
      )}
      {key ? (
        <div className={s.keyRow}>
          <code className={s.keyMask}>
            {key.slice(0, 8)}…{key.slice(-4)}
          </code>
          <button className={s.ghostBtn} onClick={() => check(p)} disabled={busy}>
            {busy ? 'Проверяю…' : 'Проверить'}
          </button>
          <button
            className={s.dangerBtn}
            onClick={() => {
              setKey(p, '');
              setStatus(null);
            }}
          >
            Удалить ключ
          </button>
        </div>
      ) : (
        <form
          className={s.genRow}
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.trim()) {
              setKey(p, draft.trim());
              setDraft('');
              check(p);
            }
          }}
        >
          <input
            className={s.search}
            style={{ marginBottom: 0 }}
            type="password"
            placeholder={info.keyHint}
            autoComplete="off"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button className={s.startBtnSmall} disabled={!draft.trim()}>
            Сохранить
          </button>
        </form>
      )}
      {status && <p className={status.ok ? s.okLine : s.errorLine}>{status.text}</p>}
      <div className={s.field} style={{ marginTop: '1rem' }}>
        <div className={s.fieldLabel}>Модель {info.label}</div>
        {info.models.map((m) => (
          <label key={m.id} className={s.toggle}>
            <input type="radio" name={`model-${p}`} checked={ai.models[p] === m.id} onChange={() => setModel(p, m.id)} />
            <span>
              {m.label}
              <span className={s.toggleHint}>{m.note}</span>
            </span>
          </label>
        ))}
      </div>
      {ai.keys.claude && ai.keys.gemini && <p className={s.muted}>Сохранены оба ключа — используется выбранная вкладка ({info.label}).</p>}
    </section>
  );
}
