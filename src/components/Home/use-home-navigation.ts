import { Dispatch, SetStateAction, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Account, AccountWithDerivedWallets } from '@/lib/types';
import { useAccountSelection } from '@/hooks/use-account-selection';
import { APP_MODE, AppMode } from './app-mode-context';

interface HomeNavigation {
  mode: AppMode;
  setMode: Dispatch<SetStateAction<AppMode>>;
  currentAccount?: AccountWithDerivedWallets;
  selectAccount: (id: string) => void;
  showNewAccount: (account: Account) => void;
  finishEditing: () => void;
  cancel: () => void;
  isCreating: boolean;
  editingAccount?: AccountWithDerivedWallets;
}

export function useHomeNavigation(
  accounts: AccountWithDerivedWallets[],
  initialAccountId: string
): HomeNavigation {
  const router = useRouter();
  const { currentAccount, selectAccount } = useAccountSelection(
    accounts,
    initialAccountId
  );

  const [mode, setMode] = useState<AppMode>(APP_MODE.viewing);

  const returnToViewing = (): void => setMode(APP_MODE.viewing);

  const finishEditing = (): void => {
    returnToViewing();
    router.refresh();
  };

  const isEditing = mode === APP_MODE.editingAccount;

  return {
    mode,
    setMode,
    currentAccount,
    selectAccount,
    showNewAccount: (account): void => {
      selectAccount(account.id);
      finishEditing();
    },
    finishEditing,
    cancel: returnToViewing,
    isCreating: mode === APP_MODE.creatingAccount,
    editingAccount: isEditing ? currentAccount : undefined,
  };
}
