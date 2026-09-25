import {
  addDays,
  calendarMonth,
  calendarYear,
  eachDayInclusive,
  monthLabel,
  shortDayMonth,
  shortMonth,
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

describe('shortDayMonth', () => {
  it('writes a short date the way the chart prints it', () => {
    expect(shortDayMonth('2026-09-14')).toBe('14.9');
  });
});

describe('shortMonth', () => {
  const mockDay = '2026-09-14';
  const hebrewShortMonth = new Intl.DateTimeFormat('he', {
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(`${mockDay}T00:00:00Z`));

  it('names the month in short Hebrew', () => {
    expect(shortMonth(mockDay, false)).toBe(hebrewShortMonth);
  });

  it('adds the last two digits of the year when asked', () => {
    expect(shortMonth(mockDay, true)).toBe(`${hebrewShortMonth} 26`);
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
