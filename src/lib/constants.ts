import type { WalletName } from './types';

export const AGOROT_PER_SHEKEL = 100;

export const SAVINGS_MONTHLY_RATE = 0.15;

export interface WalletSeed {
  name: WalletName;
  icon: string;
  monthlyInterestRate: number;
}

export const DEFAULT_WALLETS: readonly WalletSeed[] = [
  { name: 'savings', icon: '🐷', monthlyInterestRate: SAVINGS_MONTHLY_RATE },
  { name: 'spending', icon: '🛍️', monthlyInterestRate: 0 },
  { name: 'goodDeeds', icon: '💛', monthlyInterestRate: 0 },
];
