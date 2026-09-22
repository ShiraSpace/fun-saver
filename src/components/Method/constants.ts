import { PERCENT_TOTAL } from '@/lib/constants';

export const METHOD_ROUTE = '/method';

export const share = (portion: number): string =>
  `${Math.round(portion * PERCENT_TOTAL)}%`;

export const METHOD_LAYOUT = {
  maxWidth: 420,
  gap: 18,
  paddingX: 14,
  paddingY: 16,
} as const;
