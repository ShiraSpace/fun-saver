'use client';

import { createRequiredContext } from '@/hooks/create-required-context';
import type { AccountSummary } from '@/lib/account/types';
import type { AppViewMode } from '@/lib/account/view-mode';

export interface ViewModeChoice {
  showViewMode: (viewMode: AppViewMode) => void;
}

export interface AccountsContextValue {
  accounts: AccountSummary[];
  currentAccount: AccountSummary;
  switchAccount: (id: string) => void;
  viewModeChoice?: ViewModeChoice;
}

export const [AccountsProvider, useAccounts, useOptionalAccounts] =
  createRequiredContext<AccountsContextValue>('AccountsProvider');
