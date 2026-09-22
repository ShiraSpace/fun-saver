'use client';

import { JSX } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { Avatar } from '@/components/Avatar/Avatar';
import { Money } from '@/components/Money';
import { totalBalance } from '@/lib/derivations';
import { ACCOUNT_LIST_DOM_ID } from '../AccountList/constants';
import {
  ACCOUNT_PICKER_CONTENT,
  ACCOUNT_PICKER_STYLE,
  ACCOUNT_PICKER_TEST_IDS,
} from './constants';
import { Trigger, Naming, Name, Current, Caret } from './AccountPicker.styles';

interface AccountTriggerProps {
  account: AccountWithDerivedWallets;
  isOpen: boolean;
  onToggle: () => void;
}

export function AccountTrigger({
  account,
  isOpen,
  onToggle,
}: AccountTriggerProps): JSX.Element {
  const totalBalanceAgorot = totalBalance(account.wallets);
  const caret = isOpen
    ? ACCOUNT_PICKER_CONTENT.openCaret
    : ACCOUNT_PICKER_CONTENT.closedCaret;

  return (
    <Trigger
      type="button"
      data-testid={ACCOUNT_PICKER_TEST_IDS.trigger}
      aria-expanded={isOpen}
      aria-controls={ACCOUNT_LIST_DOM_ID}
      onClick={onToggle}
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
            testId={ACCOUNT_PICKER_TEST_IDS.triggerTotal}
          />
          {ACCOUNT_PICKER_CONTENT.currentSuffix}
        </Current>
      </Naming>
      <Caret aria-hidden="true" data-testid={ACCOUNT_PICKER_TEST_IDS.caret}>
        {caret}
      </Caret>
    </Trigger>
  );
}
