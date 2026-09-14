import {
  balance,
  deposits,
  interestGain,
  withdrawals,
  principal,
  todayInterest,
  totalBalance,
  walletShares,
} from '../derivations';
import type { Transaction } from '../types';
import { createMockTransaction } from '@/test-utils/fixtures';

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

  it('deposits = sum of deposit transactions', () => {
    expect(deposits(transactions)).toBe(8000);
  });

  it('withdrawals = sum of withdrawal transactions', () => {
    expect(withdrawals(transactions)).toBe(1000);
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
