'use client';

import { createRequiredContext } from '@/hooks/create-required-context';
import type { AccountWithDerivedWallets } from '@/lib/types';

export interface AccountsContextValue {
  accounts: AccountWithDerivedWallets[];
  currentAccount: AccountWithDerivedWallets;
  switchAccount: (id: string) => void;
}

export const [AccountsProvider, useAccounts, useOptionalAccounts] =
  createRequiredContext<AccountsContextValue>('AccountsProvider');
