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
  const [isAccountListOpen, setIsAccountListOpen] = useState(false);

  const currentAccount = selectedAccount(accounts, selectedAccountId);
  const showsAccountList = isAccountListOpen || !currentAccount;

  const handleToggleAccountList = (): void =>
    setIsAccountListOpen((isOpen) => !isOpen);

  return (
    <Picker data-testid={ACCOUNT_PICKER_TEST_IDS.picker}>
      {currentAccount && (
        <AccountTrigger
          account={currentAccount}
          isOpen={isAccountListOpen}
          onToggle={handleToggleAccountList}
        />
      )}
      {showsAccountList && (
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
