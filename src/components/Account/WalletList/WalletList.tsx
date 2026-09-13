'use client';

import { JSX } from 'react';
import type { WalletWithDerived } from '@/lib/types';
import { WalletCard } from '../WalletCard/WalletCard';
import { WALLET_LIST_COPY, WALLET_LIST_TEST_IDS } from './constants';
import { List, Label } from './WalletList.styles';

interface WalletListProps {
  wallets: ListWallet[];
}

type ListWallet = Pick<WalletWithDerived, 'id' | 'name' | 'icon' | 'balance'>;

export function WalletList({ wallets }: WalletListProps): JSX.Element {
  return (
    <List>
      <Label data-testid={WALLET_LIST_TEST_IDS.label}>
        {WALLET_LIST_COPY.label}
      </Label>
      {wallets.map((wallet) => (
        <WalletCard key={wallet.id} wallet={wallet} />
      ))}
    </List>
  );
}
