import { Component, type ReactNode } from 'react';
import { useRoute, href } from './lib/router';
import { useProgress, dueKeys } from './lib/progress';
import { Home } from './pages/Home';
import { TopicPage } from './pages/TopicPage';
import { Practice } from './pages/Practice';
import { WordsPage } from './pages/WordsPage';
import { TextsPage } from './pages/TextsPage';
import { ReaderPage } from './pages/ReaderPage';
import { ReviewPage } from './pages/ReviewPage';
import { ProfilePage } from './pages/ProfilePage';
import s from './App.module.css';

export default function App() {
  const route = useRoute();
  const [section, id, sub] = route.path;
  const practicing =
    (section === 't' && (sub === 'practice' || sub === 'ai')) ||
    (section === 'verbs' && id === 'train') ||
    (section === 'review' && id === 'start') ||
    (section === 'read' && sub === 'practice') ||
    (section === 'words' && id === 'train');

  let page: ReactNode;
  if (practicing) page = <Practice route={route} />;
  else if (section === 't' && id) page = <TopicPage id={id} />;
  else if (section === 'verbs') page = <WordsPage tab="verbs" />;
  else if (section === 'words') page = <WordsPage tab="mine" />;
  else if (section === 'texts') page = <TextsPage />;
  else if (section === 'read' && id) page = <ReaderPage id={id} />;
  else if (section === 'review') page = <ReviewPage />;
  else if (section === 'me') page = <ProfilePage />;
  else page = <Home />;

  return (
    <div className={s.app}>
      {!practicing && <TopBar active={section ?? ''} />}
      <main className={`${s.main} ${practicing ? s.mainPractice : ''}`}>
        <ErrorBoundary key={route.path.join('/')}>{page}</ErrorBoundary>
      </main>
      {!practicing && <TabBar active={section ?? ''} />}
    </div>
  );
}

const TABS = [
  { key: '', to: '/', icon: '📖', label: 'Темы' },
  { key: 'texts', to: '/texts', icon: '📰', label: 'Тексты' },
  { key: 'words', to: '/words', icon: '🗂️', label: 'Слова' },
  { key: 'review', to: '/review', icon: '🔁', label: 'Повторение' },
  { key: 'me', to: '/me', icon: '👤', label: 'Профиль' },
];

/** Which tab a route belongs to. */
function tabOf(section: string) {
  if (section === 't') return '';
  if (section === 'verbs') return 'words';
  if (section === 'read') return 'texts';
  return section;
}

function useDueCount() {
  useProgress();
  return dueKeys().length;
}

function TopBar({ active }: { active: string }) {
  const due = useDueCount();
  const current = tabOf(active);
  return (
    <header className={s.top}>
      <a className={s.brand} href={href('/')}>
        <span className={s.logo} aria-hidden>
          ä
        </span>
        Augapfel
      </a>
      <nav className={s.topNav}>
        {TABS.map((t) => (
          <a key={t.key} href={href(t.to)} className={`${s.topLink} ${current === t.key ? s.active : ''}`}>
            {t.label}
            {t.key === 'review' && due > 0 && <span className={s.badge}>{due}</span>}
          </a>
        ))}
      </nav>
    </header>
  );
}

function TabBar({ active }: { active: string }) {
  const due = useDueCount();
  const current = tabOf(active);
  return (
    <nav className={s.tabbar}>
      {TABS.map((t) => (
        <a key={t.key} href={href(t.to)} className={`${s.tab} ${current === t.key ? s.active : ''}`}>
          <span className={s.tabIcon} aria-hidden>
            {t.icon}
            {t.key === 'review' && due > 0 && <span className={s.dot}>{due > 99 ? '99+' : due}</span>}
          </span>
          {t.label}
        </a>
      ))}
    </nav>
  );
}

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className={s.error}>
          <h2>Что-то пошло не так 😕</h2>
          <p>{this.state.error.message}</p>
          <a href={href('/')}>На главную</a>
        </div>
      );
    }
    return this.props.children;
  }
}
