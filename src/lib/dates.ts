const HEBREW_DAY_MONTH = new Intl.DateTimeFormat('he', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

const HEBREW_MONTH = new Intl.DateTimeFormat('he', {
  month: 'long',
  timeZone: 'UTC',
});

const HEBREW_MONTH_AND_YEAR = new Intl.DateTimeFormat('he', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

function utcDate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

export function dayMonth(iso: string): string {
  return HEBREW_DAY_MONTH.format(utcDate(iso));
}

export function addDays(iso: string, days: number): string {
  const date = utcDate(iso);
  date.setUTCDate(date.getUTCDate() + days);

  return date.toISOString().slice(0, 10);
}

export function eachDayInclusive(start: string, end: string): string[] {
  const days: string[] = [];

  for (let day = start; day <= end; day = addDays(day, 1)) {
    days.push(day);
  }

  return days;
}

const YEAR_MONTH_LENGTH = 'YYYY-MM'.length;

export function calendarMonth(iso: string): string {
  return iso.slice(0, YEAR_MONTH_LENGTH);
}

const YEAR_LENGTH = 'YYYY'.length;

export function calendarYear(iso: string): string {
  return iso.slice(0, YEAR_LENGTH);
}

export function monthLabel(month: string, asOf: string): string {
  const firstDay = utcDate(`${month}-01`);
  const monthFormat =
    calendarYear(asOf) === calendarYear(month)
      ? HEBREW_MONTH
      : HEBREW_MONTH_AND_YEAR;

  return monthFormat.format(firstDay);
}
