'use client';

import { JSX, useState } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { TRANSACTION_TYPE } from '@/lib/transaction/constants';
import { TransactionTypeToggle } from './TransactionTypeToggle';
import { TransactionForm } from './TransactionForm';
import { DrawerHandle } from './DrawerHandle';
import { useCloseOnBack } from '@/hooks/use-close-on-back';
import { useSwipeToClose } from './use-swipe-to-close';
import type { EnteredTransactionType } from './constants';
import { TRANSACTION_DRAWER_TEST_IDS } from './constants';
import { Scrim, Sheet, Body } from './TransactionDrawer.styles';

interface TransactionDrawerProps {
  account: AccountSummary;
  savedTowardGoal?: SavedTowardGoal;
  onClose: () => void;
  onSaved: () => void;
}

export function TransactionDrawer({
  account,
  savedTowardGoal,
  onClose,
  onSaved,
}: TransactionDrawerProps): JSX.Element {
  const [transactionType, setTransactionType] =
    useState<EnteredTransactionType>(TRANSACTION_TYPE.deposit);
  const swipe = useSwipeToClose(onClose);

  useCloseOnBack(onClose);

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
        <DrawerHandle swipe={swipe} />
        <TransactionTypeToggle
          transactionType={transactionType}
          onChange={setTransactionType}
        />
        <Body key={transactionType}>
          <TransactionForm
            transactionType={transactionType}
            account={account}
            savedTowardGoal={savedTowardGoal}
            onSaved={onSaved}
          />
        </Body>
      </Sheet>
    </>
  );
}
