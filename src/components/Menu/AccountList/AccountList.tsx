'use client';

import { JSX } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { ACCOUNT_LIST_DOM_ID, ACCOUNT_LIST_TEST_IDS } from './constants';
import { AccountRow } from './AccountRow';
import { List } from './AccountList.styles';
import { AddAccountRow } from '../AddAccountRow';

interface AccountListProps {
  accounts: AccountWithDerivedWallets[];
  selectedAccountId: string;
  onSelect: (id: string) => void;
  onLeaveMenu: () => void;
}

export function AccountList({
  accounts,
  selectedAccountId,
  onSelect,
  onLeaveMenu,
}: AccountListProps): JSX.Element {
  return (
    <List id={ACCOUNT_LIST_DOM_ID} data-testid={ACCOUNT_LIST_TEST_IDS.list}>
      {accounts.map((account) => (
        <AccountRow
          key={account.id}
          account={account}
          isSelected={account.id === selectedAccountId}
          onSelect={onSelect}
        />
      ))}
      <AddAccountRow onLeaveMenu={onLeaveMenu} />
    </List>
  );
}
