'use client';

import { JSX } from 'react';
import type { WalletName } from '@/lib/wallet/types';
import { WALLET_SHORT_LABEL } from '@/lib/wallet/constants';
import { Money } from '@/components/Money';
import {
  BALANCE_BREAKDOWN_COPY,
  BALANCE_BREAKDOWN_TEST_IDS,
} from '../constants';
import { Dot, Leader, List, Row, Share } from './Legend.styles';

export interface WalletWithShare {
  id: string;
  name: WalletName;
  icon: string;
  balance: number;
  share: number;
}

interface LegendProps {
  wallets: WalletWithShare[];
}

export function Legend({ wallets }: LegendProps): JSX.Element {
  const rows = wallets.map((wallet, index) => (
    <Row
      key={wallet.id}
      rowIndex={index}
      data-testid={BALANCE_BREAKDOWN_TEST_IDS.legendRow}
    >
      <Dot
        walletName={wallet.name}
        data-testid={BALANCE_BREAKDOWN_TEST_IDS.legendDot}
      >
        {wallet.icon}
      </Dot>
      {WALLET_SHORT_LABEL[wallet.name]}
      <Share data-testid={BALANCE_BREAKDOWN_TEST_IDS.legendShare}>
        {BALANCE_BREAKDOWN_COPY.share(wallet.share)}
      </Share>
      <Leader />
      <Money
        amountAgorot={wallet.balance}
        testId={BALANCE_BREAKDOWN_TEST_IDS.legendBalance}
      />
    </Row>
  ));

  return <List>{rows}</List>;
}
