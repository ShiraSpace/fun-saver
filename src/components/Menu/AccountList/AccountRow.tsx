'use client';

import { JSX } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { Avatar } from '@/components/Avatar/Avatar';
import { Money } from '@/components/Money';
import { totalBalance } from '@/lib/derivations';
import { ACCOUNT_LIST_STYLE, ACCOUNT_LIST_TEST_IDS } from './constants';
import { Name, Total } from './AccountList.styles';
import { Row } from '../row-parts';

interface AccountRowProps {
  account: AccountWithDerivedWallets;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function AccountRow({
  account,
  isSelected,
  onSelect,
}: AccountRowProps): JSX.Element {
  const totalBalanceAgorot = totalBalance(account.wallets);

  const handleSelect = (): void => onSelect(account.id);

  return (
    <Row
      type="button"
      data-testid={ACCOUNT_LIST_TEST_IDS.row}
      aria-current={isSelected}
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
    </Row>
  );
}
