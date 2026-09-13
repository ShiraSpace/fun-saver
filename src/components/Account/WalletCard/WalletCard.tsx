'use client';

import { JSX } from 'react';
import type { WalletWithDerived } from '@/lib/types';
import { Money } from '@/components/Money';
import { WALLET_CARD_COPY, WALLET_CARD_TEST_IDS } from './constants';
import { Card, Illust, Name, Pill } from './WalletCard.styles';

type CardWallet = Pick<WalletWithDerived, 'name' | 'icon' | 'balance'>;

interface WalletCardProps {
  wallet: CardWallet;
}

export function WalletCard({ wallet }: WalletCardProps): JSX.Element {
  return (
    <Card data-testid={WALLET_CARD_TEST_IDS.card}>
      <Illust name={wallet.name}>{wallet.icon}</Illust>
      <Name>{WALLET_CARD_COPY.name[wallet.name]}</Name>
      <Pill>
        <Money
          amountAgorot={wallet.balance}
          testId={WALLET_CARD_TEST_IDS.balance}
        />
      </Pill>
    </Card>
  );
}
