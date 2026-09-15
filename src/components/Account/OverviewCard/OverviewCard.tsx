'use client';

import { JSX } from 'react';
import type { WalletWithDerived } from '@/lib/types';
import { totalBalance, walletShares } from '@/lib/derivations';
import { agorotToWholeShekels } from '@/lib/money';
import { Money } from '@/components/Money';
import { Donut } from './Donut';
import { useAnimatedWalletTotal } from './use-animated-wallet-total';
import { Legend } from './Legend';
import {
  OVERVIEW_CARD_COPY,
  OVERVIEW_CARD_STYLE,
  OVERVIEW_CARD_TEST_IDS,
} from './constants';
import { Card, Hole, HoleAmount, HoleLabel, Ring } from './OverviewCard.styles';

function holeFontSize(totalAgorot: number): number {
  const digits = String(agorotToWholeShekels(totalAgorot)).length;

  if (digits <= OVERVIEW_CARD_STYLE.holeMaxDigits) {
    return OVERVIEW_CARD_STYLE.holeAmountSize;
  }

  return Math.floor(
    (OVERVIEW_CARD_STYLE.holeAmountSize * OVERVIEW_CARD_STYLE.holeMaxDigits) /
      digits
  );
}

type OverviewWallet = Pick<
  WalletWithDerived,
  'id' | 'name' | 'icon' | 'balance'
>;

interface OverviewCardProps {
  wallets: OverviewWallet[];
}

export function OverviewCard({ wallets }: OverviewCardProps): JSX.Element {
  const shares = walletShares(wallets.map((wallet) => wallet.balance));
  const entries = wallets.map((wallet, index) => ({
    ...wallet,
    share: shares[index],
  }));
  const walletTotal = totalBalance(wallets);
  const animatedWalletTotal = useAnimatedWalletTotal(walletTotal);

  return (
    <Card data-testid={OVERVIEW_CARD_TEST_IDS.card}>
      <Ring>
        <Donut segments={entries} />
        <Hole>
          <HoleLabel>{OVERVIEW_CARD_COPY.totalLabel}</HoleLabel>
          <HoleAmount fontSize={holeFontSize(walletTotal)}>
            <Money
              amountAgorot={animatedWalletTotal}
              testId={OVERVIEW_CARD_TEST_IDS.total}
            />
          </HoleAmount>
        </Hole>
      </Ring>
      <Legend entries={entries} />
    </Card>
  );
}
