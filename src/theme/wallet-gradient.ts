import type { WalletName } from '@/lib/types';
import type { ThemeGradients } from './theme-tokens';

export type WalletGradient = Extract<
  keyof ThemeGradients,
  'potSavings' | 'potSpending' | 'potGood'
>;

export const WALLET_GRADIENT: Record<WalletName, WalletGradient> = {
  savings: 'potSavings',
  spending: 'potSpending',
  goodDeeds: 'potGood',
};
