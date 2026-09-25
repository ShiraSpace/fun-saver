import { JSX } from 'react';
import { dayX } from '../chart-geometry';
import { AxisText } from '../chart-parts';
import { CHART_BOX, DAY_TICK_INSET, FIRST_DAY_X, TODAY_X } from '../constants';
import { dayTicks } from '../day-ticks';
import { DAY_AXIS_TEST_IDS, DAY_TICK_ABOVE_BOTTOM } from './constants';

interface DayAxisProps {
  days: string[];
}

function keptInsideChart(x: number): number {
  return Math.min(
    Math.max(x, TODAY_X + DAY_TICK_INSET),
    FIRST_DAY_X - DAY_TICK_INSET
  );
}

export function DayAxis({ days }: DayAxisProps): JSX.Element {
  const ticks = dayTicks(days).map((dayTick) => (
    <AxisText
      key={dayTick.dayIndex}
      x={keptInsideChart(dayX(dayTick.dayIndex, days.length))}
      y={CHART_BOX.height - DAY_TICK_ABOVE_BOTTOM}
      textAnchor="middle"
      data-testid={DAY_AXIS_TEST_IDS.tick}
    >
      {dayTick.label}
    </AxisText>
  ));

  return <g>{ticks}</g>;
}
