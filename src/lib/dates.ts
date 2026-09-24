const HEBREW_DAY_MONTH = new Intl.DateTimeFormat('he', {
  day: 'numeric',
  month: 'long',
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

const MONTH_LENGTH = 7;

export function calendarMonth(iso: string): string {
  return iso.slice(0, MONTH_LENGTH);
}
