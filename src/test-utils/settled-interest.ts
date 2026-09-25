import { TRANSACTION_TYPE } from '@/lib/transaction/constants';
import type { Transaction } from '@/lib/transaction/types';

export function interestSettledOn(
  transactions: Transaction[],
  day: string
): Transaction[] {
  return transactions.filter(
    (transaction) =>
      transaction.type === TRANSACTION_TYPE.interest &&
      transaction.occurredAt === day
  );
}
