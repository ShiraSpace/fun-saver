'use client';

import { createContext, useContext } from 'react';
import type { Account } from '@/lib/types';

export interface AccountSelection {
  accounts: Account[];
  selectedId: string;
  selectAccount: (id: string) => void;
}

const AccountSelectionContext = createContext<AccountSelection>({
  accounts: [],
  selectedId: '',
  selectAccount: () => undefined,
});

export const AccountSelectionProvider = AccountSelectionContext.Provider;

export function useAccountSelection(): AccountSelection {
  return useContext(AccountSelectionContext);
}
