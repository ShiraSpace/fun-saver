'use client';

import { JSX } from 'react';
import { MenuLabel } from '../MenuLabel';
import { AccountPicker } from '../AccountPicker';
import {
  ACCOUNTS_SECTION_CONTENT,
  ACCOUNTS_SECTION_TEST_IDS,
} from './constants';
import { EditAccountButton } from '@/components/Menu/AccountsSection/EditAccountButton';
import { useAccounts } from '@/components/Home/accounts-context';
import {
  APP_MODE,
  useAppMode,
} from '@/components/AccountManagement/app-mode-context';

interface AccountsSectionProps {
  onAccountSelect: () => void;
  isAccountListOpen: boolean;
  onAccountListToggle: (isOpen: boolean) => void;
}

export function AccountsSection({
  onAccountSelect,
  isAccountListOpen,
  onAccountListToggle,
}: AccountsSectionProps): JSX.Element {
  const { accounts, currentAccount, selectAccount } = useAccounts();
  const { setMode } = useAppMode();

  const handleSelectAccount = (id: string): void => {
    selectAccount(id);
    onAccountSelect();
  };

  const handleAddAccount = (): void => {
    onAccountSelect();
    setMode(APP_MODE.creatingAccount);
  };

  const handleEditAccount = (): void => {
    onAccountSelect();
    setMode(APP_MODE.editingAccount);
  };

  return (
    <section data-testid={ACCOUNTS_SECTION_TEST_IDS.section}>
      <MenuLabel>{ACCOUNTS_SECTION_CONTENT.label}</MenuLabel>
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
    </section>
  );
}
