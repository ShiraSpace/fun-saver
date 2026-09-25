import { JSX } from 'react';
import { WALLET_ICON } from '@/lib/wallet/constants';
import type { TransactionListRow } from '@/lib/transaction/transaction-rows';
import { TRANSACTION_ROW_COPY } from '../constants';
import { transactionRowCopy } from '../transaction-row-copy';
import { TRANSACTION_ICON_TEST_IDS } from './constants';
import { Badge, DepositIcon, WalletIcon } from './TransactionIcon.styles';

interface TransactionIconProps {
  transactionListRow: TransactionListRow;
}

export function TransactionIcon({
  transactionListRow,
}: TransactionIconProps): JSX.Element {
  const { walletName } = transactionListRow;

  if (!walletName) {
    return (
      <DepositIcon aria-hidden data-testid={TRANSACTION_ICON_TEST_IDS.icon}>
        {TRANSACTION_ROW_COPY.deposit.icon}
      </DepositIcon>
    );
  }

  const { badge } = transactionRowCopy(transactionListRow);

  return (
    <WalletIcon
      aria-hidden
      walletName={walletName}
      data-testid={TRANSACTION_ICON_TEST_IDS.icon}
    >
      {WALLET_ICON[walletName]}
      <Badge data-testid={TRANSACTION_ICON_TEST_IDS.badge}>{badge}</Badge>
    </WalletIcon>
  );
}
