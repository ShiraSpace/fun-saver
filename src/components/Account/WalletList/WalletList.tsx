import { JSX } from 'react';
import type { WalletWithDerived } from '@/lib/types';
import { WalletCard } from '../WalletCard/WalletCard';
import { WALLET_LIST_COPY, WALLET_LIST_TEST_IDS } from './constants';

type ListWallet = Pick<WalletWithDerived, 'id' | 'name' | 'icon' | 'balance'>;

interface WalletListProps {
  wallets: ListWallet[];
}

export function WalletList({ wallets }: WalletListProps): JSX.Element {
  return (
    <div>
      <span data-testid={WALLET_LIST_TEST_IDS.label}>
        {WALLET_LIST_COPY.label}
      </span>
      {wallets.map((wallet) => (
        <WalletCard key={wallet.id} wallet={wallet} />
      ))}
    </div>
  );
}
