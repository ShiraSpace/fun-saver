import { WALLET_NAMES } from '@/lib/wallet/constants';
import type { WalletName } from '@/lib/wallet/types';

export const TRANSACTIONS_ROUTE = '/transactions';

export const TRANSACTIONS_COPY = {
  title: 'תנועות',
} as const;

export const SHOWN_BALANCE = {
  totalBalance: 'totalBalance',
  savings: WALLET_NAMES.savings,
  spending: WALLET_NAMES.spending,
  goodDeeds: WALLET_NAMES.goodDeeds,
} as const satisfies Record<string, 'totalBalance' | WalletName>;

export type ShownBalance = (typeof SHOWN_BALANCE)[keyof typeof SHOWN_BALANCE];
