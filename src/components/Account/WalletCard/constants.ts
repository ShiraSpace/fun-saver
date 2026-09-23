import type { WalletWithDerived } from '@/lib/types';
import { PERCENT_TOTAL, WALLET_NAME } from '@/lib/constants';
import { dayMonth } from '@/lib/dates';
import { agorotToWholeShekels } from '@/lib/money';

export const WALLET_CARD_TEST_IDS = {
  card: 'wallet-card',
  balance: 'wallet-balance',
  subLine: 'wallet-sub-line',
} as const;

export const WALLET_CARD_COPY = {
  name: WALLET_NAME,
  savingsSubLine: (
    wallet: Pick<WalletWithDerived, 'monthlyInterestRate' | 'openedAt'>
  ): string =>
    `צובר ${Math.round(wallet.monthlyInterestRate * PERCENT_TOTAL)}% בחודש · פעיל מאז ${dayMonth(wallet.openedAt)}`,
  spendingSubLine: (wallet: Pick<WalletWithDerived, 'withdrawals'>): string =>
    `כבר ביזבזת ₪${agorotToWholeShekels(wallet.withdrawals)}`,
  goodDeedsSubLine: (wallet: Pick<WalletWithDerived, 'withdrawals'>): string =>
    `תרמת ₪${agorotToWholeShekels(wallet.withdrawals)} עד היום`,
} as const;

export const WALLET_CARD_STYLE = {
  radius: 16,
  paddingY: 10,
  paddingX: 12,
  gap: 12,
  illustSize: 42,
  illustRadius: 12,
  illustFontSize: 22,
  pillPaddingY: 5,
  pillPaddingX: 11,
  subLineSize: 11.5,
  subLineGap: 2,
} as const;
