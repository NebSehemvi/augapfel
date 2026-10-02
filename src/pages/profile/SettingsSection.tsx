import { updateSettings, useProgress } from '../../lib/progress';
import { Panel } from '../common/Panel';
import { Toggle } from './Toggle';

export function SettingsSection() {
  const { settings } = useProgress();
  return (
    <Panel title="Настройки">
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
    </Panel>
  );
}
