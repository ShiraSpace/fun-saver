import type { ShownBalance } from '../../use-transactions-view-choices';
import { shownBalanceLabel } from '../constants';

export const CHART_BOX = { width: 332, height: 112 } as const;
export const CHART_PADDING = {
  top: 12,
  bottom: 17,
  today: 6,
  firstDay: 38,
} as const;
export const TODAY_X = CHART_PADDING.today;
export const FIRST_DAY_X = CHART_BOX.width - CHART_PADDING.firstDay;
export const HIGHEST_BALANCE_Y = CHART_PADDING.top;
export const LOWEST_BALANCE_Y = CHART_BOX.height - CHART_PADDING.bottom;
export const FLAT_BALANCE_Y = (HIGHEST_BALANCE_Y + LOWEST_BALANCE_Y) / 2;
export const VIEW_BOX = `0 0 ${CHART_BOX.width} ${CHART_BOX.height}`;

export const LABEL_GAP = 11;
export const BALANCE_TICK_COUNT = 3;
export const DAY_TICK_INSET = 16;
export const ANCHOR_RIGHTWARD = 'end';

export const DAY_TICK_COUNT_BY_DAYS = [
  { upTo: 7, count: 4 },
  { upTo: 45, count: 5 },
  { upTo: Infinity, count: 6 },
] as const;
export const MONTH_NAMES_PAST_DAYS = 120;
export const YEARS_PAST_DAYS = 300;

export const BALANCE_CHART_TEST_IDS = {
  chart: 'balance-chart',
  message: 'balance-chart-message',
} as const;

export const BALANCE_CHART_COPY = {
  balanceOverTime: 'מאזן לאורך זמן',
  today: 'היום',
  noTransactions: { text: 'עוד אין תנועות להציג' },
  noBalanceShown: {
    text: 'בחרו קו אחד לפחות להצגה',
    label: 'לא נבחר קו להצגה',
  },
} as const;

export function chartLabel(
  rangeLabel: string,
  shownBalances: readonly ShownBalance[]
): string {
  const shownBalanceLabels = shownBalances.map(shownBalanceLabel).join(', ');

  return `${BALANCE_CHART_COPY.balanceOverTime} · ${rangeLabel} · ${shownBalanceLabels}`;
}
