export interface Account {
  id: string;
  name: string;
  avatarId: string;
  isActive: boolean;
}

export type TransactionType = 'deposit' | 'withdrawal' | 'interest';
export type WalletName = 'savings' | 'spending' | 'goodDeeds';

export interface Wallet {
  id: string;
  accountId: string;
  name: WalletName;
  icon: string;
  monthlyInterestRate: number;
  openedAt: string;
  lastInterestDate: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  occurredAt: string;
}

export interface WalletWithDerived extends Wallet {
  balance: number;
  principal: number;
  interestGain: number;
  todayInterest: number;
}
