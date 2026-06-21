'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import type { WalletWithDerived } from '@/lib/types';
import { COLORS } from '@/theme/palette';
import { CoinRow } from '../CoinRow/CoinRow';
import { Star } from './Star/Star';
import { HeroHead } from './HeroHead/HeroHead';
import { HeroAmount } from './HeroAmount/HeroAmount';
import { HeroBreakdown } from './HeroBreakdown/HeroBreakdown';
import { HERO_STYLE, WALLET_HERO_TEST_IDS } from './constants';

type HeroWallet = Pick<
  WalletWithDerived,
  | 'balance'
  | 'principal'
  | 'interestGain'
  | 'todayInterest'
  | 'monthlyInterestRate'
  | 'openedAt'
>;

const Card = styled.div`
  position: relative;
  background: ${COLORS.surface};
  border-radius: ${HERO_STYLE.radius}px;
  padding: ${HERO_STYLE.padding}px;
  box-shadow: ${HERO_STYLE.shadow};
  color: ${COLORS.ink};
`;

const CornerStar = styled(Star)`
  position: absolute;
  top: ${HERO_STYLE.cornerStarTop}px;
  right: ${HERO_STYLE.cornerStarRight}px;
  width: ${HERO_STYLE.cornerStarSize}px;
  height: ${HERO_STYLE.cornerStarSize}px;
  transform: rotate(${HERO_STYLE.cornerStarRotation}deg);
  pointer-events: none;
`;

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
