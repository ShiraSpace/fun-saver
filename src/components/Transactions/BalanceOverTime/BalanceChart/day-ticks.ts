import { shortDayMonth, shortMonth } from '@/lib/dates';
import {
  BALANCE_CHART_COPY,
  DAY_TICK_COUNT_BY_DAYS,
  MONTH_NAMES_PAST_DAYS,
  YEARS_PAST_DAYS,
} from './constants';

export interface DayTick {
  dayIndex: number;
  label: string;
}

function dayTickCount(daysBack: number): number {
  return (
    DAY_TICK_COUNT_BY_DAYS.find(({ upTo }) => daysBack <= upTo)?.count ?? 0
  );
}

function dayLabel(day: string, daysBack: number): string {
  if (daysBack <= MONTH_NAMES_PAST_DAYS) {
    return shortDayMonth(day);
  }

  return shortMonth(day, daysBack > YEARS_PAST_DAYS);
}

export function dayTicks(days: string[]): DayTick[] {
  const daysBack = days.length - 1;

  if (daysBack < 1) {
    return days.map((_, dayIndex) => ({
      dayIndex,
      label: BALANCE_CHART_COPY.today,
    }));
  }

  const count = dayTickCount(daysBack);
  const dayIndices = Array.from({ length: count }, (_, step) =>
    Math.round((daysBack * step) / (count - 1))
  );

  const distinctDayIndices = [...new Set(dayIndices)];

  return distinctDayIndices.map((dayIndex) => ({
    dayIndex,
    label:
      dayIndex === daysBack
        ? BALANCE_CHART_COPY.today
        : dayLabel(days[dayIndex], daysBack),
  }));
}
