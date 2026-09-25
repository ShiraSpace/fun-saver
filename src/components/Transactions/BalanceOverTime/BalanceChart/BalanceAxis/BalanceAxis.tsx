import { JSX } from 'react';
import { agorotToShekels } from '@/lib/money';
import { MONEY_COPY } from '@/components/Money/constants';
import {
  balanceTicks,
  type BalanceBounds,
  type BalanceY,
} from '../chart-geometry';
import { AxisText } from '../chart-parts';
import { ANCHOR_RIGHTWARD, FIRST_DAY_X, TODAY_X } from '../constants';
import { BALANCE_AXIS_TEST_IDS, TICK_OFFSET } from './constants';
import { Gridline } from './BalanceAxis.styles';

interface BalanceAxisProps {
  balanceBounds: BalanceBounds;
  balanceY: BalanceY;
}

export function BalanceAxis({
  balanceBounds,
  balanceY,
}: BalanceAxisProps): JSX.Element {
  const ticks = balanceTicks(balanceBounds).map((balance) => {
    const y = balanceY(balance);

    return (
      <g key={balance}>
        <Gridline x1={TODAY_X} x2={FIRST_DAY_X} y1={y} y2={y} />
        <AxisText
          x={FIRST_DAY_X + TICK_OFFSET.x}
          y={y + TICK_OFFSET.y}
          textAnchor={ANCHOR_RIGHTWARD}
          data-testid={BALANCE_AXIS_TEST_IDS.tick}
        >
          {MONEY_COPY.currencySign}
          {agorotToShekels(balance)}
        </AxisText>
      </g>
    );
  });

  return <g>{ticks}</g>;
}
