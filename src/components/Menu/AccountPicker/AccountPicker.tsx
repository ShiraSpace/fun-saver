'use client';

import { JSX, useRef } from 'react';
import { useAccounts } from '@/components/Home/accounts-context';
import { AccountList } from '../AccountList';
import { AccountTrigger } from './AccountTrigger';
import { useCloseOnOutsideClick } from './use-close-on-outside-click';
import { ACCOUNT_PICKER_TEST_IDS } from './constants';
import { Picker } from './AccountPicker.styles';

interface AccountPickerProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

export function AccountPicker({
  isOpen,
  onToggle,
  onSelect,
  onAdd,
}: AccountPickerProps): JSX.Element {
  const pickerRef = useRef<HTMLDivElement>(null);
  const { accounts, currentAccount } = useAccounts();

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
