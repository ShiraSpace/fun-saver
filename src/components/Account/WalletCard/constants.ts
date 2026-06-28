import type { WalletName } from '@/lib/types';

export const WALLET_CARD_TEST_IDS = {
  card: 'wallet-card',
  balance: 'wallet-balance',
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
} as const;
