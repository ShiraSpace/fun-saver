'use client';

import { JSX, useCallback, useRef } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { AccountList } from '../AccountList';
import { AccountTrigger } from './AccountTrigger';
import { useCloseOnOutsideClick } from './use-close-on-outside-click';
import { ACCOUNT_PICKER_TEST_IDS } from './constants';
import { Picker } from './AccountPicker.styles';

interface AccountPickerProps {
  accounts: AccountWithDerivedWallets[];
  currentAccount: AccountWithDerivedWallets;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

export function AccountPicker({
  accounts,
  currentAccount,
  isOpen,
  onToggle,
  onSelect,
  onAdd,
}: AccountPickerProps): JSX.Element {
  const pickerRef = useRef<HTMLDivElement>(null);
  const close = useCallback((): void => onToggle(false), [onToggle]);

  useCloseOnOutsideClick(pickerRef, isOpen, close);

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
