import {
  addDays,
  calendarMonth,
  calendarYear,
  eachDayInclusive,
  monthLabel,
} from '../dates';

describe('addDays', () => {
  it('advances within a month', () => {
    expect(addDays('2026-01-01', 1)).toBe('2026-01-02');
  });

  it('rolls over month and year boundaries', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });
});

describe('eachDayInclusive', () => {
  it('lists every day from start through end', () => {
    expect(eachDayInclusive('2026-01-02', '2026-01-04')).toEqual([
      '2026-01-02',
      '2026-01-03',
      '2026-01-04',
    ]);
  });

  it('returns the single day when start equals end', () => {
    expect(eachDayInclusive('2026-01-05', '2026-01-05')).toEqual([
      '2026-01-05',
    ]);
  });

  it('returns nothing when start is after end', () => {
    expect(eachDayInclusive('2026-01-05', '2026-01-04')).toEqual([]);
  });
});

describe('calendarMonth', () => {
  it('names the month a day falls in', () => {
    expect(calendarMonth('2026-09-14')).toBe('2026-09');
  });
});

describe('calendarYear', () => {
  it('reads the year of a day', () => {
    expect(calendarYear('2026-09-25')).toBe('2026');
  });

  it('reads the year of a month', () => {
    expect(calendarYear('2025-12')).toBe('2025');
  });
});

describe('monthLabel', () => {
  const mockAsOf = '2026-09-25';

  it('names a month of this year without the year', () => {
    expect(monthLabel('2026-09', mockAsOf)).toBe('ספטמבר');
  });

  it('adds the year to a month of another year', () => {
    expect(monthLabel('2025-09', mockAsOf)).toBe('ספטמבר 2025');
  });
});
