import type { WalletName } from '@/lib/types';

export type TalkTone = 'spoken' | 'struck' | 'muted';

export interface TalkLine {
  tone: TalkTone;
  text: string;
}

export type MethodBlock =
  | { kind: 'heading'; body: string }
  | { kind: 'text'; body: string; muted?: boolean }
  | { kind: 'quote'; body: string; citation: string }
  | { kind: 'talk'; label: string; lines: readonly TalkLine[] };

export interface IconLine {
  icon: string;
  body: string;
  note?: string;
}

export interface ActionItem {
  done: boolean;
  question: string;
  answer: string;
}

export interface ActionGroup {
  label: string;
  items: readonly ActionItem[];
}

export interface ExampleRow {
  wallet: WalletName;
  amounts: readonly string[];
}

export interface ExampleTable {
  headers: readonly string[];
  rows: readonly ExampleRow[];
}

export interface Source {
  claim: string;
  citation: string;
  url: string;
}
