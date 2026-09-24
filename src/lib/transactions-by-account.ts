import type { SettledAccount } from './interest-settlement';
import type { Transaction } from './types';

export function transactionsByAccount(
  settledAccounts: SettledAccount[]
): Record<string, Omit<Transaction, 'id' | 'accountId'>[]> {
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
