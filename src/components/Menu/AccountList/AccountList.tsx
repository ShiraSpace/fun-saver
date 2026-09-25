'use client';

import { JSX } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import { ACCOUNT_LIST_DOM_ID, ACCOUNT_LIST_TEST_IDS } from './constants';
import { AccountRow } from './AccountRow';
import { List } from './AccountList.styles';
import { AddAccountButton } from '../AddAccountButton';

interface AccountListProps {
  accounts: AccountSummary[];
  currentAccountId: string;
  onSelect: (id: string) => void;
}

export function AccountList({
  accounts,
  currentAccountId,
  onSelect,
}: AccountListProps): JSX.Element {
  return (
    <List id={ACCOUNT_LIST_DOM_ID} data-testid={ACCOUNT_LIST_TEST_IDS.list}>
      {accounts.map((account) => (
        <AccountRow
          key={account.id}
          account={account}
          isCurrent={account.id === currentAccountId}
          onSelect={onSelect}
        />
      ))}
      <AddAccountButton />
    </List>
  );
}
