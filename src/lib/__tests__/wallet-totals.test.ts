import {
  balance,
  balanceChange,
  interestEarned,
  withdrawn,
  principal,
  interestEarnedToday,
  totalBalance,
  walletShares,
} from '../wallet-totals';
import { TRANSACTION_TYPE } from '@/lib/transaction/constants';
import type { Transaction } from '@/lib/transaction/types';
import { createMockTransaction } from '@/test-utils/mocks/transaction.mocks';

const transaction = (
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

describe('wallet totals', () => {
  const transactions: Transaction[] = [
    transaction(TRANSACTION_TYPE.deposit, 8000, '2026-01-01'),
    transaction(TRANSACTION_TYPE.interest, 53, '2026-01-02'),
    transaction(TRANSACTION_TYPE.withdrawal, 1000, '2026-01-03'),
    transaction(TRANSACTION_TYPE.interest, 47, '2026-01-03'),
  ];

  it('counts a withdrawal against the balance and everything else for it', () => {
    expect(
      balanceChange(transaction(TRANSACTION_TYPE.withdrawal, 200, '2026-01-01'))
    ).toBe(-200);
    expect(
      balanceChange(transaction(TRANSACTION_TYPE.interest, 5, '2026-01-01'))
    ).toBe(5);
  });

  it('balance = deposited - withdrawn + interest earned', () => {
    expect(balance(transactions)).toBe(8000 - 1000 + 53 + 47);
  });

  it('withdrawn = sum of withdrawal transactions', () => {
    expect(withdrawn(transactions)).toBe(1000);
  });

  it('principal = deposited - withdrawn', () => {
    expect(principal(transactions)).toBe(7000);
  });

  it('interestEarned = sum of interest', () => {
    expect(interestEarned(transactions)).toBe(100);
  });

  it('interestEarnedToday = interest dated asOf only', () => {
    expect(interestEarnedToday(transactions, '2026-01-03')).toBe(47);
    expect(interestEarnedToday(transactions, '2026-01-10')).toBe(0);
  });

  it('totalBalance = sum of every wallet balance', () => {
    expect(
      totalBalance([{ balance: 8500 }, { balance: 5000 }, { balance: 2500 }])
    ).toBe(16000);
  });

  it('totalBalance of no wallets is zero', () => {
    expect(totalBalance([])).toBe(0);
  });

  it('walletShares = percentages that sum to 100', () => {
    expect(walletShares([20443, 12500, 3000])).toEqual([57, 35, 8]);
  });

  it('walletShares of empty wallets is all zeros, not NaN', () => {
    expect(walletShares([0, 0, 0])).toEqual([0, 0, 0]);
  });

  it('walletShares breaks a tie so the shares still sum to 100', () => {
    expect(walletShares([1000, 1000, 1000])).toEqual([34, 33, 33]);
  });
});
