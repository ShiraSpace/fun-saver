'use client';

import { JSX } from 'react';
import { useTheme } from '@emotion/react';
import { SHOWN_BALANCE } from '../../../../constants';
import {
  balanceLinePath,
  type BalanceY,
  type DayX,
  type ShownBalanceHistory,
} from '../../chart-geometry';
import { shownBalanceColor } from '../../chart-parts';
import { TODAY_X } from '../../constants';
import { BALANCE_LINE_TEST_IDS, SINGLE_DAY_DOT_RADIUS } from './constants';
import { Line } from './BalanceLine.styles';

interface BalanceLineProps {
  shownBalanceHistory: ShownBalanceHistory;
  dayX: DayX;
  balanceY: BalanceY;
}

export function BalanceLine({
  shownBalanceHistory,
  dayX,
  balanceY,
}: BalanceLineProps): JSX.Element {
  const theme = useTheme();
  const { shownBalance, dailyBalances } = shownBalanceHistory;
  const color = shownBalanceColor(theme.colors, shownBalance);
  const testId = BALANCE_LINE_TEST_IDS.line(shownBalance);

  if (dailyBalances.length === 1) {
    const todaysBalanceY = balanceY(dailyBalances[0]);

    return (
      <circle
        cx={TODAY_X}
        cy={todaysBalanceY}
        r={SINGLE_DAY_DOT_RADIUS}
        fill={color}
        data-testid={testId}
      />
    );
  }

  const linePath = balanceLinePath(dailyBalances, dayX, balanceY);
  const isTotalBalance = shownBalance === SHOWN_BALANCE.totalBalance;

  return (
    <Line
      d={linePath}
      stroke={color}
      data-total-balance={isTotalBalance}
      data-testid={testId}
    />
  );
}
