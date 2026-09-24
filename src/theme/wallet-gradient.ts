import type { WalletName } from '@/lib/types';
import type { ThemeGradients } from './theme-tokens';

export type WalletGradient = Extract<
  keyof ThemeGradients,
  'walletSavings' | 'walletSpending' | 'walletGoodDeeds'
>;

export const WALLET_GRADIENT: Record<WalletName, WalletGradient> = {
  savings: 'walletSavings',
  spending: 'walletSpending',
  goodDeeds: 'walletGoodDeeds',
};
