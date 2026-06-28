import { addDailyInterest, dailyRate, interestForDay } from '../index';
import { DAYS_PER_MONTH } from '@/lib/constants';
import type { Transaction } from '@/lib/types';
import {
  createMockTransaction,
  createMockWallet,
} from '@/test-support/fixtures';

const MONTHLY_RATE = 0.2;
const ACCOUNT_ID = 'a1';
const WALLET_ID = 'w1';
const OPENED_ON = '2026-01-01';
const DEPOSIT_AGOROT = 8000;
const LATER_DEPOSIT_AGOROT = 2000;

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
    const actualDailyRate = dailyRate(MONTHLY_RATE);
    const expectedDailyRate = MONTHLY_RATE / DAYS_PER_MONTH;

    expect(actualDailyRate).toBeCloseTo(expectedDailyRate, 10);
  });

  it('interestForDay rounds the daily interest to the nearest agora', () => {
    const actualInterest = interestForDay(DEPOSIT_AGOROT, MONTHLY_RATE);
    const expectedInterest = Math.round(
      DEPOSIT_AGOROT * (MONTHLY_RATE / DAYS_PER_MONTH)
    );

    expect(actualInterest).toBe(expectedInterest);
  });

  it('interestForDay earns nothing on a zero balance', () => {
    const interestOnZeroBalance = interestForDay(0, MONTHLY_RATE);

    expect(interestOnZeroBalance).toBe(0);
  });

  it('interestForDay earns nothing on a negative balance', () => {
    const interestOnNegativeBalance = interestForDay(-500, MONTHLY_RATE);

    expect(interestOnNegativeBalance).toBe(0);
  });
});

describe('addDailyInterest', () => {
  const savingsWallet = (
    lastInterestDate: string
  ): ReturnType<typeof createMockWallet> =>
    createMockWallet({ monthlyInterestRate: MONTHLY_RATE, lastInterestDate });

  it('compounds one interest txn per day from settled-through+1 through asOf', () => {
    const actualTransactions = addDailyInterest({
      wallet: savingsWallet(OPENED_ON),
      transactions: [deposit(DEPOSIT_AGOROT, OPENED_ON)],
      asOf: '2026-01-03',
      accountId: ACCOUNT_ID,
    });

    const interestDays = actualTransactions.map(
      (transaction) => transaction.occurredAt
    );
    const interestAmounts = actualTransactions.map(
      (transaction) => transaction.amount
    );
    const everyTransactionIsInterest = actualTransactions.every(
      (transaction) => transaction.type === 'interest'
    );

    const firstDayInterest = interestForDay(DEPOSIT_AGOROT, MONTHLY_RATE);
    const secondDayInterest = interestForDay(
      DEPOSIT_AGOROT + firstDayInterest,
      MONTHLY_RATE
    );

    expect(interestDays).toEqual(['2026-01-02', '2026-01-03']);
    expect(interestAmounts).toEqual([firstDayInterest, secondDayInterest]);
    expect(everyTransactionIsInterest).toBe(true);
  });

  it('stamps walletId and accountId on every created transaction', () => {
    const actualTransactions = addDailyInterest({
      wallet: savingsWallet(OPENED_ON),
      transactions: [deposit(DEPOSIT_AGOROT, OPENED_ON)],
      asOf: '2026-01-02',
      accountId: ACCOUNT_ID,
    });

    const [firstInterest] = actualTransactions;

    expect(firstInterest.walletId).toBe(WALLET_ID);
    expect(firstInterest.accountId).toBe(ACCOUNT_ID);
  });

  it('is idempotent — interest already settled through asOf returns nothing', () => {
    const settledTransactions: Transaction[] = [
      deposit(DEPOSIT_AGOROT, OPENED_ON),
      interest(53, '2026-01-02'),
      interest(54, '2026-01-03'),
    ];

    const actualTransactions = addDailyInterest({
      wallet: savingsWallet(OPENED_ON),
      transactions: settledTransactions,
      asOf: '2026-01-03',
      accountId: ACCOUNT_ID,
    });

    expect(actualTransactions).toEqual([]);
  });

  it('treats lastInterestDate as the floor when no interest exists yet', () => {
    const actualTransactions = addDailyInterest({
      wallet: savingsWallet('2026-01-05'),
      transactions: [deposit(DEPOSIT_AGOROT, OPENED_ON)],
      asOf: '2026-01-06',
      accountId: ACCOUNT_ID,
    });

    const interestDays = actualTransactions.map(
      (transaction) => transaction.occurredAt
    );
    const [firstInterest] = actualTransactions;
    const firstDayInterest = interestForDay(DEPOSIT_AGOROT, MONTHLY_RATE);

    expect(interestDays).toEqual(['2026-01-06']);
    expect(firstInterest.amount).toBe(firstDayInterest);
  });

  it('weights by day of deposit — a mid-period deposit earns no interest that day', () => {
    const actualTransactions = addDailyInterest({
      wallet: savingsWallet(OPENED_ON),
      transactions: [
        deposit(DEPOSIT_AGOROT, OPENED_ON),
        deposit(LATER_DEPOSIT_AGOROT, '2026-01-03'),
      ],
      asOf: '2026-01-03',
      accountId: ACCOUNT_ID,
    });

    const [firstInterest, secondInterest] = actualTransactions;
    const firstDayInterest = interestForDay(DEPOSIT_AGOROT, MONTHLY_RATE);
    const secondDayInterest = interestForDay(
      DEPOSIT_AGOROT + firstDayInterest,
      MONTHLY_RATE
    );

    expect(firstInterest.amount).toBe(firstDayInterest);
    expect(secondInterest.amount).toBe(secondDayInterest);
  });

  it('earns nothing on a zero-rate wallet', () => {
    const actualTransactions = addDailyInterest({
      wallet: createMockWallet({ monthlyInterestRate: 0 }),
      transactions: [deposit(DEPOSIT_AGOROT, OPENED_ON)],
      asOf: '2026-01-05',
      accountId: ACCOUNT_ID,
    });

    expect(actualTransactions).toEqual([]);
  });

  it('lets a withdrawal cut later interest to zero', () => {
    const actualTransactions = addDailyInterest({
      wallet: savingsWallet(OPENED_ON),
      transactions: [
        deposit(DEPOSIT_AGOROT, OPENED_ON),
        withdrawal(DEPOSIT_AGOROT, '2026-01-02'),
      ],
      asOf: '2026-01-04',
      accountId: ACCOUNT_ID,
    });

    const interestAmounts = actualTransactions.map(
      (transaction) => transaction.amount
    );
    const firstDayInterest = interestForDay(DEPOSIT_AGOROT, MONTHLY_RATE);

    expect(interestAmounts).toEqual([firstDayInterest]);
  });
});
