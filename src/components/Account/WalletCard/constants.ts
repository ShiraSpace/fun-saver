import type { WalletName } from '@/lib/types';
import { PERCENT_TOTAL } from '@/lib/constants';

const HEBREW_DAY_MONTH = new Intl.DateTimeFormat('he', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

const dayMonth = (isoDate: string): string =>
  HEBREW_DAY_MONTH.format(new Date(`${isoDate}T00:00:00Z`));

export const WALLET_CARD_TEST_IDS = {
  card: 'wallet-card',
  balance: 'wallet-balance',
  subLine: 'wallet-sub-line',
} as const;

export const WALLET_GRADIENT: Record<
  WalletName,
  'potSavings' | 'potSpending' | 'potGood'
> = {
  savings: 'potSavings',
  spending: 'potSpending',
  goodDeeds: 'potGood',
};

export const WALLET_CARD_COPY = {
  name: {
    savings: 'חיסכון',
    spending: 'בזבוזים',
    goodDeeds: 'מעשים טובים',
  },
  savingsSubLine: (monthlyRate: number, openedAt: string): string =>
    `צובר ${Math.round(monthlyRate * PERCENT_TOTAL)}% בחודש · פעיל מאז ${dayMonth(openedAt)}`,
} as const;

export const WALLET_CARD_STYLE = {
  radius: 16,
  paddingY: 10,
  paddingX: 12,
  gap: 12,
  shadow: '0 3px 0 rgba(0, 0, 0, 0.06)',
  illustSize: 42,
  illustRadius: 12,
  illustFontSize: 22,
  pillPaddingY: 5,
  pillPaddingX: 11,
  subLineSize: 11.5,
  subLineGap: 2,
} as const;
