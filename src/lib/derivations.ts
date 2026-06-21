import type { Transaction, TransactionType } from './types';

function sumOf(txns: Transaction[], type: TransactionType): number {
  return txns
    .filter((txn) => txn.type === type)
    .reduce((total, txn) => total + txn.amount, 0);
}

export function principal(txns: Transaction[]): number {
  return sumOf(txns, 'deposit') - sumOf(txns, 'withdrawal');
}

export function interestGain(txns: Transaction[]): number {
  return sumOf(txns, 'interest');
}

export function balance(txns: Transaction[]): number {
  return principal(txns) + interestGain(txns);
}

export function todayInterest(txns: Transaction[], asOf: string): number {
  return txns
    .filter((txn) => txn.type === 'interest' && txn.occurredAt === asOf)
    .reduce((total, txn) => total + txn.amount, 0);
}
