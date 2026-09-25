import type { SettledAccount } from '@/lib/interest/interest-settlement';
import type { Transaction } from './types';

export type TransactionsByAccount = Record<
  string,
  Omit<Transaction, 'id' | 'accountId'>[]
>;

function transactionsSentToThePage(
  transactions: Transaction[]
): TransactionsByAccount[string] {
  return transactions.map(
    ({ walletId, type, amount, occurredAt, createdAt }) => ({
      walletId,
      type,
      amount,
      occurredAt,
      createdAt,
    })
  );
}

export function transactionsByAccount(
  settledAccounts: SettledAccount[]
): TransactionsByAccount {
  return Object.fromEntries(
    settledAccounts.map((settledAccount) => [
      settledAccount.account.id,
      transactionsSentToThePage(settledAccount.transactions),
    ])
  );
}
