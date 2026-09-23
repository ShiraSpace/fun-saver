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
  const { accounts, currentAccount, selectAccount } = useAccounts();
  const { close } = useMenu();
  const { setMode } = useAppMode();

  const handleSelectAccount = (id: string): void => {
    selectAccount(id);
    close();
  };

  const handleEditAccount = (): void => {
    close();
    setMode(APP_MODE.editingAccount);
  };

  return (
    <Fragment>
      <AccountPicker
        accounts={accounts}
        currentAccount={currentAccount}
        onSelect={handleSelectAccount}
      />
      <EditAccountButton
        accountName={currentAccount.name}
        onEditAccount={handleEditAccount}
      />
    </Fragment>
  );
}
