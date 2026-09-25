import type { WalletName } from '@/lib/wallet/types';

export const TRANSACTION_TYPE = {
  deposit: 'deposit',
  withdrawal: 'withdrawal',
  interest: 'interest',
} as const;

export const ALL_TRANSACTION_TYPES = 'all';

export const INTEREST_MODE = {
  monthly: 'monthly',
  daily: 'daily',
} as const;

export const DEPOSIT_SHARES: Record<WalletName, number> = {
  savings: 0.4,
  spending: 0.5,
  goodDeeds: 0.1,
};
