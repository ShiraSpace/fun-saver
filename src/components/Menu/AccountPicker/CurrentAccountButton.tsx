'use client';

import { JSX } from 'react';
import type { AccountSummary } from '@/lib/types';
import { Avatar } from '@/components/Avatar/Avatar';
import { Money } from '@/components/Money';
import { totalBalance } from '@/lib/wallet-totals';
import { ACCOUNT_LIST_DOM_ID } from '../AccountList/constants';
import {
  ACCOUNT_PICKER_COPY,
  ACCOUNT_PICKER_STYLE,
  ACCOUNT_PICKER_TEST_IDS,
} from './constants';
import { Trigger, Naming, Name, Current, Caret } from './AccountPicker.styles';

interface CurrentAccountButtonProps {
  account: AccountSummary;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

export function CurrentAccountButton({
  account,
  isOpen,
  onToggle,
}: CurrentAccountButtonProps): JSX.Element {
  const totalBalanceAgorot = totalBalance(account.wallets);
  const caret = isOpen
    ? ACCOUNT_PICKER_COPY.openCaret
    : ACCOUNT_PICKER_COPY.closedCaret;

  return (
    <Trigger
      type="button"
      data-testid={ACCOUNT_PICKER_TEST_IDS.trigger}
      aria-expanded={isOpen}
      aria-controls={ACCOUNT_LIST_DOM_ID}
      onClick={(): void => onToggle(!isOpen)}
    >
      <Avatar
        avatarId={account.avatarId}
        alt={account.name}
        size={ACCOUNT_PICKER_STYLE.avatarSize}
      />
      <Naming>
        <Name>{account.name}</Name>
        <Current>
          <Money
            amountAgorot={totalBalanceAgorot}
            fullSizeCurrency
            testId={ACCOUNT_PICKER_TEST_IDS.currentTotalBalance}
          />
          {ACCOUNT_PICKER_COPY.currentSuffix}
        </Current>
      </Naming>
      <Caret aria-hidden="true" data-testid={ACCOUNT_PICKER_TEST_IDS.caret}>
        {caret}
      </Caret>
    </Trigger>
  );
}
