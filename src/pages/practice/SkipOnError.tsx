import { Component, type ReactNode } from 'react';
import { Button } from '../common/Button';
import s from './practice.module.css';

/** If a single exercise fails to render, offer to skip it instead of breaking the whole session. */
export class SkipOnError extends Component<{ children: ReactNode; onSkip: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(e: unknown) {
    console.error(e);
  }
  render() {
    if (this.state.failed) {
      return (
        <div className={s.empty}>
          <p>Это упражнение не удалось показать.</p>
          <Button variant="secondary" onClick={this.props.onSkip}>
            Пропустить
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
