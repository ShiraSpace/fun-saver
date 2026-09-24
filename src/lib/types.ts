import type { ThemeId } from '@/theme/registry';

export interface Account {
  id: string;
  name: string;
  avatarId: string;
  isActive: boolean;
  themeId: ThemeId;
  wallets: Wallet[];
}

export interface AccountEdits {
  name?: string;
  avatarId?: string;
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
  createdAt: string;
}

export interface WalletSummary extends Wallet {
  balance: number;
  principal: number;
  withdrawn: number;
  interestEarned: number;
  interestEarnedToday: number;
}

export interface AccountSummary extends Account {
  wallets: WalletSummary[];
}

export type AuthProvider = 'google';

export type AccountUserRole = 'owner' | 'editor' | 'viewer';

export interface User {
  id: string;
  provider: AuthProvider;
  providerAccountId: string;
  email: string;
  name: string;
  createdAt: string;
}

export type SignedInUser = Pick<User, 'id' | 'name' | 'email'> & {
  image?: string;
};

export interface AccountUser {
  accountId: string;
  userId: string;
  role: AccountUserRole;
  addedAt: string;
}
