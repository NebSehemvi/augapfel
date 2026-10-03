import { useState } from 'react';
import { addWord, useProgress } from '../../lib/progress';
import { lookupLocal, lookupWiktionary, POS_LABEL, type WordInfo } from '../../lib/dictionary';
import { germanForm, meaning } from '../../exercises/vocab';
import { Button } from '../common/Button';
import { FormRow } from '../common/FormRow';
import { Muted } from '../common/Muted';
import { Panel } from '../common/Panel';
import { TextInput } from '../common/TextInput';
import s from './lexicon.module.css';

/** Look up a German word (offline dictionary, then Wiktionary) and add it to "⭐ Мои слова". */
export function AddWord() {
  const progress = useProgress();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<WordInfo | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  const find = async () => {
    const w = input.trim();
    if (!w) return;
    setBusy(true);
    setResult(lookupLocal(w) ?? (await lookupWiktionary(w)));
    setBusy(false);
  };

  return (
    <Panel title="Добавить слово">
      <FormRow onSubmit={find}>
        <TextInput placeholder="Немецкое слово, например: Brötchen" value={input} onValue={setInput} lang="de" autoCapitalize="off" />
        <Button variant="compact" type="submit" disabled={!input.trim() || busy}>
          Найти
        </Button>
      </FormRow>
      {result === null && <Muted as="p">Не нашёл это слово.</Muted>}
      {result && (
        <div className={s.result}>
          <div>
            <b lang="de">{germanForm(result)}</b> <Muted>{POS_LABEL[result.pos]}</Muted>
            <div>{meaning(result)}</div>
          </div>
          {progress.words[result.lemma] ? (
            <Muted>✓ уже в списке</Muted>
          ) : (
            <Button
              variant="compact"
              onClick={() => {
                addWord({ lemma: result.lemma, pos: result.pos, ru: result.ru, en: result.en, pl: result.pl });
                setInput('');
                setResult(undefined);
              }}
            >
              ＋ Добавить
            </Button>
          )}
        </div>
      )}
    </Panel>
  );
}
