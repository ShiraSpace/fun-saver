import type {
  Account,
  AccountUser,
  AuthProvider,
  AccountUserRole,
  Transaction,
  User,
  Wallet,
} from '@/lib/types';
import type { ThemeId } from '@/theme/registry';

export interface AccountRow {
  id: string;
  name: string;
  avatar_id: string;
  is_active: boolean;
  theme_id: string;
  wallets: unknown;
}

export interface TransactionRow {
  id: string;
  wallet_id: string;
  account_id: string;
  type: string;
  amount: number;
  occurred_at: string;
  created_at: string;
}

export function accountFromRow(row: AccountRow): Account {
  return {
    id: row.id,
    name: row.name,
    avatarId: row.avatar_id,
    isActive: row.is_active,
    themeId: row.theme_id as ThemeId,
    wallets: row.wallets as Wallet[],
  };
}

export function transactionFromRow(row: TransactionRow): Transaction {
  return {
    id: row.id,
    walletId: row.wallet_id,
    accountId: row.account_id,
    type: row.type as Transaction['type'],
    amount: row.amount,
    occurredAt: row.occurred_at,
    createdAt: row.created_at,
  };
}

export interface UserRow {
  id: string;
  provider: string;
  provider_account_id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface AccountUserRow {
  account_id: string;
  user_id: string;
  role: string;
  added_at: string;
}

export function userFromRow(row: UserRow): User {
  return {
    id: row.id,
    provider: row.provider as AuthProvider,
    providerAccountId: row.provider_account_id,
    email: row.email,
    name: row.name,
    createdAt: row.created_at,
  };
}

export function accountUserFromRow(row: AccountUserRow): AccountUser {
  return {
    accountId: row.account_id,
    userId: row.user_id,
    role: row.role as AccountUserRole,
    addedAt: row.added_at,
  };
}
