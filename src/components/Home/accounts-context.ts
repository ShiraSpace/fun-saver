'use client';

import { createRequiredContext } from '@/hooks/create-required-context';
import type { AccountSummary } from '@/lib/account/types';

export interface AccountsContextValue {
  accounts: AccountSummary[];
  currentAccount: AccountSummary;
  switchAccount: (id: string) => void;
}

export const [AccountsProvider, useAccounts, useOptionalAccounts] =
  createRequiredContext<AccountsContextValue>('AccountsProvider');
