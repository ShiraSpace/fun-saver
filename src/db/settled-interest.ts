import { TRANSACTION_TYPE } from '@/lib/transaction/constants';
import type { Transaction } from '@/lib/transaction/types';

function interestDay(transaction: Transaction): string | undefined {
  if (transaction.type !== TRANSACTION_TYPE.interest) {
    return undefined;
  }

  return JSON.stringify([
    transaction.accountId,
    transaction.walletId,
    transaction.occurredAt,
  ]);
}

export function withoutInterestAlreadySettled(
  storedTransactions: Transaction[],
  transactions: Transaction[]
): Transaction[] {
  const settledDays = new Set(storedTransactions.map(interestDay));

  return transactions.filter((transaction): boolean => {
    const day = interestDay(transaction);

    if (day === undefined) {
      return true;
    }

    if (settledDays.has(day)) {
      return false;
    }

    settledDays.add(day);
    return true;
  });
}
