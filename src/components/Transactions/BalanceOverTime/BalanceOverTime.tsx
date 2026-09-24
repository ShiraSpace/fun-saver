'use client';

import { JSX } from 'react';
import {
  todaysTotalBalance,
  totalBalanceChange,
  type BalanceHistory,
} from '@/lib/balance-history';
import { ChoiceChips } from '../ChoiceChips';
import type { TransactionsViewChoices } from '../use-transactions-view-choices';
import { TotalBalance } from './TotalBalance';
import {
  BALANCE_OVER_TIME_COPY,
  BALANCE_OVER_TIME_TEST_IDS,
  RANGES,
} from './constants';
import { Card, RangeRow } from './BalanceOverTime.styles';

interface BalanceOverTimeProps {
  balanceHistory: BalanceHistory;
  viewChoices: TransactionsViewChoices;
}

export function BalanceOverTime({
  balanceHistory,
  viewChoices,
}: BalanceOverTimeProps): JSX.Element {
  const range =
    RANGES.find((candidate) => candidate.id === viewChoices.range) ?? RANGES[1];

  return (
    <Card data-testid={BALANCE_OVER_TIME_TEST_IDS.card}>
      <TotalBalance
        totalBalance={todaysTotalBalance(balanceHistory)}
        balanceChange={totalBalanceChange(balanceHistory, range.days)}
        changeLabel={range.changeLabel}
      />
      <RangeRow>
        <ChoiceChips
          name={BALANCE_OVER_TIME_COPY.rangeName}
          legend={BALANCE_OVER_TIME_COPY.rangeLegend}
          choices={RANGES}
          selected={range.id}
          onSelect={viewChoices.setRange}
          testId={BALANCE_OVER_TIME_TEST_IDS.ranges}
        />
      </RangeRow>
    </Card>
  );
}
