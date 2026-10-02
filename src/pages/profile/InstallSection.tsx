import { Muted } from '../common/Muted';
import { Panel } from '../common/Panel';
import s from './profile.module.css';

export function InstallSection() {
  return (
    <Panel title="Установка на iPhone">
      <ol className={s.steps}>
        <li>Откройте сайт в Safari.</li>
        <li>
          Нажмите «Поделиться» <span aria-hidden>⬆️</span>.
        </li>
        <li>Выберите «На экран „Домой“».</li>
      </ol>
      <Muted as="p">Приложение работает и без интернета после первого открытия.</Muted>
    </Panel>
  );
}
