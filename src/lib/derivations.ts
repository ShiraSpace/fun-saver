import type { Transaction, TransactionType } from './types';

function sumOf(transactions: Transaction[], type: TransactionType): number {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((total, transaction) => total + transaction.amount, 0);
}

export function principal(transactions: Transaction[]): number {
  return sumOf(transactions, 'deposit') - sumOf(transactions, 'withdrawal');
}

export function interestGain(transactions: Transaction[]): number {
  return sumOf(transactions, 'interest');
}

export function balance(transactions: Transaction[]): number {
  return principal(transactions) + interestGain(transactions);
}

export function todayInterest(
  transactions: Transaction[],
  asOf: string
): number {
  return transactions
    .filter(
      (transaction) =>
        transaction.type === 'interest' && transaction.occurredAt === asOf
    )
    .reduce((total, transaction) => total + transaction.amount, 0);
}
