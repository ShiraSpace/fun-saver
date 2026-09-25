import { JSX } from 'react';
import type { DayX } from '../chart-geometry';
import { AxisText } from '../chart-parts';
import { DAY_TICK_INSET, TODAY_X } from '../constants';
import { dayTicks } from '../day-ticks';
import { DAY_AXIS_TEST_IDS, DAY_TICK_Y } from './constants';

interface DayAxisProps {
  days: string[];
  dayX: DayX;
  firstDayX: number;
}

function keptInsideChart(x: number, firstDayX: number): number {
  return Math.min(
    Math.max(x, TODAY_X + DAY_TICK_INSET),
    firstDayX - DAY_TICK_INSET
  );
}

export function DayAxis({ days, dayX, firstDayX }: DayAxisProps): JSX.Element {
  const ticks = dayTicks(days).map((dayTick) => {
    const x = keptInsideChart(dayX(dayTick.dayIndex), firstDayX);

    return (
      <AxisText
        key={dayTick.dayIndex}
        x={x}
        y={DAY_TICK_Y}
        textAnchor="middle"
        data-testid={DAY_AXIS_TEST_IDS.tick}
      >
        {dayTick.label}
      </AxisText>
    );
  });

  return <g>{ticks}</g>;
}
