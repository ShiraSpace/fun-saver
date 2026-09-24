export type RangeId = 'week' | 'month' | 'year' | 'all';

export interface Range {
  id: RangeId;
  days: number;
  label: string;
  changeLabel: string;
}

export const RANGE: Record<RangeId, Range> = {
  week: { id: 'week', days: 7, label: 'שבוע', changeLabel: 'השבוע' },
  month: { id: 'month', days: 30, label: 'חודש', changeLabel: 'החודש' },
  year: { id: 'year', days: 365, label: 'שנה', changeLabel: 'השנה' },
  all: { id: 'all', days: Infinity, label: 'הכל', changeLabel: 'מאז ההתחלה' },
};

export const RANGES: readonly Range[] = Object.values(RANGE);

export const DEFAULT_RANGE: RangeId = 'month';

export const BALANCE_OVER_TIME_TEST_IDS = {
  card: 'balance-over-time',
  ranges: 'balance-over-time-range',
} as const;

export const BALANCE_OVER_TIME_COPY = {
  rangeName: 'balance-over-time-range',
  rangeLegend: 'טווח זמן',
} as const;
