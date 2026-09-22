'use client';

import { JSX } from 'react';
import { MenuLabel } from '../MenuLabel';
import { AccountPicker } from '../AccountPicker';
import {
  ACCOUNTS_SECTION_CONTENT,
  ACCOUNTS_SECTION_TEST_IDS,
} from './constants';
import { EditAccountChip } from '@/components/Menu/AccountsSection/EditAccountChip';
import { useAccounts } from '@/components/AccountSwitcher/accounts-context';
import { APP_MODE, useAppMode } from '@/components/Home/app-mode-context';

interface AccountsSectionProps {
  onAccountSelect: () => void;
}

export function AccountsSection({
  onAccountSelect,
}: AccountsSectionProps): JSX.Element {
  const { accounts, selectedAccountId, selectAccount } = useAccounts();
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
        selectedAccountId={selectedAccountId}
        onSelect={handleSelectAccount}
        onAdd={handleAddAccount}
      />
      <EditAccountChip onEditAccount={handleEditAccount} />
    </section>
  );
}
