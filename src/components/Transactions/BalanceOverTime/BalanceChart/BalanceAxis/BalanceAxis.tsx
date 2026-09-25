import { JSX } from 'react';
import { agorotToShekels } from '@/lib/money';
import { MONEY_COPY } from '@/components/Money/constants';
import {
  balanceTicks,
  type BalanceBounds,
  type BalanceY,
} from '../chart-geometry';
import { AxisText } from '../chart-parts';
import { ANCHOR_RIGHTWARD, TODAY_X } from '../constants';
import { BALANCE_AXIS_TEST_IDS, TICK_OFFSET } from './constants';
import { Gridline } from './BalanceAxis.styles';

interface BalanceAxisProps {
  balanceBounds: BalanceBounds;
  balanceY: BalanceY;
  firstDayX: number;
}

export function BalanceAxis({
  balanceBounds,
  balanceY,
  firstDayX,
}: BalanceAxisProps): JSX.Element {
  const tickX = firstDayX + TICK_OFFSET.x;
  const ticks = balanceTicks(balanceBounds).map((balance) => {
    const y = balanceY(balance);
    const textY = y + TICK_OFFSET.y;
    const tickText = `${MONEY_COPY.currencySign}${agorotToShekels(balance)}`;

    return (
      <g key={balance}>
        <Gridline x1={TODAY_X} x2={firstDayX} y1={y} y2={y} />
        <AxisText
          x={tickX}
          y={textY}
          textAnchor={ANCHOR_RIGHTWARD}
          data-testid={BALANCE_AXIS_TEST_IDS.tick}
        >
          {tickText}
        </AxisText>
      </g>
    );
  });

  return <g>{ticks}</g>;
}
