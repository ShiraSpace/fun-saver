import { render, screen } from '@/test-utils/render';
import { eachDayInclusive } from '@/lib/dates';
import { dayXWithin, firstDayXOf } from '../chart-geometry';
import { DAY_TICK_INSET, TODAY_X, UNMEASURED_CHART_WIDTH } from '../constants';
import { DAY_AXIS_TEST_IDS } from './constants';
import { DayAxis } from './DayAxis';

const mockDays = eachDayInclusive('2026-01-01', '2026-01-31');
const mockFirstDayX = firstDayXOf(UNMEASURED_CHART_WIDTH);

describe('the dates along the bottom of the chart', () => {
  beforeEach(() => {
    render(
      <svg>
        <DayAxis
          days={mockDays}
          dayX={dayXWithin(mockDays.length, mockFirstDayX)}
          firstDayX={mockFirstDayX}
        />
      </svg>
    );
  });

  it('keeps today’s date inside the chart rather than cut off at its edge', () => {
    const todayTick = screen.getAllByTestId(DAY_AXIS_TEST_IDS.tick).at(-1);

    expect(Number(todayTick?.getAttribute('x'))).toBe(TODAY_X + DAY_TICK_INSET);
  });
});
