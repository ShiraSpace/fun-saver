'use client';

import { JSX } from 'react';
import { MenuLabel } from '../MenuLabel';
import {
  ACCOUNTS_SECTION_CONTENT,
  ACCOUNTS_SECTION_TEST_IDS,
} from './constants';
import { EditAccountChip } from '@/components/Menu/AccountsSection/EditAccountChip';
import { AddAccountChip } from '@/components/Menu/AccountsSection/AddAccountChip';
import { AccountChip } from '@/components/Menu/AccountsSection/AccountChip';
import { useAccounts } from '@/components/AccountSwitcher/accounts-context';
import { APP_MODE, useAppMode } from '@/components/Home/app-mode-context';
import { Row } from './AccountsSection.styles';

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

  const accountChips = accounts.map((account) => (
    <AccountChip
      key={account.id}
      account={account}
      isSelected={account.id === selectedAccountId}
      onSelect={handleSelectAccount}
    />
  ));

  return (
    <section data-testid={ACCOUNTS_SECTION_TEST_IDS.section}>
      <MenuLabel>{ACCOUNTS_SECTION_CONTENT.label}</MenuLabel>
      <Row>
        {accountChips}
        <EditAccountChip onEditAccount={handleEditAccount} />
        <AddAccountChip onAddAccount={handleAddAccount} />
      </Row>
    </section>
  );
}
