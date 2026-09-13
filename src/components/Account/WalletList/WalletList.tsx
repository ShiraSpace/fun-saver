'use client';

import { JSX } from 'react';
import type { WalletWithDerived } from '@/lib/types';
import { WalletCard } from '../WalletCard/WalletCard';
import { SavingsStatStrip } from './SavingsStatStrip';
import { WALLET_LIST_COPY, WALLET_LIST_TEST_IDS } from './constants';
import { List, Label } from './WalletList.styles';

interface WalletListProps {
  wallets: WalletWithDerived[];
}

export function WalletList({ wallets }: WalletListProps): JSX.Element {
  const cards = wallets.map((wallet) => (
    <WalletCard key={wallet.id} wallet={wallet}>
      <SavingsStatStrip wallet={wallet} />
    </WalletCard>
  ));

  return (
    <List>
      <Label data-testid={WALLET_LIST_TEST_IDS.label}>
        {WALLET_LIST_COPY.label}
      </Label>
      {cards}
    </List>
  );
}
