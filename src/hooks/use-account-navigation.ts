import { Dispatch, SetStateAction, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Account, AccountSummary } from '@/lib/account/types';
import {
  APP_MODE,
  AppMode,
} from '@/components/AccountManagement/app-mode-context';
import { CURRENT_ACCOUNT_COOKIE, writeCookie } from '@/lib/cookies';
import { findCurrentAccount } from '@/lib/account/current-account';
import { resolveThemeId } from '@/theme/registry';
import { useSetThemeId } from '@/theme/AppThemeProvider';

export interface AccountNavigation {
  mode: AppMode;
  setMode: Dispatch<SetStateAction<AppMode>>;
  currentAccount?: AccountSummary;
  switchAccount: (id: string) => void;
  showNewAccount: (account: Account) => void;
  finishEditing: () => void;
  cancel: () => void;
  isCreating: boolean;
  editingAccount?: AccountSummary;
}

export function useAccountNavigation(
  accounts: AccountSummary[],
  initialAccountId: string
): AccountNavigation {
  const router = useRouter();
  const setThemeId = useSetThemeId();

  const [mode, setMode] = useState<AppMode>(APP_MODE.viewing);
  const [currentAccountId, setCurrentAccountId] = useState(initialAccountId);

  const switchAccount = (id: string): void => {
    setCurrentAccountId(id);
    writeCookie(CURRENT_ACCOUNT_COOKIE, id);

    const nextAccount = accounts.find((account) => account.id === id);
    setThemeId(resolveThemeId(nextAccount?.themeId));
  };

  const returnToViewing = (): void => setMode(APP_MODE.viewing);

  const finishEditing = (): void => {
    returnToViewing();
    router.refresh();
  };

  const currentAccount = findCurrentAccount(accounts, currentAccountId);
  const isEditing = mode === APP_MODE.editingAccount;

  return {
    mode,
    setMode,
    currentAccount,
    switchAccount,
    showNewAccount: (account): void => {
      switchAccount(account.id);
      finishEditing();
    },
    finishEditing,
    cancel: returnToViewing,
    isCreating: mode === APP_MODE.creatingAccount,
    editingAccount: isEditing ? currentAccount : undefined,
  };
}
