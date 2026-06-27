import { addDailyInterest, dailyRate, interestForDay } from '../index';
import { DAYS_PER_MONTH } from '@/lib/constants';
import type { Transaction } from '@/lib/types';
import {
  createMockTransaction,
  createMockWallet,
} from '@/test-support/fixtures';

const deposit = (amount: number, occurredAt: string): Transaction =>
  createMockTransaction({ id: `d-${occurredAt}`, amount, occurredAt });

const withdrawal = (amount: number, occurredAt: string): Transaction =>
  createMockTransaction({
    id: `w-${occurredAt}`,
    type: 'withdrawal',
    amount,
    occurredAt,
  });

const interest = (amount: number, occurredAt: string): Transaction =>
  createMockTransaction({
    id: `i-${occurredAt}`,
    type: 'interest',
    amount,
    occurredAt,
  });

describe('interest primitives', () => {
  it('dailyRate is monthlyRate / DAYS_PER_MONTH', () => {
    expect(dailyRate(0.2)).toBeCloseTo(0.2 / DAYS_PER_MONTH, 10);
  });

  it('interestForDay rounds to the nearest agora, zero on a non-positive balance', () => {
    expect(interestForDay(8000, 0.2)).toBe(Math.round(8000 * (0.2 / 30)));
    expect(interestForDay(0, 0.2)).toBe(0);
    expect(interestForDay(-500, 0.2)).toBe(0);
  });
});

describe('addDailyInterest', () => {
  const savings = (
    lastInterestDate: string
  ): ReturnType<typeof createMockWallet> =>
    createMockWallet({ monthlyInterestRate: 0.2, lastInterestDate });

  it('compounds one interest txn per day from settled-through+1 through asOf', () => {
    const wallet = savings('2026-01-01');
    const actualTransactions = addDailyInterest({
      wallet,
      transactions: [deposit(8000, '2026-01-01')],
      asOf: '2026-01-03',
      accountId: 'a1',
    });

    expect(actualTransactions.map((t) => t.occurredAt)).toEqual([
      '2026-01-02',
      '2026-01-03',
    ]);

    const day1 = interestForDay(8000, 0.2);
    const day2 = interestForDay(8000 + day1, 0.2);

    expect(actualTransactions.map((t) => t.amount)).toEqual([day1, day2]);
    expect(actualTransactions.every((t) => t.type === 'interest')).toBe(true);
  });

  it('stamps walletId and accountId on every created transaction', () => {
    const actualTransactions = addDailyInterest({
      wallet: savings('2026-01-01'),
      transactions: [deposit(8000, '2026-01-01')],
      asOf: '2026-01-02',
      accountId: 'a1',
    });

    expect(actualTransactions[0].walletId).toBe('w1');
    expect(actualTransactions[0].accountId).toBe('a1');
  });

  it('is idempotent — interest already settled through asOf returns nothing', () => {
    const wallet = savings('2026-01-01');
    const settled: Transaction[] = [
      deposit(8000, '2026-01-01'),
      interest(53, '2026-01-02'),
      interest(54, '2026-01-03'),
    ];

    expect(
      addDailyInterest({
        wallet,
        transactions: settled,
        asOf: '2026-01-03',
        accountId: 'a1',
      })
    ).toEqual([]);
  });

  it('treats lastInterestDate as the floor when no interest exists yet', () => {
    const wallet = savings('2026-01-05');
    const actualTransactions = addDailyInterest({
      wallet,
      transactions: [deposit(8000, '2026-01-01')],
      asOf: '2026-01-06',
      accountId: 'a1',
    });

    expect(actualTransactions.map((t) => t.occurredAt)).toEqual(['2026-01-06']);
    expect(actualTransactions[0].amount).toBe(interestForDay(8000, 0.2));
  });

  it('weights by day of deposit — a mid-period deposit earns no interest that day', () => {
    const wallet = savings('2026-01-01');
    const actualTransactions = addDailyInterest({
      wallet,
      transactions: [deposit(8000, '2026-01-01'), deposit(2000, '2026-01-03')],
      asOf: '2026-01-03',
      accountId: 'a1',
    });

    expect(actualTransactions[0].amount).toBe(interestForDay(8000, 0.2));
    expect(actualTransactions[1].amount).toBe(
      interestForDay(8000 + actualTransactions[0].amount, 0.2)
    );
  });

  it('earns nothing on a zero-rate wallet', () => {
    const wallet = createMockWallet({ monthlyInterestRate: 0 });
    expect(
      addDailyInterest({
        wallet,
        transactions: [deposit(5000, '2026-01-01')],
        asOf: '2026-01-05',
        accountId: 'a1',
      })
    ).toEqual([]);
  });

  it('lets a withdrawal cut later interest to zero', () => {
    const wallet = savings('2026-01-01');
    const actualTransactions = addDailyInterest({
      wallet,
      transactions: [
        deposit(8000, '2026-01-01'),
        withdrawal(8000, '2026-01-02'),
      ],
      asOf: '2026-01-04',
      accountId: 'a1',
    });

    expect(actualTransactions.map((t) => t.amount)).toEqual([
      interestForDay(8000, 0.2),
    ]);
  });
});
