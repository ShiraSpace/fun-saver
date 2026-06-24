'use client';

import { createContext, useContext } from 'react';
import type { Account } from '@/lib/types';

export interface AccountsContextValue {
  accounts: Account[];
  selectedAccountId: string;
  selectAccount: (id: string) => void;
}

const AccountsContext = createContext<AccountsContextValue>({
  accounts: [],
  selectedAccountId: '',
  selectAccount: () => undefined,
});

export const AccountsProvider = AccountsContext.Provider;

export function useAccounts(): AccountsContextValue {
  return useContext(AccountsContext);
}
