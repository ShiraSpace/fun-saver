'use client';

import { JSX, useState } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import { TRANSACTION_TYPE } from '@/lib/transaction/constants';
import { TransactionTypeToggle } from './TransactionTypeToggle';
import { DepositForm } from './DepositForm';
import { WithdrawalForm } from './WithdrawalForm';
import { useCloseOnBack } from './use-close-on-back';
import { useSwipeToClose } from './use-swipe-to-close';
import type { EnteredTransactionType } from './constants';
import { TRANSACTION_DRAWER_TEST_IDS } from './constants';
import { Scrim, Sheet, Handle, Body } from './TransactionDrawer.styles';

interface TransactionDrawerProps {
  account: AccountSummary;
  onClose: () => void;
}

export function TransactionDrawer({
  account,
  onClose,
}: TransactionDrawerProps): JSX.Element {
  const [transactionType, setTransactionType] =
    useState<EnteredTransactionType>(TRANSACTION_TYPE.deposit);
  const swipe = useSwipeToClose(onClose);

  useCloseOnBack(onClose);

  const transactionForm =
    transactionType === TRANSACTION_TYPE.deposit ? (
      <DepositForm account={account} onClose={onClose} />
    ) : (
      <WithdrawalForm account={account} onClose={onClose} />
    );

  return (
    <>
      <Scrim
        data-testid={TRANSACTION_DRAWER_TEST_IDS.scrim}
        onClick={onClose}
      />
      <Sheet
        data-testid={TRANSACTION_DRAWER_TEST_IDS.drawer}
        offset={swipe.offset}
        dragging={swipe.isDragging}
      >
        <Handle
          data-testid={TRANSACTION_DRAWER_TEST_IDS.handle}
          onPointerDown={swipe.onPointerDown}
          onPointerMove={swipe.onPointerMove}
          onPointerUp={swipe.onPointerUp}
        />
        <TransactionTypeToggle
          transactionType={transactionType}
          onChange={setTransactionType}
        />
        <Body key={transactionType}>{transactionForm}</Body>
      </Sheet>
    </>
  );
}
