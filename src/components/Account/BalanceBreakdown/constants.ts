import type { WalletName } from '@/lib/types';

export const BALANCE_BREAKDOWN_TEST_IDS = {
  card: 'overview-card',
  total: 'overview-total',
  donut: 'overview-donut',
  arc: 'overview-arc',
  legendRow: 'overview-legend-row',
  legendDot: 'overview-legend-dot',
  legendShare: 'overview-legend-share',
  legendBalance: 'overview-legend-amount',
} as const;

export const BALANCE_BREAKDOWN_COPY = {
  totalLabel: 'סך הכל',
  shortWalletLabel: {
    savings: 'חיסכון',
    spending: 'בזבוזים',
    goodDeeds: 'מעשים',
  },
  share: (percent: number): string => `${percent}%`,
} as const;

export type WalletColor =
  'walletSavings' | 'walletSpending' | 'walletGoodDeeds';

export const WALLET_COLOR: Record<WalletName, WalletColor> = {
  savings: 'walletSavings',
  spending: 'walletSpending',
  goodDeeds: 'walletGoodDeeds',
};

export const DONUT_STYLE = {
  size: 122,
  viewBox: 104,
  center: 52,
  radius: 42,
  strokeWidth: 14,
  rotation: -90,
} as const;

export const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_STYLE.radius;

export const DONUT_ANIMATION = {
  sweepMs: 600,
} as const;

export const TOTAL_ANIMATION = {
  startDelayMs: 80,
  fadeMs: 240,
  countMs: DONUT_ANIMATION.sweepMs,
} as const;

export const LEGEND_ANIMATION = {
  delayMs: 220,
  betweenRowsMs: 50,
  riseMs: 220,
  riseFromPx: 6,
} as const;

export const BALANCE_BREAKDOWN_STYLE = {
  radius: 24,
  padding: 16,
  rowGap: 16,
  totalLabelSize: 10,
  totalLabelSpacing: 0.4,
  totalAmountSize: 26,
  totalMaxDigits: 4,
  legendGap: 11,
  legendRowGap: 9,
  dotSize: 22,
  dotRadius: 7,
  dotFontSize: 12,
  shareSize: 13,
  leaderWidth: 2.5,
  leaderOffset: 5,
} as const;
