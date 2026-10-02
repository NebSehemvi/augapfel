import { useRef, useState } from 'react';
import { exportProgress, importProgress, resetProgress, streak, updateSettings, useProgress } from '../lib/progress';
import { TOPICS } from '../topics';
import { href } from '../lib/router';
import { ScoreBadge } from './common';
import { plural } from '../lib/format';
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
      setMsg(`Импортировано: ${r.topics} тем, ${r.items} карточек. Прогресс объединён с текущим.`);
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

      <section className={s.panel}>
        <h2 className={s.panelTitle}>Перенос прогресса между устройствами</h2>
        <p className={s.muted}>
          Прогресс хранится на этом устройстве. Чтобы перенести его на iPhone или Mac, экспортируйте файл и импортируйте его на другом
          устройстве — данные объединятся.
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
