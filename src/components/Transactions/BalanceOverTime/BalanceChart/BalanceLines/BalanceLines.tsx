import { JSX } from 'react';
import {
  totalBalanceFillPath,
  type BalanceY,
  type DayX,
  type ShownBalanceHistory,
} from '../chart-geometry';
import { BalanceLine } from './BalanceLine';
import { TotalBalanceFill } from './BalanceLines.styles';

interface BalanceLinesProps {
  shownBalanceHistories: ShownBalanceHistory[];
  dayX: DayX;
  balanceY: BalanceY;
}

export function BalanceLines({
  shownBalanceHistories,
  dayX,
  balanceY,
}: BalanceLinesProps): JSX.Element {
  const totalBalanceFill = totalBalanceFillPath(
    shownBalanceHistories,
    dayX,
    balanceY
  );
  const totalBalanceFillUnderLines = totalBalanceFill ? (
    <TotalBalanceFill d={totalBalanceFill} />
  ) : null;
  const linesWithTotalBalanceOnTop = [...shownBalanceHistories]
    .reverse()
    .map((shownBalanceHistory) => (
      <BalanceLine
        key={shownBalanceHistory.shownBalance}
        shownBalanceHistory={shownBalanceHistory}
        dayX={dayX}
        balanceY={balanceY}
      />
    ));

  return (
    <g>
      {totalBalanceFillUnderLines}
      {linesWithTotalBalanceOnTop}
    </g>
  );
}
