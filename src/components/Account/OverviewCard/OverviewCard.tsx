'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import type { WalletWithDerived } from '@/lib/types';
import { totalBalance, walletShares } from '@/lib/derivations';
import { agorotToWholeShekels } from '@/lib/money';
import { Money } from '@/components/Money';
import { Donut } from './Donut';
import { DONUT_STYLE } from './constants';
import { Legend } from './Legend';
import {
  OVERVIEW_CARD_COPY,
  OVERVIEW_CARD_STYLE,
  OVERVIEW_CARD_TEST_IDS,
} from './constants';

const HOLE_DIAMETER =
  (DONUT_STYLE.radius - DONUT_STYLE.strokeWidth / 2) *
  2 *
  (DONUT_STYLE.size / DONUT_STYLE.viewBox);

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

type OverviewWallet = Pick<WalletWithDerived, 'id' | 'name' | 'balance'>;

const Card = styled.div`
  background: ${({ theme }): string => theme.colors.surface};
  border-radius: ${OVERVIEW_CARD_STYLE.radius}px;
  padding: ${OVERVIEW_CARD_STYLE.padding}px;
  box-shadow: ${OVERVIEW_CARD_STYLE.shadow};
  color: ${({ theme }): string => theme.colors.textStrong};
  display: flex;
  align-items: center;
  gap: ${OVERVIEW_CARD_STYLE.rowGap}px;
`;

const Ring = styled.div`
  flex-shrink: 0;
  position: relative;
`;

const Hole = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const HoleLabel = styled.span`
  font-size: ${OVERVIEW_CARD_STYLE.holeLabelSize}px;
  font-weight: 600;
  letter-spacing: ${OVERVIEW_CARD_STYLE.holeLabelSpacing}px;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

const HoleAmount = styled.span<{ fontSize: number }>`
  font-size: ${({ fontSize }): number => fontSize}px;
  max-width: ${HOLE_DIAMETER}px;
`;

interface OverviewCardProps {
  wallets: OverviewWallet[];
}

export function OverviewCard({ wallets }: OverviewCardProps): JSX.Element {
  const shares = walletShares(wallets.map((wallet) => wallet.balance));
  const entries = wallets.map((wallet, index) => ({
    ...wallet,
    share: shares[index],
  }));
  const total = totalBalance(wallets);

  return (
    <Card data-testid={OVERVIEW_CARD_TEST_IDS.card}>
      <Ring>
        <Donut segments={entries} />
        <Hole>
          <HoleLabel>{OVERVIEW_CARD_COPY.totalLabel}</HoleLabel>
          <HoleAmount fontSize={holeFontSize(total)}>
            <Money amountAgorot={total} testId={OVERVIEW_CARD_TEST_IDS.total} />
          </HoleAmount>
        </Hole>
      </Ring>
      <Legend entries={entries} />
    </Card>
  );
}
