'use client';

import { JSX, useRef } from 'react';
import {
  balanceOverRange,
  type BalanceHistory,
} from '@/lib/wallet/balance-history';
import type { ShownBalance } from '../../constants';
import type { TimeRange } from '../constants';
import { ChartMessage } from './ChartMessage';
import { ShownBalances } from './ShownBalances';
import {
  BALANCE_CHART_COPY,
  BALANCE_CHART_TEST_IDS,
  chartLabel,
  viewBoxOf,
} from './constants';
import { useChartWidth } from './use-chart-width';
import { Chart } from './BalanceChart.styles';

interface BalanceChartProps {
  balanceHistory: BalanceHistory;
  range: TimeRange;
  shownBalances: readonly ShownBalance[];
}

interface EmptyChartMessage {
  text: string;
  label: string;
}

function emptyChartMessage(
  balanceHistory: BalanceHistory,
  shownBalances: readonly ShownBalance[]
): EmptyChartMessage | undefined {
  if (balanceHistory.days.length === 0) {
    return BALANCE_CHART_COPY.noTransactions;
  }

  return shownBalances.length === 0
    ? BALANCE_CHART_COPY.noBalanceShown
    : undefined;
}

export function BalanceChart({
  balanceHistory,
  range,
  shownBalances,
}: BalanceChartProps): JSX.Element {
  const chartRef = useRef<SVGSVGElement>(null);
  const chartWidth = useChartWidth(chartRef);

  const viewBox = viewBoxOf(chartWidth);
  const emptyMessage = emptyChartMessage(balanceHistory, shownBalances);
  const chartName =
    emptyMessage?.label ?? chartLabel(range.label, shownBalances);
  const balanceHistoryInRange = balanceOverRange(balanceHistory, range.days);
  const drawing = emptyMessage ? (
    <ChartMessage text={emptyMessage.text} chartWidth={chartWidth} />
  ) : (
    <ShownBalances
      balanceHistory={balanceHistoryInRange}
      shownBalances={shownBalances}
      chartWidth={chartWidth}
    />
  );

  return (
    <Chart
      ref={chartRef}
      viewBox={viewBox}
      role="img"
      aria-label={chartName}
      data-testid={BALANCE_CHART_TEST_IDS.chart}
    >
      {drawing}
    </Chart>
  );
}
