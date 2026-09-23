'use client';

import { JSX, KeyboardEvent, useCallback, useRef, useState } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { AccountList } from '../AccountList';
import { AccountTrigger } from './AccountTrigger';
import { useCloseOnOutsideClick } from './use-close-on-outside-click';
import { ESCAPE_KEY } from '../MenuOverlay/constants';
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

  const closeOnEscape = (event: KeyboardEvent): void => {
    if (isOpen && event.key === ESCAPE_KEY) {
      event.stopPropagation();
      close();
    }
  };

  return (
    <Picker
      ref={pickerRef}
      data-testid={ACCOUNT_PICKER_TEST_IDS.picker}
      onKeyDown={closeOnEscape}
    >
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
