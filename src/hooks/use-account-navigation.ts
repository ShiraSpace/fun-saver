import { Dispatch, SetStateAction, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Account, AccountWithDerivedWallets } from '@/lib/types';
import {
  APP_MODE,
  AppMode,
} from '@/components/AccountManagement/app-mode-context';
import { useAccountSelection } from './use-account-selection';

export interface AccountNavigation {
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

export function useAccountNavigation(
  accounts: AccountWithDerivedWallets[],
  initialAccountId: string
): AccountNavigation {
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
