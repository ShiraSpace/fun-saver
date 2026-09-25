'use client';

import { JSX } from 'react';
import { DEFAULT_WALLETS } from '@/lib/wallet/constants';
import type { DepositSplit } from '@/lib/transaction/transactions';
import { WalletTile } from '../WalletTile';
import { TRANSACTION_DRAWER_TEST_IDS } from '../constants';
import { Wallets } from './DepositSplitPreview.styles';

interface DepositSplitPreviewProps {
  split: DepositSplit;
}

export function DepositSplitPreview({
  split,
}: DepositSplitPreviewProps): JSX.Element {
  return (
    <Wallets data-testid={TRANSACTION_DRAWER_TEST_IDS.split}>
      {DEFAULT_WALLETS.map((wallet) => (
        <WalletTile
          key={wallet.name}
          walletName={wallet.name}
          icon={wallet.icon}
          amountAgorot={split[wallet.name]}
          amountTestId={TRANSACTION_DRAWER_TEST_IDS.splitAmount(wallet.name)}
        />
      ))}
    </Wallets>
  );
}
