import type { SpendableWalletName } from '@/lib/wallet/types';

export const CHILD_WALLET_TEST_IDS = {
  card: 'child-wallet',
  balance: 'child-wallet-balance',
} as const;

export const CHILD_WALLET_COPY: Record<SpendableWalletName, string> = {
  spending: 'יש לך לבזבז',
  goodDeeds: 'לתת למישהו אחר',
};
