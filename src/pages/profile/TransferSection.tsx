import { useRef, useState } from 'react';
import { exportProgress, importProgress } from '../../lib/progress';
import { Button } from '../common/Button';
import { Muted } from '../common/Muted';
import { Panel } from '../common/Panel';
import s from './profile.module.css';

/** Export / import of progress, saved words and generated texts (file, share sheet or clipboard). */
export function TransferSection() {
  const [msg, setMsg] = useState<string | null>(null);
  const [paste, setPaste] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

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
    <Panel title="Перенос прогресса между устройствами">
      <Muted as="p">
        Прогресс, «Мои слова» и созданные вами тексты хранятся на этом устройстве. Чтобы перенести их на iPhone или Mac, экспортируйте файл и
        импортируйте его на другом устройстве — данные объединятся. Ключи ИИ в файл не попадают.
      </Muted>
      <div className={s.btnRow}>
        <Button variant="secondary" onClick={share}>
          📤 Экспорт / поделиться
        </Button>
        <Button variant="secondary" onClick={download}>
          ⬇️ Скачать файл
        </Button>
        <Button variant="secondary" onClick={copy}>
          📋 Скопировать текст
        </Button>
      </div>
      <div className={s.btnRow}>
        <Button variant="secondary" onClick={() => fileRef.current?.click()}>
          📥 Импорт из файла
        </Button>
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
        <Button variant="secondary" onClick={() => doImport(paste)}>
          Импортировать текст
        </Button>
      )}
      {msg && <p className={s.msg}>{msg}</p>}
    </Panel>
  );
}
