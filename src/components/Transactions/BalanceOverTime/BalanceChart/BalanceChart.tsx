'use client';

import { JSX } from 'react';
import type { BalanceHistory } from '@/lib/wallet/balance-history';
import type { ShownBalance } from '../../use-transactions-view-choices';
import { BalanceAxis } from './BalanceAxis';
import { BalanceLines } from './BalanceLines';
import { ChartMessage } from './ChartMessage';
import { DayAxis } from './DayAxis';
import { TodaysBalances } from './TodaysBalances';
import {
  balanceYWithin,
  lowestAndHighestBalance,
  eachShownBalanceHistory,
} from './chart-geometry';
import {
  BALANCE_CHART_COPY,
  BALANCE_CHART_TEST_IDS,
  VIEW_BOX,
  chartLabel,
} from './constants';
import { Chart } from './BalanceChart.styles';

interface BalanceChartProps {
  balanceHistory: BalanceHistory;
  shownBalances: readonly ShownBalance[];
  rangeLabel: string;
}

export function BalanceChart({
  balanceHistory,
  shownBalances,
  rangeLabel,
}: BalanceChartProps): JSX.Element {
  if (balanceHistory.days.length === 0) {
    return <ChartMessage {...BALANCE_CHART_COPY.noTransactions} />;
  }

  if (shownBalances.length === 0) {
    return <ChartMessage {...BALANCE_CHART_COPY.noBalanceShown} />;
  }

  const shownBalanceHistories = eachShownBalanceHistory(
    balanceHistory,
    shownBalances
  );
  const balanceBounds = lowestAndHighestBalance(shownBalanceHistories);
  const balanceY = balanceYWithin(balanceBounds);

  return (
    <Chart
      viewBox={VIEW_BOX}
      role="img"
      aria-label={chartLabel(rangeLabel, shownBalances)}
      data-testid={BALANCE_CHART_TEST_IDS.chart}
    >
      <BalanceAxis balanceBounds={balanceBounds} balanceY={balanceY} />
      <BalanceLines
        shownBalanceHistories={shownBalanceHistories}
        balanceY={balanceY}
      />
      <TodaysBalances
        shownBalanceHistories={shownBalanceHistories}
        balanceY={balanceY}
      />
      <DayAxis days={balanceHistory.days} />
    </Chart>
  );
}
