import type { Transaction } from '@/lib/types';

export function inOrderOfOccurrence(
  transactions: Transaction[]
): Transaction[] {
  return [...transactions].sort(
    (left, right) =>
      left.occurredAt.localeCompare(right.occurredAt) ||
      left.createdAt.localeCompare(right.createdAt) ||
      left.id.localeCompare(right.id)
  );
}
