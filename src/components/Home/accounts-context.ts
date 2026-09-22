'use client';

import { createContext, useContext } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';

const NO_PROVIDER = 'useAccounts needs an AccountsProvider above it';

export interface AccountsContextValue {
  accounts: AccountWithDerivedWallets[];
  currentAccount: AccountWithDerivedWallets;
  selectAccount: (id: string) => void;
}

const AccountsContext = createContext<AccountsContextValue | null>(null);

export const AccountsProvider = AccountsContext.Provider;

export function useAccounts(): AccountsContextValue {
  const value = useContext(AccountsContext);

  if (!value) {
    throw new Error(NO_PROVIDER);
  }

  return value;
}
