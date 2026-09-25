import { SAVINGS_MONTHLY_RATE } from '@/lib/interest/constants';
import type { AccountUserRole, AuthProvider, WalletName } from './types';

export const GOOGLE_PROVIDER: AuthProvider = 'google';

export const SIGN_IN_PATH = '/login';

export const EDITING_ROLES: readonly AccountUserRole[] = ['owner', 'editor'];

export const AGOROT_PER_SHEKEL = 100;

export const PERCENT_TOTAL = 100;

export const MAX_ACCOUNT_NAME_LENGTH = 60;

export interface WalletConfig {
  name: WalletName;
  icon: string;
  monthlyInterestRate: number;
}

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
