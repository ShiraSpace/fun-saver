'use client';

import { JSX, useCallback, useRef, useState } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { AccountList } from '../AccountList';
import { AccountTrigger } from './AccountTrigger';
import { useCloseOnOutsideClick } from './use-close-on-outside-click';
import { useEscapeKey } from '../use-escape-key';
import { useOnMenuClose } from '../use-menu-state';
import { ACCOUNT_PICKER_TEST_IDS } from './constants';
import { Picker } from './AccountPicker.styles';

interface AccountPickerProps {
  accounts: AccountWithDerivedWallets[];
  currentAccount: AccountWithDerivedWallets;
  onSelect: (id: string) => void;
}

export function AccountPicker({
  accounts,
  currentAccount,
  onSelect,
}: AccountPickerProps): JSX.Element {
  const pickerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const close = useCallback((): void => setIsOpen(false), []);

  useCloseOnOutsideClick({ ref: pickerRef, isOpen, onClose: close });
  useEscapeKey({ isListening: isOpen, onEscape: close, takesPrecedence: true });
  useOnMenuClose(close);

  return (
    <Picker ref={pickerRef} data-testid={ACCOUNT_PICKER_TEST_IDS.picker}>
      <AccountTrigger
        account={currentAccount}
        isOpen={isOpen}
        onToggle={setIsOpen}
      />
      {isOpen && (
        <AccountList
          accounts={accounts}
          selectedAccountId={currentAccount.id}
          onSelect={onSelect}
        />
      )}
    </Picker>
  );
}
