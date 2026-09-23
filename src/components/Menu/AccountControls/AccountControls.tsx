'use client';

import { Fragment, JSX } from 'react';
import { AccountPicker } from '../AccountPicker';
import { EditAccountButton } from '../EditAccountButton';
import { useAccounts } from '@/components/Home/accounts-context';
import {
  APP_MODE,
  useAppMode,
} from '@/components/AccountManagement/app-mode-context';

interface AccountControlsProps {
  onLeaveMenu: () => void;
  isAccountListOpen: boolean;
  onAccountListToggle: (isOpen: boolean) => void;
}

export function AccountControls({
  onLeaveMenu,
  isAccountListOpen,
  onAccountListToggle,
}: AccountControlsProps): JSX.Element {
  const { accounts, currentAccount, selectAccount } = useAccounts();
  const { setMode } = useAppMode();

  const handleSelectAccount = (id: string): void => {
    selectAccount(id);
    onLeaveMenu();
  };

  const handleAddAccount = (): void => {
    onLeaveMenu();
    setMode(APP_MODE.creatingAccount);
  };

  const handleEditAccount = (): void => {
    onLeaveMenu();
    setMode(APP_MODE.editingAccount);
  };

  return (
    <Fragment>
      <AccountPicker
        accounts={accounts}
        currentAccount={currentAccount}
        isOpen={isAccountListOpen}
        onToggle={onAccountListToggle}
        onSelect={handleSelectAccount}
        onAdd={handleAddAccount}
      />
      <EditAccountButton
        accountName={currentAccount.name}
        onEditAccount={handleEditAccount}
      />
    </Fragment>
  );
}
