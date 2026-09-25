import { SAVINGS_MONTHLY_RATE } from '@/lib/interest/constants';
import type { WalletConfig, WalletName } from './types';

export const PERCENT_TOTAL = 100;

export const WALLET_LABEL: Record<WalletName, string> = {
  savings: 'חיסכון',
  spending: 'בזבוזים',
  goodDeeds: 'מעשים טובים',
};

export const WALLET_ICON: Record<WalletName, string> = {
  savings: '🐷',
  spending: '🛍️',
  goodDeeds: '💛',
};

export const DEFAULT_WALLETS: readonly WalletConfig[] = [
  {
    name: 'savings',
    icon: WALLET_ICON.savings,
    monthlyInterestRate: SAVINGS_MONTHLY_RATE,
  },
  { name: 'spending', icon: WALLET_ICON.spending, monthlyInterestRate: 0 },
  { name: 'goodDeeds', icon: WALLET_ICON.goodDeeds, monthlyInterestRate: 0 },
];
