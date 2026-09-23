import type { AccountUserRole, AuthProvider, WalletName } from './types';

export const GOOGLE_PROVIDER: AuthProvider = 'google';

export const LOGIN_PATH = '/login';

export const SESSION_COOKIE_NAMES = [
  'authjs.session-token',
  '__Secure-authjs.session-token',
] as const;

export const EDITING_ROLES: readonly AccountUserRole[] = ['owner', 'editor'];

export const AGOROT_PER_SHEKEL = 100;

export const PERCENT_TOTAL = 100;

export const MAX_ACCOUNT_NAME_LENGTH = 60;

export const DAYS_PER_MONTH = 30;

export const SAVINGS_MONTHLY_RATE = 0.15;

export const DEPOSIT_SPLIT: Record<WalletName, number> = {
  savings: 0.4,
  spending: 0.5,
  goodDeeds: 0.1,
};

export interface WalletSeed {
  name: WalletName;
  icon: string;
  monthlyInterestRate: number;
}

export const WALLET_NAME: Record<WalletName, string> = {
  savings: 'חיסכון',
  spending: 'בזבוזים',
  goodDeeds: 'מעשים טובים',
};

export const WALLET_ICON: Record<WalletName, string> = {
  savings: '🐷',
  spending: '🛍️',
  goodDeeds: '💛',
};

export const DEFAULT_WALLETS: readonly WalletSeed[] = [
  {
    name: 'savings',
    icon: WALLET_ICON.savings,
    monthlyInterestRate: SAVINGS_MONTHLY_RATE,
  },
  { name: 'spending', icon: WALLET_ICON.spending, monthlyInterestRate: 0 },
  { name: 'goodDeeds', icon: WALLET_ICON.goodDeeds, monthlyInterestRate: 0 },
];
