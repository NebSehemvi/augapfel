import { href } from '../../lib/router';
import { LIVES, SPEED_SECONDS } from '../../exercises/lexiconGame';
import s from './game.module.css';

interface Props {
  back: string;
  /** 0…1 for learn / classic review */
  progress?: number;
  /** speed review: lives, points, a countdown bar restarted for every question */
  speed?: { lives: number; score: number; timerKey: number; paused: boolean };
}

export function GameHud({ back, progress, speed }: Props) {
  return (
    <div className={s.hud}>
      <a className={s.close} href={href(back)} aria-label="Закрыть">
        ✕
      </a>
      {speed && (
        <span className={s.lives} aria-label={`Жизни: ${speed.lives} из ${LIVES}`}>
          {Array.from({ length: LIVES }, (_, k) => (
            <span key={k} className={k < speed.lives ? '' : s.lost}>
              ❤️
            </span>
          ))}
        </span>
      )}
      <div className={s.track}>
        {speed ? (
          <div key={speed.timerKey} className={`${s.timer} ${speed.paused ? s.timerPaused : ''}`} style={{ animationDuration: `${SPEED_SECONDS}s` }} />
        ) : (
          <div className={s.fill} style={{ width: `${(progress ?? 0) * 100}%` }} />
        )}
      </div>
      {speed && <span className={s.score}>{speed.score}</span>}
    </div>
  );
}
