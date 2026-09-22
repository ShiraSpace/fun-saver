'use client';

import { useState } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { selectedAccount } from '@/lib/selected-account';
import { persistSelectedAccount } from '@/components/Home/selected-account-cookie';
import { resolveThemeId } from '@/theme/registry';
import { useSetThemeId } from '@/theme/ThemeController';

interface AccountSelection {
  currentAccount?: AccountWithDerivedWallets;
  selectAccount: (id: string) => void;
}

export function useAccountSelection(
  accounts: AccountWithDerivedWallets[],
  initialAccountId: string
): AccountSelection {
  const setThemeId = useSetThemeId();
  const [selectedAccountId, setSelectedAccountId] = useState(initialAccountId);

  const selectAccount = (id: string): void => {
    setSelectedAccountId(id);
    persistSelectedAccount(id);

    const target = accounts.find((account) => account.id === id);
    setThemeId(resolveThemeId(target?.themeId));
  };

  return {
    currentAccount: selectedAccount(accounts, selectedAccountId),
    selectAccount,
  };
}
