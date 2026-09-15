import type { WalletName } from '@/lib/types';

export const OVERVIEW_CARD_TEST_IDS = {
  card: 'overview-card',
  total: 'overview-total',
  donut: 'overview-donut',
  legendRow: 'overview-legend-row',
  legendDot: 'overview-legend-dot',
  legendShare: 'overview-legend-share',
  legendAmount: 'overview-legend-amount',
} as const;

export const OVERVIEW_CARD_COPY = {
  totalLabel: 'סך הכל',
  name: {
    savings: 'חיסכון',
    spending: 'בזבוזים',
    goodDeeds: 'מעשים',
  },
  share: (percent: number): string => `${percent}%`,
} as const;

export type WalletArcColor = 'walletSavings' | 'walletSpending' | 'walletGood';

export const WALLET_ARC_COLOR: Record<WalletName, WalletArcColor> = {
  savings: 'walletSavings',
  spending: 'walletSpending',
  goodDeeds: 'walletGood',
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
  amountDelayMs: 80,
  amountMs: 240,
  legendDelayMs: 220,
  legendStepMs: 50,
  legendMs: 220,
} as const;

export const OVERVIEW_CARD_STYLE = {
  radius: 24,
  padding: 16,
  shadow: '0 6px 0 rgba(0, 0, 0, 0.06)',
  rowGap: 16,
  holeLabelSize: 10,
  holeLabelSpacing: 0.4,
  holeAmountSize: 26,
  holeMaxDigits: 4,
  legendGap: 11,
  legendRowGap: 9,
  dotSize: 22,
  dotRadius: 7,
  dotFontSize: 12,
  shareSize: 13,
  leaderWidth: 2.5,
  leaderOffset: 5,
} as const;
