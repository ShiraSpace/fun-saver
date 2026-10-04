'use client';

import { Fragment, JSX } from 'react';
import { useAccounts } from '@/components/Home/accounts-context';
import { VIEW_MODE } from '@/lib/account/view-mode';
import {
  APP_MODE,
  useAppMode,
} from '@/components/AccountManagement/app-mode-context';
import { AccountPicker } from '../AccountPicker';
import { EditAccountButton } from '../EditAccountButton';
import { ViewModeSwitch } from '../ViewModeSwitch';
import { useMenu } from '../use-menu-state';
import { useOpenAccount } from '../use-open-account';
import { ChildViewSetting } from './AccountControls.styles';

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
      <ChildViewSetting>
        <ViewModeSwitch viewMode={VIEW_MODE.child} />
      </ChildViewSetting>
      <EditAccountButton
        accountName={currentAccount.name}
        onEditAccount={startEditingAccount}
      />
    </Fragment>
  );
}
