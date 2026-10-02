import s from './common.module.css';

export function Spinner({ large }: { large?: boolean }) {
  return <span className={`${s.spinner} ${large ? s.spinnerLarge : ''}`} aria-hidden />;
}
