import { Dispatch, SetStateAction, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Account, AccountWithDerivedWallets } from '@/lib/types';
import { resolveThemeId } from '@/theme/registry';
import { useSetThemeId } from '@/theme/ThemeController';
import { selectedAccount } from '@/lib/selected-account';
import { APP_MODE, AppMode } from './app-mode-context';
import { persistSelectedAccount } from './selected-account-cookie';

interface HomeNavigation {
  mode: AppMode;
  setMode: Dispatch<SetStateAction<AppMode>>;
  selectedAccountId: string;
  selectAccount: (id: string) => void;
  showNewAccount: (account: Account) => void;
  finishEditing: () => void;
  cancel: () => void;
  hasAccounts: boolean;
  isCreating: boolean;
  editingAccount?: AccountWithDerivedWallets;
}

export function useHomeNavigation(
  accounts: AccountWithDerivedWallets[],
  initialAccountId: string
): HomeNavigation {
  const router = useRouter();
  const setThemeId = useSetThemeId();

  const [mode, setMode] = useState<AppMode>(APP_MODE.viewing);
  const [selectedAccountId, setSelectedAccountId] = useState(initialAccountId);

  const selectAccount = (id: string): void => {
    setSelectedAccountId(id);
    persistSelectedAccount(id);

    const target = accounts.find((account) => account.id === id);
    setThemeId(resolveThemeId(target?.themeId));
  };

  const returnToViewing = (): void => setMode(APP_MODE.viewing);

  const finishEditing = (): void => {
    returnToViewing();
    router.refresh();
  };

  const hasAccounts = accounts.length > 0;
  const isEditing = mode === APP_MODE.editingAccount;

  return {
    mode,
    setMode,
    selectedAccountId,
    selectAccount,
    showNewAccount: (account): void => {
      selectAccount(account.id);
      finishEditing();
    },
    finishEditing,
    cancel: returnToViewing,
    hasAccounts,
    isCreating: mode === APP_MODE.creatingAccount,
    editingAccount:
      isEditing && hasAccounts
        ? selectedAccount(accounts, selectedAccountId)
        : undefined,
  };
}
