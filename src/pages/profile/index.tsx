import { resetProgress, streak, useProgress } from '../../lib/progress';
import { plural } from '../../lib/format';
import { Button } from '../common/Button';
import { PageTitle } from '../common/PageTitle';
import { Panel } from '../common/Panel';
import { AISection } from './AISection';
import { InstallSection } from './InstallSection';
import { SettingsSection } from './SettingsSection';
import { Stat } from './Stat';
import { TopicStats } from './TopicStats';
import { TransferSection } from './TransferSection';
import s from './profile.module.css';

export function ProfilePage() {
  const progress = useProgress();
  const sessions = Object.values(progress.topics).reduce((a, t) => a + t.sessions, 0);
  const days = streak();

  return (
    <div>
      <PageTitle>Профиль</PageTitle>

      <section className={s.stats}>
        <Stat n={days} label={plural(days, 'день подряд', 'дня подряд', 'дней подряд')} icon="🔥" />
        <Stat n={sessions} label={plural(sessions, 'занятие', 'занятия', 'занятий')} icon="✅" />
        <Stat n={Object.keys(progress.srs).length} label="карточек" icon="🗂️" />
      </section>

      <TopicStats />
      <SettingsSection />
      <AISection />
      <TransferSection />
      <InstallSection />

      <Panel>
        <Button
          variant="danger"
          onClick={() => {
            if (confirm('Удалить весь прогресс на этом устройстве? Это нельзя отменить.')) resetProgress();
          }}
        >
          Сбросить прогресс
        </Button>
      </Panel>
    </div>
  );
}
