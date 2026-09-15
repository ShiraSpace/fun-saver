'use client';

import { JSX } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { ACCOUNT_LIST_CONTENT, ACCOUNT_LIST_TEST_IDS } from './constants';
import { AccountRow } from './AccountRow';
import { List, AddRow } from './AccountList.styles';

interface AccountListProps {
  accounts: AccountWithDerivedWallets[];
  selectedAccountId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

export function AccountList({
  accounts,
  selectedAccountId,
  onSelect,
  onAdd,
}: AccountListProps): JSX.Element {
  return (
    <List data-testid={ACCOUNT_LIST_TEST_IDS.list}>
      {accounts.map((account) => (
        <AccountRow
          key={account.id}
          account={account}
          isSelected={account.id === selectedAccountId}
          onSelect={onSelect}
        />
      ))}
      <AddRow
        type="button"
        data-testid={ACCOUNT_LIST_TEST_IDS.addRow}
        onClick={onAdd}
      >
        {ACCOUNT_LIST_CONTENT.addLabel}
      </AddRow>
    </List>
  );
}
