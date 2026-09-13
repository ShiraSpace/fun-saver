'use client';

import { JSX } from 'react';
import { Money } from '@/components/Money';
import { WALLET_HERO_COPY, WALLET_HERO_TEST_IDS } from '../constants';
import { Block, Label, Big } from './HeroAmount.styles';

interface HeroAmountProps {
  balance: number;
}

export function HeroAmount({ balance }: HeroAmountProps): JSX.Element {
  return (
    <Block>
      <Label>{WALLET_HERO_COPY.totalLabel}</Label>
      <Big>
        <Money amountAgorot={balance} testId={WALLET_HERO_TEST_IDS.balance} />
      </Big>
    </Block>
  );
}
