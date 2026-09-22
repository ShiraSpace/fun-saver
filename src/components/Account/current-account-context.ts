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

const CurrentAccountContext =
  createContext<AccountWithDerivedWallets>(NO_ACCOUNT);

export const CurrentAccountProvider = CurrentAccountContext.Provider;

export function useCurrentAccount(): AccountWithDerivedWallets {
  return useContext(CurrentAccountContext);
}
