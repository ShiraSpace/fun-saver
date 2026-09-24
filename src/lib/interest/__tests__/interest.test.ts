import { addDailyInterest, dailyRate, interestForDay } from '../index';
import { DAYS_PER_MONTH, TRANSACTION_TYPE } from '@/lib/constants';
import type { Transaction } from '@/lib/types';
import {
  createMockTransaction,
  createMockWallet,
} from '@/test-utils/mocks/general.mocks';

const mockMonthlyRate = 0.2;
const mockAccountId = 'a1';
const mockWalletId = 'w1';
const mockOpenedOn = '2026-01-01';
const mockDepositAgorot = 8000;
const mockLaterDepositAgorot = 2000;

const deposit = (amount: number, occurredAt: string): Transaction =>
  createMockTransaction({ id: `d-${occurredAt}`, amount, occurredAt });

const withdrawal = (amount: number, occurredAt: string): Transaction =>
  createMockTransaction({
    id: `w-${occurredAt}`,
    type: TRANSACTION_TYPE.withdrawal,
    amount,
    occurredAt,
  });

const interest = (amount: number, occurredAt: string): Transaction =>
  createMockTransaction({
    id: `i-${occurredAt}`,
    type: TRANSACTION_TYPE.interest,
    amount,
    occurredAt,
  });

describe('interest primitives', () => {
  it('dailyRate is monthlyRate / DAYS_PER_MONTH', () => {
    const actualDailyRate = dailyRate(mockMonthlyRate);
    const expectedDailyRate = mockMonthlyRate / DAYS_PER_MONTH;

    expect(actualDailyRate).toBeCloseTo(expectedDailyRate, 10);
  });

  it('interestForDay rounds the daily interest to the nearest agora', () => {
    const actualInterest = interestForDay(mockDepositAgorot, mockMonthlyRate);
    const expectedInterest = Math.round(
      mockDepositAgorot * (mockMonthlyRate / DAYS_PER_MONTH)
    );

    expect(actualInterest).toBe(expectedInterest);
  });

  it('interestForDay earns nothing on a zero balance', () => {
    const interestOnZeroBalance = interestForDay(0, mockMonthlyRate);

    expect(interestOnZeroBalance).toBe(0);
  });

  it('interestForDay earns nothing on a negative balance', () => {
    const interestOnNegativeBalance = interestForDay(-500, mockMonthlyRate);

    expect(interestOnNegativeBalance).toBe(0);
  });
});

describe('addDailyInterest', () => {
  const savingsWallet = (
    lastInterestDate: string
  ): ReturnType<typeof createMockWallet> =>
    createMockWallet({
      monthlyInterestRate: mockMonthlyRate,
      lastInterestDate,
    });

  describe('accruing a single deposit from the settled day through asOf', () => {
    let actualTransactions: Transaction[];

    beforeEach(() => {
      actualTransactions = addDailyInterest({
        wallet: savingsWallet(mockOpenedOn),
        transactions: [deposit(mockDepositAgorot, mockOpenedOn)],
        asOf: '2026-01-03',
        accountId: mockAccountId,
      });
    });

    it('credits one interest transaction per day after the settled day', () => {
      const interestDays = actualTransactions.map(
        (transaction) => transaction.occurredAt
      );

      expect(interestDays).toEqual(['2026-01-02', '2026-01-03']);
    });

    it('compounds each day on the previous closing balance', () => {
      const interestAmounts = actualTransactions.map(
        (transaction) => transaction.amount
      );
      const firstDayInterest = interestForDay(
        mockDepositAgorot,
        mockMonthlyRate
      );
      const secondDayInterest = interestForDay(
        mockDepositAgorot + firstDayInterest,
        mockMonthlyRate
      );

      expect(interestAmounts).toEqual([firstDayInterest, secondDayInterest]);
    });

    it('creates only interest transactions', () => {
      const everyTransactionIsInterest = actualTransactions.every(
        (transaction) => transaction.type === TRANSACTION_TYPE.interest
      );

      expect(everyTransactionIsInterest).toBe(true);
    });
  });

  it('stamps walletId and accountId on every created transaction', () => {
    const actualTransactions = addDailyInterest({
      wallet: savingsWallet(mockOpenedOn),
      transactions: [deposit(mockDepositAgorot, mockOpenedOn)],
      asOf: '2026-01-02',
      accountId: mockAccountId,
    });

    const [firstInterest] = actualTransactions;

    expect(firstInterest.walletId).toBe(mockWalletId);
    expect(firstInterest.accountId).toBe(mockAccountId);
  });

  it('is idempotent — interest already settled through asOf returns nothing', () => {
    const settledTransactions: Transaction[] = [
      deposit(mockDepositAgorot, mockOpenedOn),
      interest(53, '2026-01-02'),
      interest(54, '2026-01-03'),
    ];

    const actualTransactions = addDailyInterest({
      wallet: savingsWallet(mockOpenedOn),
      transactions: settledTransactions,
      asOf: '2026-01-03',
      accountId: mockAccountId,
    });

    expect(actualTransactions).toEqual([]);
  });

  it('treats lastInterestDate as the floor when no interest exists yet', () => {
    const actualTransactions = addDailyInterest({
      wallet: savingsWallet('2026-01-05'),
      transactions: [deposit(mockDepositAgorot, mockOpenedOn)],
      asOf: '2026-01-06',
      accountId: mockAccountId,
    });

    const interestDays = actualTransactions.map(
      (transaction) => transaction.occurredAt
    );
    const [firstInterest] = actualTransactions;
    const firstDayInterest = interestForDay(mockDepositAgorot, mockMonthlyRate);

    expect(interestDays).toEqual(['2026-01-06']);
    expect(firstInterest.amount).toBe(firstDayInterest);
  });

  it('weights by day of deposit — a mid-period deposit earns no interest that day', () => {
    const actualTransactions = addDailyInterest({
      wallet: savingsWallet(mockOpenedOn),
      transactions: [
        deposit(mockDepositAgorot, mockOpenedOn),
        deposit(mockLaterDepositAgorot, '2026-01-03'),
      ],
      asOf: '2026-01-03',
      accountId: mockAccountId,
    });

    const [firstInterest, secondInterest] = actualTransactions;
    const firstDayInterest = interestForDay(mockDepositAgorot, mockMonthlyRate);
    const secondDayInterest = interestForDay(
      mockDepositAgorot + firstDayInterest,
      mockMonthlyRate
    );

    expect(firstInterest.amount).toBe(firstDayInterest);
    expect(secondInterest.amount).toBe(secondDayInterest);
  });

  it('earns nothing on a zero-rate wallet', () => {
    const actualTransactions = addDailyInterest({
      wallet: createMockWallet({ monthlyInterestRate: 0 }),
      transactions: [deposit(mockDepositAgorot, mockOpenedOn)],
      asOf: '2026-01-05',
      accountId: mockAccountId,
    });

    expect(actualTransactions).toEqual([]);
  });

  it('lets a withdrawal cut later interest to zero', () => {
    const actualTransactions = addDailyInterest({
      wallet: savingsWallet(mockOpenedOn),
      transactions: [
        deposit(mockDepositAgorot, mockOpenedOn),
        withdrawal(mockDepositAgorot, '2026-01-02'),
      ],
      asOf: '2026-01-04',
      accountId: mockAccountId,
    });

    const interestAmounts = actualTransactions.map(
      (transaction) => transaction.amount
    );
    const firstDayInterest = interestForDay(mockDepositAgorot, mockMonthlyRate);

    expect(interestAmounts).toEqual([firstDayInterest]);
  });
});
