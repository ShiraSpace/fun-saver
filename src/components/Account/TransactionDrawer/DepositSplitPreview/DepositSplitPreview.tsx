'use client';

import { JSX } from 'react';
import { DEFAULT_WALLETS } from '@/lib/constants';
import type { DepositSplit } from '@/lib/transactions';
import { WalletTile } from '../WalletTile';
import { TRANSACTION_DRAWER_TEST_IDS } from '../constants';
import { Row } from './DepositSplitPreview.styles';

interface DepositSplitPreviewProps {
  split: DepositSplit;
}

export function DepositSplitPreview({
  split,
}: DepositSplitPreviewProps): JSX.Element {
  return (
    <Row data-testid={TRANSACTION_DRAWER_TEST_IDS.split}>
      {DEFAULT_WALLETS.map((wallet) => (
        <WalletTile
          key={wallet.name}
          name={wallet.name}
          icon={wallet.icon}
          amountAgorot={split[wallet.name]}
          valueTestId={TRANSACTION_DRAWER_TEST_IDS.splitAmount(wallet.name)}
        />
      ))}
    </Row>
  );
}
