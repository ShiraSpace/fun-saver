'use client';

import { JSX } from 'react';
import type { WalletSummary } from '@/lib/wallet/types';
import { savingsWithoutAgorot } from '@/lib/wallet/savings-without-agorot';
import { Money } from '@/components/Money';
import { CHILD_SAVINGS_COPY, CHILD_SAVINGS_TEST_IDS } from './constants';
import {
  Card,
  Earned,
  Icon,
  Split,
  Tile,
  TileAmount,
  Title,
  Total,
} from './ChildSavings.styles';

interface ChildSavingsProps {
  savings: WalletSummary;
}

export function ChildSavings({ savings }: ChildSavingsProps): JSX.Element {
  const { balance, principal, interestEarned } = savingsWithoutAgorot(savings);

  return (
    <Card data-testid={CHILD_SAVINGS_TEST_IDS.card}>
      <Icon aria-hidden="true">{savings.icon}</Icon>
      <Title>{CHILD_SAVINGS_COPY.title}</Title>
      <Total>
        <Money amountAgorot={balance} testId={CHILD_SAVINGS_TEST_IDS.balance} />
      </Total>
      <Split>
        <Tile>
          {CHILD_SAVINGS_COPY.principal}
          <TileAmount>
            <Money
              amountAgorot={principal}
              testId={CHILD_SAVINGS_TEST_IDS.principal}
              fullSizeCurrency
            />
          </TileAmount>
        </Tile>
        <Earned>
          {CHILD_SAVINGS_COPY.interestEarned}
          <TileAmount dir="ltr">
            {CHILD_SAVINGS_COPY.earnedSign}
            <Money
              amountAgorot={interestEarned}
              testId={CHILD_SAVINGS_TEST_IDS.interestEarned}
              fullSizeCurrency
            />
          </TileAmount>
        </Earned>
      </Split>
    </Card>
  );
}
