'use client';

import { JSX } from 'react';
import { AccountPicker } from '../AccountPicker';
import { EditAccountButton } from '../EditAccountButton';
import { GLOBAL_SCOPE_TEST_IDS } from './constants';
import { GlobalBlock } from './GlobalScope.styles';
import { useAccounts } from '@/components/Home/accounts-context';
import {
  APP_MODE,
  useAppMode,
} from '@/components/AccountManagement/app-mode-context';

interface GlobalScopeProps {
  onLeaveMenu: () => void;
  isAccountListOpen: boolean;
  onAccountListToggle: (isOpen: boolean) => void;
}

export function GlobalScope({
  onLeaveMenu,
  isAccountListOpen,
  onAccountListToggle,
}: GlobalScopeProps): JSX.Element {
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
    <GlobalBlock data-testid={GLOBAL_SCOPE_TEST_IDS.block}>
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
    </GlobalBlock>
  );
}
