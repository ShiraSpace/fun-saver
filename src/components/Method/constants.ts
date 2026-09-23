import { PERCENT_TOTAL } from '@/lib/constants';

export const METHOD_ROUTE = '/method';

export const share = (portion: number): string =>
  `${Math.round(portion * PERCENT_TOTAL)}%`;

export const SECTION_NUMBER = {
  why: 1,
  wallets: 2,
  promise: 3,
  actions: 4,
  scripts: 5,
  limits: 6,
} as const;

export const SOURCES_SECTION_ID = 'sources';
