'use client';

import { createRequiredContext } from '@/hooks/create-required-context';
import type { AccountSummary } from '@/lib/account/types';
import type { ViewMode } from '@/lib/account/view-mode';

export interface ViewModeChoice {
  showViewMode: (viewMode: ViewMode) => void;
  holdViewMode: (viewMode: ViewMode) => void;
}

export interface AccountsContextValue {
  accounts: AccountSummary[];
  currentAccount: AccountSummary;
  switchAccount: (id: string) => void;
  viewModeChoice?: ViewModeChoice;
}

export const [AccountsProvider, useAccounts, useOptionalAccounts] =
  createRequiredContext<AccountsContextValue>('AccountsProvider');
