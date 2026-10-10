'use client';

import { Fragment, JSX } from 'react';
import { useAccounts } from '@/components/Home/accounts-context';
import {
  APP_MODE,
  useAppMode,
} from '@/components/AccountManagement/app-mode-context';
import { AccountPicker } from '../AccountPicker';
import { EditAccountButton } from '../EditAccountButton';
import { MenuGoal } from '../MenuGoal';
import { useMenu } from '../use-menu-state';
import { useOpenAccount } from '../use-open-account';

export function AccountControls(): JSX.Element {
  const { accounts, currentAccount } = useAccounts();
  const { closeMenu } = useMenu();
  const { setMode } = useAppMode();
  const openAccount = useOpenAccount();

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
      <MenuGoal />
      <EditAccountButton
        accountName={currentAccount.name}
        onEditAccount={startEditingAccount}
      />
    </Fragment>
  );
}
