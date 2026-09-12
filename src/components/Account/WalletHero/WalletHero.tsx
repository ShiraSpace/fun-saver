'use client';

import { JSX } from 'react';
import type { WalletWithDerived } from '@/lib/types';
import { CoinRow } from '../CoinRow/CoinRow';
import { HeroHead } from './HeroHead/HeroHead';
import { HeroAmount } from './HeroAmount/HeroAmount';
import { HeroBreakdown } from './HeroBreakdown/HeroBreakdown';
import { WALLET_HERO_TEST_IDS } from './constants';
import { Card, CornerStar } from './WalletHero.styles';

type HeroWallet = Pick<
  WalletWithDerived,
  | 'balance'
  | 'principal'
  | 'interestGain'
  | 'todayInterest'
  | 'monthlyInterestRate'
  | 'openedAt'
>;

interface WalletHeroProps {
  name: string;
  wallet: HeroWallet;
}

export function WalletHero({ name, wallet }: WalletHeroProps): JSX.Element {
  return (
    <Card data-testid={WALLET_HERO_TEST_IDS.hero}>
      <CornerStar data-testid={WALLET_HERO_TEST_IDS.cornerStar} />
      <HeroHead
        name={name}
        monthlyInterestRate={wallet.monthlyInterestRate}
        openedAt={wallet.openedAt}
      />
      <HeroAmount balance={wallet.balance} />
      <CoinRow todayInterest={wallet.todayInterest} />
      <HeroBreakdown
        principal={wallet.principal}
        interestGain={wallet.interestGain}
      />
    </Card>
  );
}
