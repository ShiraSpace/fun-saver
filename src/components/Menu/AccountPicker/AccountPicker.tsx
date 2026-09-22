'use client';

import { JSX, useState } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { selectedAccount } from '@/lib/selected-account';
import { AccountList } from '../AccountList';
import { AccountTrigger } from './AccountTrigger';
import { ACCOUNT_PICKER_TEST_IDS } from './constants';
import { Picker } from './AccountPicker.styles';

interface AccountPickerProps {
  accounts: AccountWithDerivedWallets[];
  selectedAccountId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

export function AccountPicker({
  accounts,
  selectedAccountId,
  onSelect,
  onAdd,
}: AccountPickerProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const current = selectedAccount(accounts, selectedAccountId);

  return (
    <Picker data-testid={ACCOUNT_PICKER_TEST_IDS.picker}>
      {current && (
        <AccountTrigger
          account={current}
          isOpen={isOpen}
          onToggle={(): void => setIsOpen(!isOpen)}
        />
      )}
      {(isOpen || !current) && (
        <AccountList
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onSelect={onSelect}
          onAdd={onAdd}
        />
      )}
    </Picker>
  );
}
