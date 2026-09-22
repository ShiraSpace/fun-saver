'use client';

import { createContext, useContext } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { DEFAULT_THEME_ID } from '@/theme/registry';

const NO_ACCOUNT: AccountWithDerivedWallets = {
  id: '',
  name: '',
  avatarId: '',
  isActive: false,
  themeId: DEFAULT_THEME_ID,
  wallets: [],
};

export interface AccountsContextValue {
  accounts: AccountWithDerivedWallets[];
  currentAccount: AccountWithDerivedWallets;
  selectAccount: (id: string) => void;
}

const AccountsContext = createContext<AccountsContextValue>({
  accounts: [],
  currentAccount: NO_ACCOUNT,
  selectAccount: () => {},
});

export const AccountsProvider = AccountsContext.Provider;

export function useAccounts(): AccountsContextValue {
  return useContext(AccountsContext);
}
