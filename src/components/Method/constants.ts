import { PERCENT_TOTAL } from '@/lib/constants';

export const METHOD_ROUTE = '/method';

export const share = (portion: number): string =>
  `${Math.round(portion * PERCENT_TOTAL)}%`;

export const METHOD_LAYOUT = {
  maxWidth: 420,
  gap: 18,
  paddingX: 14,
} as const;

export const SECTION_NUMBER = {
  why: 1,
  wallets: 2,
  promise: 3,
  actions: 4,
  scripts: 5,
} as const;
