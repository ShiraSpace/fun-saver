import { eachDayInclusive, shortDayMonth, shortMonth } from '@/lib/dates';
import { dayTicks } from './day-ticks';
import { BALANCE_CHART_COPY } from './constants';

function daysEndingToday(dayCount: number): string[] {
  return eachDayInclusive('2025-01-01', '2026-12-31').slice(-dayCount);
}

describe('the dates along the bottom of the chart', () => {
  it('names each date once on an account younger than the range', () => {
    const dayIndices = dayTicks(daysEndingToday(3)).map(
      ({ dayIndex }) => dayIndex
    );

    expect(dayIndices).toEqual([0, 1, 2]);
  });

  it('ends on today', () => {
    expect(dayTicks(daysEndingToday(31)).at(-1)?.label).toBe(
      BALANCE_CHART_COPY.today
    );
  });

  it('labels an account one day old as today', () => {
    expect(dayTicks(daysEndingToday(1))).toEqual([
      { dayIndex: 0, label: BALANCE_CHART_COPY.today },
    ]);
  });

  it('counts four dates across a week', () => {
    expect(dayTicks(daysEndingToday(8))).toHaveLength(4);
  });

  it('counts five dates across a month', () => {
    expect(dayTicks(daysEndingToday(31))).toHaveLength(5);
  });

  it('counts six dates across a year', () => {
    expect(dayTicks(daysEndingToday(366))).toHaveLength(6);
  });

  it('writes the day and month across a month', () => {
    const days = daysEndingToday(31);
    const [firstTick] = dayTicks(days);

    expect(firstTick.label).toBe(shortDayMonth(days[firstTick.dayIndex]));
  });

  it('switches to month names past four months', () => {
    const days = daysEndingToday(151);
    const [firstTick] = dayTicks(days);

    expect(firstTick.label).toBe(shortMonth(days[firstTick.dayIndex], false));
  });

  it('adds the year past ten months', () => {
    const days = daysEndingToday(366);
    const [firstTick] = dayTicks(days);

    expect(firstTick.label).toBe(shortMonth(days[firstTick.dayIndex], true));
  });
});
