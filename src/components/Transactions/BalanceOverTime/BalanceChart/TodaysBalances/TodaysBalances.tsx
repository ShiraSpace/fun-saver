import { JSX } from 'react';
import { SHOWN_BALANCE } from '../../../constants';
import {
  todaysBalancesSpacedApart,
  type BalanceY,
  type ShownBalanceHistory,
} from '../chart-geometry';
import { TodaysBalanceLabel } from './TodaysBalanceLabel';

interface TodaysBalancesProps {
  shownBalanceHistories: ShownBalanceHistory[];
  todaysTotalBalance: number;
  balanceY: BalanceY;
}

function lineEndOf({ dailyBalances }: ShownBalanceHistory): number {
  return dailyBalances[dailyBalances.length - 1];
}

export function TodaysBalances({
  shownBalanceHistories,
  todaysTotalBalance,
  balanceY,
}: TodaysBalancesProps): JSX.Element {
  const todaysBalances = shownBalanceHistories.map((shownBalanceHistory) => {
    const lineEnd = lineEndOf(shownBalanceHistory);
    const isTotalBalance = shownBalanceHistory.shownBalance === SHOWN_BALANCE.totalBalance;

    return {
      shownBalance: shownBalanceHistory.shownBalance,
      todaysBalance: isTotalBalance ? todaysTotalBalance : lineEnd,
      y: balanceY(lineEnd),
    };
  });

  const labels = todaysBalancesSpacedApart(todaysBalances).map((placedTodaysBalance) => (
    <TodaysBalanceLabel key={placedTodaysBalance.shownBalance} {...placedTodaysBalance} />
  ));

  return <g>{labels}</g>;
}
