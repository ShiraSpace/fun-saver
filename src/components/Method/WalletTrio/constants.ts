import { PERCENT_TOTAL } from '@/lib/constants';

export const WALLET_TRIO_TEST_IDS = {
  trio: 'method-wallet-trio',
  pot: 'method-wallet-pot',
  share: 'method-wallet-share',
} as const;

export const WALLET_TRIO_COPY = {
  share: (portion: number): string => `${Math.round(portion * PERCENT_TOTAL)}%`,
} as const;
