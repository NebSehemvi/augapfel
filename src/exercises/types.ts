/** A sentence with gaps: strings are text, numbers are gap indices. */
export type Seg = string | number;

export interface FillItem {
  parts: Seg[];
  /** accepted answers per gap (first = canonical) */
  answers: string[][];
  hint?: string;
  /** SRS key per gap */
  srs?: (string | undefined)[];
  note?: string;
  /** plausible wrong answers (for word-bank distractors) */
  distractors?: string[];
  /** show the first letter of the answer as an extra hint (typed verb gaps with a Russian hint) */
  firstLetter?: boolean;
}

export interface ChoiceItem {
  /** Either a sentence with exactly one gap (0) or a plain question */
  parts?: Seg[];
  question?: string;
  options: string[];
  answer: number;
  hint?: string;
  srs?: string;
  /** shown after answering */
  explain?: string;
}

export interface OrderItem {
  chunks: string[];
  /** accepted orders, as index sequences into chunks */
  answers: number[][];
  /** index of a chunk fixed in first position */
  fixedFirst?: number;
  punct: string;
  hint?: string;
  /** Full correct sentence for display (with commas etc.) */
  solution?: string;
}

export interface TableItem {
  chunks: { text: string; col: number }[];
  hint?: string;
}

export interface WriteItem {
  cues: string[];
  task: string;
  answers: string[];
  hint?: string;
}

export interface FormsItem {
  prompt: string;
  sub?: string;
  fields: { label: string; answers: string[]; srs?: string }[];
}

export interface BankItem {
  /** sentence with exactly one gap (0) */
  parts: Seg[];
  /** accepted tiles, first canonical */
  answers: string[];
  hint?: string;
  srs?: string;
}

/** One word, four meanings — pick the right card. */
export interface CardItem {
  prompt: string;
  sub?: string;
  options: string[];
  answer: number;
  srs?: string;
}

export interface ConjRow {
  label: string;
  answers: string[];
  given?: boolean;
}

export type Exercise =
  | { type: 'fill'; title: string; instruction: string; items: FillItem[] }
  | { type: 'choice'; title: string; instruction: string; items: ChoiceItem[]; layout?: 'inline' | 'list' }
  | { type: 'order'; title: string; instruction: string; item: OrderItem }
  | { type: 'table'; title: string; instruction: string; columns: string[]; item: TableItem }
  | { type: 'match'; title: string; instruction: string; pairs: [string, string][] }
  | { type: 'sort'; title: string; instruction: string; categories: string[]; items: { text: string; cat: number; srs?: string }[] }
  | { type: 'conj'; title: string; instruction: string; verb: string; tense: string; rows: ConjRow[]; srs?: string }
  | { type: 'write'; title: string; instruction: string; item: WriteItem }
  | { type: 'snake'; title: string; instruction: string; sentences: string[] }
  | { type: 'forms'; title: string; instruction: string; items: FormsItem[] }
  | { type: 'bank'; title: string; instruction: string; items: BankItem[]; bank: string[] }
  | { type: 'cards'; title: string; instruction: string; items: CardItem[] };

export interface SrsResult {
  key: string;
  ok: boolean;
}

export interface ExerciseResult {
  correct: number;
  total: number;
  srs: SrsResult[];
  /** short descriptions of mistakes for the summary */
  mistakes: string[];
}
