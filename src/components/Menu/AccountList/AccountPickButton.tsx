'use client';

import { JSX } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import { Avatar } from '@/components/Avatar/Avatar';
import { Money } from '@/components/Money';
import { totalBalance } from '@/lib/wallet/balance';
import { ACCOUNT_LIST_STYLE, ACCOUNT_LIST_TEST_IDS } from './constants';
import { Name, PickButton, Total } from './AccountList.styles';

interface AccountPickButtonProps {
  account: AccountSummary;
  isCurrent: boolean;
  onSelect: (id: string) => void;
}

export function AccountPickButton({
  account,
  isCurrent,
  onSelect,
}: AccountPickButtonProps): JSX.Element {
  const totalBalanceAgorot = totalBalance(account.wallets);

  const handleSelect = (): void => onSelect(account.id);

  return (
    <PickButton
      type="button"
      data-testid={ACCOUNT_LIST_TEST_IDS.row}
      aria-current={isCurrent}
      onClick={handleSelect}
    >
      <Avatar
        avatarId={account.avatarId}
        alt={account.name}
        size={ACCOUNT_LIST_STYLE.avatarSize}
      />
      <Name>{account.name}</Name>
      <Total>
        <Money
          amountAgorot={totalBalanceAgorot}
          fullSizeCurrency
          testId={ACCOUNT_LIST_TEST_IDS.total}
        />
      </Total>
    </PickButton>
  );
}
