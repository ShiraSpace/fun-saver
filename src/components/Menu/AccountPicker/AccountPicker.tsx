'use client';

import { JSX, useRef } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { useCurrentAccount } from '@/components/Account/current-account-context';
import { AccountList } from '../AccountList';
import { AccountTrigger } from './AccountTrigger';
import { useCloseOnOutsideClick } from './use-close-on-outside-click';
import { ACCOUNT_PICKER_TEST_IDS } from './constants';
import { Picker } from './AccountPicker.styles';

interface AccountPickerProps {
  accounts: AccountWithDerivedWallets[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

export function AccountPicker({
  accounts,
  isOpen,
  onToggle,
  onSelect,
  onAdd,
}: AccountPickerProps): JSX.Element {
  const pickerRef = useRef<HTMLDivElement>(null);
  const currentAccount = useCurrentAccount();

  useCloseOnOutsideClick(pickerRef, isOpen, onToggle);

  return (
    <Picker ref={pickerRef} data-testid={ACCOUNT_PICKER_TEST_IDS.picker}>
      <AccountTrigger
        account={currentAccount}
        isOpen={isOpen}
        onToggle={onToggle}
      />
      {isOpen && (
        <AccountList
          accounts={accounts}
          selectedAccountId={currentAccount.id}
          onSelect={onSelect}
          onAdd={onAdd}
        />
      )}
    </Picker>
  );
}
