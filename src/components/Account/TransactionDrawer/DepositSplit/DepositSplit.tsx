'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import { DEFAULT_WALLETS } from '@/lib/constants';
import type { DepositSplit as DepositSplitValue } from '@/lib/transactions';
import { WalletTile } from '../WalletTile';
import { WALLET_TILE_STYLE } from '../WalletTile/constants';
import { TRANSACTION_DRAWER_TEST_IDS } from '../constants';

const Row = styled.div`
  display: flex;
  gap: ${WALLET_TILE_STYLE.rowGap}px;
`;

interface DepositSplitProps {
  split: DepositSplitValue;
}

export function DepositSplit({ split }: DepositSplitProps): JSX.Element {
  return (
    <Row data-testid={TRANSACTION_DRAWER_TEST_IDS.split}>
      {DEFAULT_WALLETS.map((wallet) => (
        <WalletTile
          key={wallet.name}
          name={wallet.name}
          icon={wallet.icon}
          amountAgorot={split[wallet.name]}
          valueTestId={TRANSACTION_DRAWER_TEST_IDS.splitShare(wallet.name)}
        />
      ))}
    </Row>
  );
}
