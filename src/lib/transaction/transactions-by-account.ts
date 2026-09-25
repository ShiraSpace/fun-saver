import type { SettledAccount } from '@/lib/interest/interest-settlement';
import { NO_TRANSACTIONS } from './constants';
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

export function accountTransactions(
  transactionsByAccount: TransactionsByAccount,
  accountId: string
): TransactionsByAccount[string] {
  return transactionsByAccount[accountId] ?? NO_TRANSACTIONS;
}
