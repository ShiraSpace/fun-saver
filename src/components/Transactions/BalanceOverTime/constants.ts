export type RangeId = 'week' | 'month' | 'year' | 'all';

export interface Range {
  id: RangeId;
  days: number;
  label: string;
  changeLabel: string;
}

export const RANGES: readonly Range[] = [
  { id: 'week', days: 7, label: 'שבוע', changeLabel: 'השבוע' },
  { id: 'month', days: 30, label: 'חודש', changeLabel: 'החודש' },
  { id: 'year', days: 365, label: 'שנה', changeLabel: 'השנה' },
  { id: 'all', days: Infinity, label: 'הכל', changeLabel: 'מאז ההתחלה' },
];

export const DEFAULT_RANGE: RangeId = 'month';

export const BALANCE_OVER_TIME_TEST_IDS = {
  card: 'balance-over-time',
  ranges: 'balance-over-time-range',
} as const;

export const BALANCE_OVER_TIME_COPY = {
  rangeName: 'balance-over-time-range',
  rangeLegend: 'טווח זמן',
} as const;
