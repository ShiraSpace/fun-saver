import type { ShownBalance } from '../../constants';
import { shownBalanceLabel } from '../constants';

export const UNMEASURED_CHART_WIDTH = 332;
export const CHART_HEIGHT = 112;
export const CHART_PADDING = {
  top: 12,
  bottom: 20,
  today: 6,
  firstDay: 46,
} as const;
export const TODAY_X = CHART_PADDING.today;
export const HIGHEST_BALANCE_Y = CHART_PADDING.top;
export const LOWEST_BALANCE_Y = CHART_HEIGHT - CHART_PADDING.bottom;
export const FLAT_BALANCE_Y = (HIGHEST_BALANCE_Y + LOWEST_BALANCE_Y) / 2;
export const MESSAGE_Y = CHART_HEIGHT / 2;

export const LABEL_GAP = 14;
export const BALANCE_TICK_COUNT = 3;
export const DAY_TICK_INSET = 20;
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
  noTransactions: {
    text: 'עוד אין תנועות להציג',
    label: 'עוד אין תנועות להציג',
  },
  noBalanceShown: {
    text: 'בחרו קו אחד לפחות להצגה',
    label: 'לא נבחר קו להצגה',
  },
} as const;

export function viewBoxOf(chartWidth: number): string {
  return `0 0 ${chartWidth} ${CHART_HEIGHT}`;
}

export function chartLabel(
  rangeLabel: string,
  shownBalances: readonly ShownBalance[]
): string {
  const shownBalanceLabels = shownBalances.map(shownBalanceLabel).join(', ');

  return `${BALANCE_CHART_COPY.balanceOverTime} · ${rangeLabel} · ${shownBalanceLabels}`;
}
