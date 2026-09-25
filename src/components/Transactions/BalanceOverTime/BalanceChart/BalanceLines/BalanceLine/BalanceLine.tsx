'use client';

import { JSX } from 'react';
import { useTheme } from '@emotion/react';
import {
  balanceLinePath,
  dayX,
  type BalanceY,
  type ShownBalanceHistory,
} from '../../chart-geometry';
import { shownBalanceColor } from '../../chart-parts';
import { BALANCE_LINE_TEST_IDS, SINGLE_DAY_DOT_RADIUS } from './constants';
import { Line } from './BalanceLine.styles';

interface BalanceLineProps {
  shownBalanceHistory: ShownBalanceHistory;
  balanceY: BalanceY;
}

export function BalanceLine({
  shownBalanceHistory,
  balanceY,
}: BalanceLineProps): JSX.Element {
  const theme = useTheme();
  const { shownBalance, dailyBalances } = shownBalanceHistory;
  const color = shownBalanceColor(theme.colors, shownBalance);
  const testId = BALANCE_LINE_TEST_IDS.line(shownBalance);

  if (dailyBalances.length === 1) {
    return (
      <circle
        cx={dayX(0, 1)}
        cy={balanceY(dailyBalances[0])}
        r={SINGLE_DAY_DOT_RADIUS}
        fill={color}
        data-testid={testId}
      />
    );
  }

  return (
    <Line
      d={balanceLinePath(dailyBalances, balanceY)}
      stroke={color}
      data-total-balance={shownBalance === 'totalBalance'}
      data-testid={testId}
    />
  );
}
