import type { SettledAccount } from './interest-settlement';
import type { Transaction } from './types';

export type TransactionsByAccount = Record<
  string,
  Omit<Transaction, 'id' | 'accountId'>[]
>;

export function transactionsByAccount(
  settledAccounts: SettledAccount[]
): TransactionsByAccount {
  return Object.fromEntries(
    settledAccounts.map((settledAccount) => [
      settledAccount.account.id,
      settledAccount.transactions.map(
        ({ walletId, type, amount, occurredAt, createdAt }) => ({
          walletId,
          type,
          amount,
          occurredAt,
          createdAt,
        })
      ),
    ])
  );
}
