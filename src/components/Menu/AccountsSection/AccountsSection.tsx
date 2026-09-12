'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import { MenuLabel } from '../MenuLabel';
import {
  ACCOUNTS_SECTION_CONTENT,
  ACCOUNTS_SECTION_STYLE,
  ACCOUNTS_SECTION_TEST_IDS,
} from './constants';
import { EditAccountChip } from '@/components/Menu/AccountsSection/EditAccountChip';
import { AddAccountChip } from '@/components/Menu/AccountsSection/AddAccountChip';
import { AccountChip } from '@/components/Menu/AccountsSection/AccountChip';
import { useAccounts } from '@/components/AccountSwitcher/accounts-context';
import { selectedAccount } from '@/lib/selected-account';
import { APP_MODE, useAppMode } from '@/components/Home/app-mode-context';

interface AccountsSectionProps {
  onAccountSelect: () => void;
}

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${ACCOUNTS_SECTION_STYLE.rowGap}px;
  flex-wrap: wrap;
`;

export const ActionPill = styled.button`
  height: ${ACCOUNTS_SECTION_STYLE.avatarSize}px;
  padding: 0 ${ACCOUNTS_SECTION_STYLE.pillPadding}px;
  border: none;
  border-radius: ${ACCOUNTS_SECTION_STYLE.avatarSize}px;
  background: rgba(255, 255, 255, 0.4);
  color: currentColor;
  font-family: inherit;
  font-size: ${ACCOUNTS_SECTION_STYLE.pillFontSize}px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: ${ACCOUNTS_SECTION_STYLE.pillGap}px;
  cursor: pointer;
  flex-shrink: 0;
  max-width: 100%;
`;

export const ActionChip = styled.button`
  width: ${ACCOUNTS_SECTION_STYLE.avatarSize}px;
  height: ${ACCOUNTS_SECTION_STYLE.avatarSize}px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  color: currentColor;
  font-size: ${ACCOUNTS_SECTION_STYLE.actionFontSize}px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
`;

export function AccountsSection({
  onAccountSelect,
}: AccountsSectionProps): JSX.Element {
  const { accounts, selectedAccountId, selectAccount } = useAccounts();
  const editTarget = selectedAccount(accounts, selectedAccountId);
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
        {editTarget && (
          <EditAccountChip
            accountName={editTarget.name}
            onEditAccount={handleEditAccount}
          />
        )}
        <AddAccountChip onAddAccount={handleAddAccount} />
      </Row>
    </section>
  );
}
