'use client';

import { JSX, useRef } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { selectedAccount } from '@/lib/selected-account';
import { AccountList } from '../AccountList';
import { AccountTrigger } from './AccountTrigger';
import { useCloseOnOutsideClick } from './use-close-on-outside-click';
import { ACCOUNT_PICKER_TEST_IDS } from './constants';
import { Picker } from './AccountPicker.styles';

interface AccountPickerProps {
  accounts: AccountWithDerivedWallets[];
  selectedAccountId: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

export function AccountPicker({
  accounts,
  selectedAccountId,
  isOpen,
  onToggle,
  onSelect,
  onAdd,
}: AccountPickerProps): JSX.Element {
  const pickerRef = useRef<HTMLDivElement>(null);
  const currentAccount = selectedAccount(accounts, selectedAccountId);
  const showsAccountList = isOpen || !currentAccount;

  useCloseOnOutsideClick(pickerRef, isOpen, onToggle);

  return (
    <Picker ref={pickerRef} data-testid={ACCOUNT_PICKER_TEST_IDS.picker}>
      {currentAccount && (
        <AccountTrigger
          account={currentAccount}
          isOpen={isOpen}
          onToggle={onToggle}
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
