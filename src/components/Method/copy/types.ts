import type { WalletName } from '@/lib/wallet/types';
import { SOURCES_COPY } from './sources';

export type SourceId = (typeof SOURCES_COPY.list)[number]['id'];

export type TalkTone = 'spoken' | 'struck' | 'muted';

export interface TalkLine {
  tone: TalkTone;
  text: string;
}

export type MethodBlock =
  | { kind: 'heading'; body: string }
  | {
      kind: 'text';
      body: string;
      muted?: boolean;
      sources?: readonly SourceId[];
    }
  | {
      kind: 'quote';
      body: string;
      citation: string;
      sources?: readonly SourceId[];
    }
  | { kind: 'talk'; label?: string; lines: readonly TalkLine[] };

export interface KeyPointCopy {
  icon: string;
  body: string;
  note?: string;
}

export interface ChecklistItem {
  done: boolean;
  question: string;
  answer: string;
}

export interface ChecklistGroup {
  label: string;
  items: readonly ChecklistItem[];
}

export interface ExampleRow {
  walletName: WalletName;
  amounts: readonly string[];
}

export interface ExampleTable {
  headers: readonly string[];
  rows: readonly ExampleRow[];
}

export interface Source {
  id: SourceId;
  claim: string;
  citation: string;
  url: string;
}
