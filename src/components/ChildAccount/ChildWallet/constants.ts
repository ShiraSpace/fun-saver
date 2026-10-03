import type { WalletName } from '@/lib/wallet/types';

export const CHILD_WALLET_TEST_IDS = {
  card: 'child-wallet',
  balance: 'child-wallet-balance',
} as const;

export type ChildWalletName = Exclude<WalletName, 'savings'>;

export const CHILD_WALLET_COPY: Record<ChildWalletName, string> = {
  spending: 'יש לך לבזבז',
  goodDeeds: 'לתת למישהו אחר',
};
