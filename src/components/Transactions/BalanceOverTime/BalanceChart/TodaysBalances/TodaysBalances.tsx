import { JSX } from 'react';
import {
  todaysBalancesSpacedApart,
  type BalanceY,
  type ShownBalanceHistory,
} from '../chart-geometry';
import { TodaysBalanceLabel } from './TodaysBalanceLabel';

interface TodaysBalancesProps {
  shownBalanceHistories: ShownBalanceHistory[];
  balanceY: BalanceY;
}

function todaysBalanceOf({ dailyBalances }: ShownBalanceHistory): number {
  return dailyBalances[dailyBalances.length - 1];
}

export function TodaysBalances({
  shownBalanceHistories,
  balanceY,
}: TodaysBalancesProps): JSX.Element {
  const todaysBalances = shownBalanceHistories.map((shownBalanceHistory) => {
    const todaysBalance = todaysBalanceOf(shownBalanceHistory);

    return {
      shownBalance: shownBalanceHistory.shownBalance,
      todaysBalance,
      y: balanceY(todaysBalance),
    };
  });

  return (
    <g>
      {todaysBalancesSpacedApart(todaysBalances).map((placedTodaysBalance) => (
        <TodaysBalanceLabel
          key={placedTodaysBalance.shownBalance}
          {...placedTodaysBalance}
        />
      ))}
    </g>
  );
}
