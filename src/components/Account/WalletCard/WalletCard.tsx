import { JSX } from 'react';
import type { WalletWithDerived } from '@/lib/types';
import { Money } from '../Money/Money';
import { WALLET_CARD_COPY, WALLET_CARD_TEST_IDS } from './constants';

type CardWallet = Pick<WalletWithDerived, 'name' | 'icon' | 'balance'>;

interface WalletCardProps {
  wallet: CardWallet;
}

export function WalletCard({ wallet }: WalletCardProps): JSX.Element {
  return (
    <div data-testid={WALLET_CARD_TEST_IDS.card}>
      <span>{wallet.icon}</span>
      <span>{WALLET_CARD_COPY.name[wallet.name]}</span>
      <Money
        amountAgorot={wallet.balance}
        testId={WALLET_CARD_TEST_IDS.balance}
      />
    </div>
  );
}
