'use client';

import { JSX, useState } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { ModeToggle } from './ModeToggle';
import { DepositBody } from './DepositBody';
import { WithdrawBody } from './WithdrawBody';
import { useCloseOnBack } from './use-close-on-back';
import { useSwipeToClose } from './use-swipe-to-close';
import type { TransactionMode } from './constants';
import { TRANSACTION_DRAWER_TEST_IDS } from './constants';
import { Scrim, Sheet, Handle, Body } from './TransactionDrawer.styles';

interface TransactionDrawerProps {
  account: AccountWithDerivedWallets;
  onClose: () => void;
}

export function TransactionDrawer({
  account,
  onClose,
}: TransactionDrawerProps): JSX.Element {
  const [mode, setMode] = useState<TransactionMode>('deposit');
  const swipe = useSwipeToClose(onClose);

  useCloseOnBack(onClose);

  const withdrawOrDepositBody =
    mode === 'deposit' ? (
      <DepositBody account={account} onClose={onClose} />
    ) : (
      <WithdrawBody account={account} onClose={onClose} />
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
        <ModeToggle mode={mode} onChange={setMode} />
        <Body key={mode}>{withdrawOrDepositBody}</Body>
      </Sheet>
    </>
  );
}
