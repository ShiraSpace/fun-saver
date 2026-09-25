import { WALLET_SHORT_LABEL } from '@/lib/wallet/constants';
import type { WalletName } from '@/lib/wallet/types';
import type { ShownBalance } from '../use-transactions-view-choices';
import { TOTAL_BALANCE_COPY } from './TotalBalance/constants';

export type RangeId = 'week' | 'month' | 'year' | 'all';

export interface TimeRange {
  id: RangeId;
  days: number;
  label: string;
  changeLabel: string;
}

export const RANGE: Record<RangeId, TimeRange> = {
  week: { id: 'week', days: 7, label: 'שבוע', changeLabel: 'השבוע' },
  month: { id: 'month', days: 30, label: 'חודש', changeLabel: 'החודש' },
  year: { id: 'year', days: 365, label: 'שנה', changeLabel: 'השנה' },
  all: { id: 'all', days: Infinity, label: 'הכל', changeLabel: 'מאז ההתחלה' },
};

export const RANGES: readonly TimeRange[] = Object.values(RANGE);

export const DEFAULT_RANGE: RangeId = 'month';

export const BALANCE_OVER_TIME_RANGE_GROUP_NAME = 'balance-over-time-range';

export const BALANCE_OVER_TIME_TEST_IDS = {
  card: 'balance-over-time',
  ranges: BALANCE_OVER_TIME_RANGE_GROUP_NAME,
} as const;

export const BALANCE_OVER_TIME_COPY = {
  rangeLegend: 'טווח זמן',
} as const;

export type WalletChartColor =
  'chartSavings' | 'chartSpending' | 'chartGoodDeeds';

export const WALLET_CHART_COLOR: Record<WalletName, WalletChartColor> = {
  savings: 'chartSavings',
  spending: 'chartSpending',
  goodDeeds: 'chartGoodDeeds',
};

export function shownBalanceLabel(shownBalance: ShownBalance): string {
  return shownBalance === 'totalBalance'
    ? TOTAL_BALANCE_COPY.label
    : WALLET_SHORT_LABEL[shownBalance];
}
