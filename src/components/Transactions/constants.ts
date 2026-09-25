import type { WalletName } from '@/lib/wallet/types';

export const TRANSACTIONS_ROUTE = '/transactions';

export const TRANSACTIONS_COPY = {
  title: 'תנועות',
} as const;

export const SHOWN_BALANCE = {
  totalBalance: 'totalBalance',
  savings: 'savings',
  spending: 'spending',
  goodDeeds: 'goodDeeds',
} as const satisfies Record<string, 'totalBalance' | WalletName>;

export type ShownBalance = (typeof SHOWN_BALANCE)[keyof typeof SHOWN_BALANCE];
