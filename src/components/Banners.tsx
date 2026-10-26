import { useRegisterSW } from 'virtual:pwa-register/react';
import { useSaveFailed } from '../lib/saveStatus';
import { downloadExport } from '../lib/transfer';
import s from './Banners.module.css';

/** Non-blocking notices at the top of the app shell. */
export function Banners({ session }: { session: boolean }) {
  const saveFailed = useSaveFailed();
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();
  return (
    <div className={s.stack}>
      {saveFailed && (
        <div className={`${s.banner} ${s.warn}`} role="alert">
          <span>Не удаётся сохранить прогресс на этом устройстве (память переполнена или хранилище недоступно). После закрытия страницы он может пропасть.</span>
          <button type="button" className={s.btn} onClick={downloadExport}>
            Сохранить в файл
          </button>
        </div>
      )}
      {/* never offered mid-session: the reload would lose the running exercise set */}
      {needRefresh && !session && (
        <div className={`${s.banner} ${s.info}`} role="status">
          <span>Доступна новая версия</span>
          <button type="button" className={s.btn} onClick={() => updateServiceWorker(true)}>
            Обновить
          </button>
        </div>
      )}
    </div>
  );
}
