import type { ReadingText } from '../../data/texts';
import type { TopicStat } from '../../lib/progress';
import { href } from '../../lib/router';
import { CardLink } from '../common/CardLink';
import { LevelBadge } from '../common/LevelBadge';
import { ScoreBadge } from '../common/ScoreBadge';

export function TextCard({ text, stat }: { text: ReadingText; stat?: TopicStat }) {
  return (
    <CardLink
      href={href(`/read/${text.id}`)}
      titleLang="de"
      title={
        <>
          {text.title} <LevelBadge level={text.level} />
        </>
      }
      sub={text.paragraphs[0]}
      badge={<ScoreBadge stat={stat} />}
    />
  );
}
