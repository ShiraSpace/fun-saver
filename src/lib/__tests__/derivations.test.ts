import {
  balance,
  interestGain,
  principal,
  todayInterest,
} from '../derivations';
import type { Transaction } from '../types';
import { createMockTransaction } from '@/test-support/fixtures';

const transactionOf = (
  type: Transaction['type'],
  amount: number,
  occurredAt: string
): Transaction =>
  createMockTransaction({
    id: `${type}-${occurredAt}-${amount}`,
    type,
    amount,
    occurredAt,
  });

describe('derivations', () => {
  const transactions: Transaction[] = [
    transactionOf('deposit', 8000, '2026-01-01'),
    transactionOf('interest', 53, '2026-01-02'),
    transactionOf('withdrawal', 1000, '2026-01-03'),
    transactionOf('interest', 47, '2026-01-03'),
  ];

  it('balance = deposits - withdrawals + interest', () => {
    expect(balance(transactions)).toBe(8000 - 1000 + 53 + 47);
  });

  it('principal = deposits - withdrawals', () => {
    expect(principal(transactions)).toBe(7000);
  });

  it('interestGain = sum of interest', () => {
    expect(interestGain(transactions)).toBe(100);
  });

  it('todayInterest = interest dated asOf only', () => {
    expect(todayInterest(transactions, '2026-01-03')).toBe(47);
    expect(todayInterest(transactions, '2026-01-10')).toBe(0);
  });
});
