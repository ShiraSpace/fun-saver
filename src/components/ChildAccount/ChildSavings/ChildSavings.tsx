'use client';

import { JSX } from 'react';
import type { WalletSummary } from '@/lib/wallet/types';
import { savingsInWholeShekels } from '@/lib/wallet/savings-in-whole-shekels';
import { shekelsToAgorot } from '@/lib/money';
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
  const { principalShekels, interestEarnedShekels } =
    savingsInWholeShekels(savings);

  return (
    <Card data-testid={CHILD_SAVINGS_TEST_IDS.card}>
      <Icon aria-hidden="true">{savings.icon}</Icon>
      <Title>{CHILD_SAVINGS_COPY.title}</Title>
      <Total>
        <Money
          amountAgorot={savings.balance}
          testId={CHILD_SAVINGS_TEST_IDS.balance}
          roundDown
        />
      </Total>
      <Split>
        <Tile>
          {CHILD_SAVINGS_COPY.principal}
          <TileAmount>
            <Money
              amountAgorot={shekelsToAgorot(principalShekels)}
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
              amountAgorot={shekelsToAgorot(interestEarnedShekels)}
              testId={CHILD_SAVINGS_TEST_IDS.interestEarned}
              fullSizeCurrency
            />
          </TileAmount>
        </Earned>
      </Split>
    </Card>
  );
}
