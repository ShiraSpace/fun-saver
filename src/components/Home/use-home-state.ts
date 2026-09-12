import { Dispatch, SetStateAction, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Account, AccountWithDerivedWallets } from '@/lib/types';
import { resolveThemeId } from '@/theme/registry';
import { useSetThemeId } from '@/theme/ThemeController';
import { selectedAccount } from '@/lib/selected-account';
import { APP_MODE, AppMode } from './app-mode-context';
import { persistSelectedAccount } from './selected-account-cookie';

interface HomeState {
  mode: AppMode;
  setMode: Dispatch<SetStateAction<AppMode>>;
  selectedAccountId: string;
  selectAccount: (id: string) => void;
  handleCreated: (account: Account) => void;
  handleUpdated: () => void;
  hasAccounts: boolean;
  isCreating: boolean;
  editingAccount?: AccountWithDerivedWallets;
}

export function useHomeState(
  accounts: AccountWithDerivedWallets[],
  initialAccountId: string
): HomeState {
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

  const handleCreated = (account: Account): void => {
    selectAccount(account.id);
    setMode(APP_MODE.viewing);
    router.refresh();
  };

  const handleUpdated = (): void => {
    setMode(APP_MODE.viewing);
    router.refresh();
  };

  const hasAccounts = accounts.length > 0;
  const isEditing = mode === APP_MODE.editingAccount;

  return {
    mode,
    setMode,
    selectedAccountId,
    selectAccount,
    handleCreated,
    handleUpdated,
    hasAccounts,
    isCreating: mode === APP_MODE.creatingAccount,
    editingAccount:
      isEditing && hasAccounts
        ? selectedAccount(accounts, selectedAccountId)
        : undefined,
  };
}
