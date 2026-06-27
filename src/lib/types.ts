export interface Account {
  id: string;
  name: string;
  avatarId: string;
  isActive: boolean;
  wallets: Wallet[];
}

export type TransactionType = 'deposit' | 'withdrawal' | 'interest';
export type WalletName = 'savings' | 'spending' | 'goodDeeds';

export interface Wallet {
  id: string;
  name: WalletName;
  icon: string;
  monthlyInterestRate: number;
  openedAt: string;
  lastInterestDate: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  accountId: string;
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

export interface AccountWithDerivedWallets extends Account {
  wallets: WalletWithDerived[];
}
