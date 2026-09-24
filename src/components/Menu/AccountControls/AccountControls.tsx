'use client';

import { Fragment, JSX } from 'react';
import { AccountPicker } from '../AccountPicker';
import { EditAccountButton } from '../EditAccountButton';
import { useMenu } from '../use-menu-state';
import { useAccounts } from '@/components/Home/accounts-context';
import {
  APP_MODE,
  useAppMode,
} from '@/components/AccountManagement/app-mode-context';

export function AccountControls(): JSX.Element {
  const { accounts, currentAccount, switchAccount } = useAccounts();
  const { closeMenu } = useMenu();
  const { setMode } = useAppMode();

  const openAccount = (id: string): void => {
    switchAccount(id);
    closeMenu();
  };

  const startEditingAccount = (): void => {
    closeMenu();
    setMode(APP_MODE.editingAccount);
  };

  return (
    <Fragment>
      <AccountPicker
        accounts={accounts}
        currentAccount={currentAccount}
        onSelect={openAccount}
      />
      <EditAccountButton
        accountName={currentAccount.name}
        onEditAccount={startEditingAccount}
      />
    </Fragment>
  );
}
