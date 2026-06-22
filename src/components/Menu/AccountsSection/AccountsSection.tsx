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
import { useAccountSelection } from '@/components/AccountSwitcher/account-selection-context';

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${ACCOUNTS_SECTION_STYLE.rowGap}px;
  flex-wrap: wrap;
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

export function AccountsSection(): JSX.Element {
  const { accounts, selectedId, selectAccount } = useAccountSelection();

  const accountChips = accounts.map((account) => (
    <AccountChip
      key={account.id}
      account={account}
      isSelected={account.id === selectedId}
      onSelect={selectAccount}
    />
  ));

  return (
    <section data-testid={ACCOUNTS_SECTION_TEST_IDS.section}>
      <MenuLabel>{ACCOUNTS_SECTION_CONTENT.label}</MenuLabel>
      <Row>
        {accountChips}
        <EditAccountChip />
        <AddAccountChip />
      </Row>
    </section>
  );
}
