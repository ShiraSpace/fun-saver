'use client';

import { JSX } from 'react';
import type { SpendableWalletName, WalletSummary } from '@/lib/wallet/types';
import { WALLET_LABEL } from '@/lib/wallet/constants';
import { Money } from '@/components/Money';
import { CHILD_WALLET_COPY, CHILD_WALLET_TEST_IDS } from './constants';
import { Amount, Card, Icon, Name, Note } from './ChildWallet.styles';

interface ChildWalletProps {
  wallet: WalletSummary & { name: SpendableWalletName };
}

export function ChildWallet({ wallet }: ChildWalletProps): JSX.Element {
  return (
    <Card data-testid={CHILD_WALLET_TEST_IDS.card}>
      <Icon walletName={wallet.name} aria-hidden="true">
        {wallet.icon}
      </Icon>
      <Name>
        {WALLET_LABEL[wallet.name]}
        <Note>{CHILD_WALLET_COPY[wallet.name]}</Note>
      </Name>
      <Amount>
        <Money
          amountAgorot={wallet.balance}
          testId={CHILD_WALLET_TEST_IDS.balance}
          roundDown
        />
      </Amount>
    </Card>
  );
}
