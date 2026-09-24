import type { WalletSummary } from '@/lib/types';
import { PERCENT_TOTAL, WALLET_LABEL } from '@/lib/constants';
import { dayMonth } from '@/lib/dates';
import { agorotToWholeShekels } from '@/lib/money';

export const WALLET_CARD_TEST_IDS = {
  card: 'wallet-card',
  balance: 'wallet-balance',
  summary: 'wallet-sub-line',
} as const;

export const WALLET_CARD_COPY = {
  name: WALLET_LABEL,
  savingsSummary: (
    wallet: Pick<WalletSummary, 'monthlyInterestRate' | 'openedAt'>
  ): string =>
    `צובר ${Math.round(wallet.monthlyInterestRate * PERCENT_TOTAL)}% בחודש · פעיל מאז ${dayMonth(wallet.openedAt)}`,
  spendingSummary: (wallet: Pick<WalletSummary, 'withdrawn'>): string =>
    `כבר ביזבזת ₪${agorotToWholeShekels(wallet.withdrawn)}`,
  goodDeedsSummary: (wallet: Pick<WalletSummary, 'withdrawn'>): string =>
    `תרמת ₪${agorotToWholeShekels(wallet.withdrawn)} עד היום`,
} as const;

export const WALLET_CARD_STYLE = {
  radius: 16,
  paddingY: 10,
  paddingX: 12,
  gap: 12,
  iconSize: 42,
  iconRadius: 12,
  iconFontSize: 22,
  balancePaddingY: 5,
  balancePaddingX: 11,
  summarySize: 11.5,
  summaryGap: 2,
} as const;
