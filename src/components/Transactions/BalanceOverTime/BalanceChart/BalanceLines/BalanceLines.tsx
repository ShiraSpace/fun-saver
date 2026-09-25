import { JSX } from 'react';
import {
  totalBalanceFillPath,
  type BalanceY,
  type ShownBalanceHistory,
} from '../chart-geometry';
import { BalanceLine } from './BalanceLine';
import { TotalBalanceFill } from './BalanceLines.styles';

interface BalanceLinesProps {
  shownBalanceHistories: ShownBalanceHistory[];
  balanceY: BalanceY;
}

export function BalanceLines({
  shownBalanceHistories,
  balanceY,
}: BalanceLinesProps): JSX.Element {
  const totalBalanceFill = totalBalanceFillPath(
    shownBalanceHistories,
    balanceY
  );
  const totalBalanceOnTop = [...shownBalanceHistories].reverse();

  return (
    <g>
      {totalBalanceFill && <TotalBalanceFill d={totalBalanceFill} />}
      {totalBalanceOnTop.map((shownBalanceHistory) => (
        <BalanceLine
          key={shownBalanceHistory.shownBalance}
          shownBalanceHistory={shownBalanceHistory}
          balanceY={balanceY}
        />
      ))}
    </g>
  );
}
