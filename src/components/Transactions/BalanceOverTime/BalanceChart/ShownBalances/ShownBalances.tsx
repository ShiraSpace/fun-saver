import { JSX } from 'react';
import type { BalanceHistory } from '@/lib/wallet/balance-history';
import type { ShownBalance } from '../../../constants';
import { BalanceAxis } from '../BalanceAxis';
import { BalanceLines } from '../BalanceLines';
import { DayAxis } from '../DayAxis';
import { TodaysBalances } from '../TodaysBalances';
import {
  balanceYWithin,
  dayXWithin,
  eachShownBalanceHistory,
  firstDayXOf,
  lowestAndHighestBalance,
} from '../chart-geometry';

interface ShownBalancesProps {
  balanceHistory: BalanceHistory;
  shownBalances: readonly ShownBalance[];
  chartWidth: number;
}

export function ShownBalances({
  balanceHistory,
  shownBalances,
  chartWidth,
}: ShownBalancesProps): JSX.Element {
  const { days } = balanceHistory;
  const shownBalanceHistories = eachShownBalanceHistory(
    balanceHistory,
    shownBalances
  );
  const balanceBounds = lowestAndHighestBalance(shownBalanceHistories);
  const balanceY = balanceYWithin(balanceBounds);
  const firstDayX = firstDayXOf(chartWidth);
  const dayX = dayXWithin(days.length, firstDayX);

  return (
    <g>
      <BalanceAxis
        balanceBounds={balanceBounds}
        balanceY={balanceY}
        firstDayX={firstDayX}
      />
      <BalanceLines
        shownBalanceHistories={shownBalanceHistories}
        dayX={dayX}
        balanceY={balanceY}
      />
      <TodaysBalances
        shownBalanceHistories={shownBalanceHistories}
        balanceY={balanceY}
      />
      <DayAxis days={days} dayX={dayX} firstDayX={firstDayX} />
    </g>
  );
}
