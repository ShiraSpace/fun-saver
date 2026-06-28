'use client';

import { JSX, useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { LAYERS } from '@/theme/layers';
import { ModeToggle } from './ModeToggle';
import { DepositBody } from './DepositBody';
import { WithdrawBody } from './WithdrawBody';
import { useCloseOnBack } from './use-close-on-back';
import type { TransactionMode } from './constants';
import {
  TRANSACTION_DRAWER_STYLE,
  TRANSACTION_DRAWER_TEST_IDS,
} from './constants';

const Scrim = styled.div`
  position: fixed;
  inset: 0;
  background: ${TRANSACTION_DRAWER_STYLE.scrim};
  z-index: ${LAYERS.modal};
`;

const Sheet = styled.div`
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: ${LAYERS.modalForeground};
  width: 100%;
  max-width: ${TRANSACTION_DRAWER_STYLE.maxWidth}px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${TRANSACTION_DRAWER_STYLE.gap}px;
  padding: 10px 18px 18px;
  background: ${({ theme }): string => theme.colors.surface};
  border-radius: ${TRANSACTION_DRAWER_STYLE.sheetRadius}px
    ${TRANSACTION_DRAWER_STYLE.sheetRadius}px 0 0;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.25);
`;

const Handle = styled.div`
  width: 44px;
  height: 5px;
  border-radius: 999px;
  background: ${({ theme }): string => theme.colors.divider};
  margin: 2px auto;
`;

const swapIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${TRANSACTION_DRAWER_STYLE.gap}px;
  animation: ${swapIn} 0.2s ease;
`;

interface TransactionDrawerProps {
  account: AccountWithDerivedWallets;
  onClose: () => void;
}

export function TransactionDrawer({
  account,
  onClose,
}: TransactionDrawerProps): JSX.Element {
  const [mode, setMode] = useState<TransactionMode>('deposit');

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
      <Sheet data-testid={TRANSACTION_DRAWER_TEST_IDS.drawer}>
        <Handle />
        <ModeToggle mode={mode} onChange={setMode} />
        <Body key={mode}>{withdrawOrDepositBody}</Body>
      </Sheet>
    </>
  );
}
