import type { ThemeId } from '@/theme/registry';
import type { Wallet, WalletSummary } from '@/lib/wallet/types';

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
