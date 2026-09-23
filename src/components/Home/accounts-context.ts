'use client';

import { createRequiredContext } from '@/hooks/create-required-context';
import type { AccountWithDerivedWallets } from '@/lib/types';

export const NO_PROVIDER = 'useAccounts needs an AccountsProvider above it';

export interface AccountsContextValue {
  accounts: AccountWithDerivedWallets[];
  currentAccount: AccountWithDerivedWallets;
  selectAccount: (id: string) => void;
}

export const [AccountsProvider, useAccounts, useOptionalAccounts] =
  createRequiredContext<AccountsContextValue>(NO_PROVIDER);
