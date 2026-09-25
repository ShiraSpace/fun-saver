export type WalletName = 'savings' | 'spending' | 'goodDeeds';

export interface Wallet {
  id: string;
  name: WalletName;
  icon: string;
  monthlyInterestRate: number;
  openedAt: string;
  lastInterestDate: string;
}

export interface WalletSummary extends Wallet {
  balance: number;
  principal: number;
  withdrawn: number;
  interestEarned: number;
  interestEarnedToday: number;
}

export interface WalletConfig {
  name: WalletName;
  icon: string;
  monthlyInterestRate: number;
}
