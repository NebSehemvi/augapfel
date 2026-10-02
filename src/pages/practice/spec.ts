import type { Route } from '../../lib/router';
import { dueKeys, getProgress } from '../../lib/progress';
import { reviewSession, textSession, topicSession, trainerSession, wordsSession, type Session, type TrainerMode, type TrainerPool } from '../../exercises/session';
import { findText } from '../../lib/userTexts';
import { providerLabel } from '../../ai/llm';
import type { Level } from '../../grammar/types';
import { getTopic } from '../../topics';

/** What a practice route runs: how to build the session, where "back" goes, how results are recorded. */
export interface Spec {
  key: string;
  back: string;
  title: string;
  make: () => Session | Promise<Session>;
  topicId?: string;
  /** shown while an async (AI) session is being generated */
  loading?: string;
}

export function specFor(route: Route): Spec {
  const [section, id] = route.path;
  if (section === 't') {
    const topic = getTopic(id);
    if (route.path[2] === 'ai') {
      return {
        key: `t/${id}/ai`,
        back: `/t/${id}`,
        title: topic?.ru ?? id,
        topicId: id,
        make: async () => (await import('../../ai/generate')).aiTopicSession(id, getProgress()),
        loading: `${providerLabel()} готовит упражнения… Обычно это занимает 20–60 секунд.`,
      };
    }
    return { key: `t/${id}`, back: `/t/${id}`, title: topic?.ru ?? id, topicId: id, make: () => topicSession(id, getProgress()) };
  }
  if (section === 'read') {
    const text = findText(id);
    return {
      key: `read/${id}`,
      back: `/read/${id}`,
      title: text?.title ?? 'Текст',
      topicId: `text:${id}`,
      make: () => {
        if (!text) throw new Error('Текст не найден');
        return textSession(text, getProgress());
      },
    };
  }
  if (section === 'words') {
    return { key: 'words', back: '/words', title: 'Мои слова', topicId: 'words', make: () => wordsSession(getProgress()) };
  }
  if (section === 'verbs') {
    const q = route.query;
    const levels = (q.get('levels') ?? 'A1,A2').split(',') as Level[];
    return {
      key: 'verbs',
      back: '/verbs',
      title: 'Тренажёр глаголов',
      topicId: 'trainer',
      make: () =>
        trainerSession(
          { pool: (q.get('pool') ?? 'table') as TrainerPool, mode: (q.get('mode') ?? 'forms') as TrainerMode, levels, count: Number(q.get('count') ?? 12) },
          getProgress(),
        ),
    };
  }
  return { key: 'review', back: '/review', title: 'Повторение', topicId: 'review', make: () => reviewSession(dueKeys().slice(0, 30), getProgress().words) };
}
