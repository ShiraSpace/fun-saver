'use client';

import { JSX, useCallback, useRef, useState } from 'react';
import type { AccountSummary } from '@/lib/types';
import { AccountList } from '../AccountList';
import { CurrentAccountButton } from './CurrentAccountButton';
import { useCloseOnOutsideClick } from './use-close-on-outside-click';
import { useEscapeKey } from '../use-escape-key';
import { useOnMenuClose } from '../use-menu-state';
import { ACCOUNT_PICKER_TEST_IDS } from './constants';
import { Picker } from './AccountPicker.styles';

interface AccountPickerProps {
  accounts: AccountSummary[];
  currentAccount: AccountSummary;
  onSelect: (id: string) => void;
}

export function AccountPicker({
  accounts,
  currentAccount,
  onSelect,
}: AccountPickerProps): JSX.Element {
  const pickerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const closeAccountList = useCallback((): void => setIsOpen(false), []);

  useCloseOnOutsideClick({ ref: pickerRef, isOpen, onClose: closeAccountList });
  useEscapeKey({
    isListening: isOpen,
    onEscape: closeAccountList,
    takesPrecedence: true,
  });
  useOnMenuClose(closeAccountList);

  return (
    <Picker ref={pickerRef} data-testid={ACCOUNT_PICKER_TEST_IDS.picker}>
      <CurrentAccountButton
        account={currentAccount}
        isOpen={isOpen}
        onToggle={setIsOpen}
      />
      {isOpen && (
        <AccountList
          accounts={accounts}
          currentAccountId={currentAccount.id}
          onSelect={onSelect}
        />
      )}
    </Picker>
  );
}
