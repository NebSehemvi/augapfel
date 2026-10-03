import type { Level } from '../grammar/types';

export interface Pronoun {
  /** stable id (the same German form can have several meanings: ihr = вы / ей / её) */
  id: string;
  de: string;
  /** Russian with the case or kind, so every card has exactly one answer */
  ru: string;
  en: string;
  group: 'personal' | 'possessive' | 'question' | 'other';
  level: Level;
}

// id|de|ru|en|group|level
const ROWS = `
ich|ich|я|I|personal|A1
du|du|ты|you|personal|A1
er|er|он|he|personal|A1
sie-f|sie|она|she|personal|A1
es|es|оно; это|it|personal|A1
wir|wir|мы|we|personal|A1
ihr-pl|ihr|вы (мн. ч.)|you (plural)|personal|A1
sie-pl|sie|они|they|personal|A1
Sie|Sie|Вы (вежливо)|you (formal)|personal|A1
mich|mich|меня (Akk.)|me|personal|A1
dich|dich|тебя (Akk.)|you (acc.)|personal|A1
ihn|ihn|его (Akk.)|him|personal|A1
sie-akk|sie|её (Akk.)|her (acc.)|personal|A1
uns-akk|uns|нас (Akk.)|us|personal|A1
euch-akk|euch|вас (мн. ч., Akk.)|you (pl., acc.)|personal|A1
sie-pl-akk|sie|их (Akk.)|them|personal|A1
Sie-akk|Sie|Вас (вежливо, Akk.)|you (formal, acc.)|personal|A1
mir|mir|мне (Dat.)|(to) me|personal|A1
dir|dir|тебе (Dat.)|(to) you|personal|A1
ihm|ihm|ему (Dat.)|(to) him|personal|A1
ihr-dat|ihr|ей (Dat.)|(to) her|personal|A1
uns-dat|uns|нам (Dat.)|(to) us|personal|A1
euch-dat|euch|вам (мн. ч., Dat.)|(to) you (pl.)|personal|A1
ihnen|ihnen|им (Dat.)|(to) them|personal|A1
Ihnen|Ihnen|Вам (вежливо, Dat.)|(to) you (formal)|personal|A1
mein|mein|мой|my|possessive|A1
dein|dein|твой|your|possessive|A1
sein|sein|его (притяж.)|his|possessive|A1
ihr-poss-f|ihr|её (притяж.)|her|possessive|A1
unser|unser|наш|our|possessive|A1
euer|euer|ваш (мн. ч.)|your (plural)|possessive|A1
ihr-poss-pl|ihr|их (притяж.)|their|possessive|A1
Ihr|Ihr|Ваш (вежливо)|your (formal)|possessive|A1
wer|wer|кто|who|question|A1
was|was|что|what|question|A1
wen|wen|кого|whom|question|A1
wem|wem|кому|to whom|question|A1
welcher|welcher|какой, который|which|question|A1
man|man|«люди», безличное «-ют»|one, people|other|A1
jemand|jemand|кто-то|somebody|other|A2
niemand|niemand|никто|nobody|other|A2
etwas|etwas|что-то|something|other|A1
nichts|nichts|ничего|nothing|other|A1
alle|alle|все|all, everybody|other|A1
jeder|jeder|каждый|every, everyone|other|A2
dieser|dieser|этот|this|other|A2
`;

export const PRONOUNS_LIST: Pronoun[] = ROWS.trim()
  .split('\n')
  .map((line) => {
    const [id, de, ru, en, group, level] = line.split('|');
    return { id, de, ru, en, group: group as Pronoun['group'], level: level as Level };
  });

export const PRONOUN_GROUP_LABEL: Record<Pronoun['group'], string> = {
  personal: 'Личные',
  possessive: 'Притяжательные',
  question: 'Вопросительные',
  other: 'Другие',
};
