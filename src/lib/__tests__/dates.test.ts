import { addDays, eachDayInclusive } from '../dates';

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
