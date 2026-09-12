import type { Account, Transaction, Wallet } from '@/lib/types';
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

export function toAccount(row: AccountRow): Account {
  return {
    id: row.id,
    name: row.name,
    avatarId: row.avatar_id,
    isActive: row.is_active,
    themeId: row.theme_id as ThemeId,
    wallets: row.wallets as Wallet[],
  };
}

export function toTransaction(row: TransactionRow): Transaction {
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
