import { addDailyInterest, dailyRate, interestForDay } from '../index';
import { DAYS_PER_MONTH } from '@/lib/constants';
import type { Transaction } from '@/lib/types';
import {
  createMockTransaction,
  createMockWallet,
} from '@/test-support/fixtures';

describe('interest', () => {
  const MONTHLY_RATE = 0.2;
  const ACCOUNT_ID = 'a1';
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

  describe('primitives', () => {
    it('dailyRate is monthlyRate / DAYS_PER_MONTH', () => {
      expect(dailyRate(MONTHLY_RATE)).toBeCloseTo(
        MONTHLY_RATE / DAYS_PER_MONTH,
        10
      );
    });

    it('interestForDay rounds the daily interest to the nearest agora', () => {
      expect(interestForDay(DEPOSIT_AGOROT, MONTHLY_RATE)).toBe(
        Math.round(DEPOSIT_AGOROT * (MONTHLY_RATE / DAYS_PER_MONTH))
      );
    });

    it('interestForDay earns nothing on a zero balance', () => {
      expect(interestForDay(0, MONTHLY_RATE)).toBe(0);
    });

    it('interestForDay earns nothing on a negative balance', () => {
      expect(interestForDay(-500, MONTHLY_RATE)).toBe(0);
    });
  });

  describe('addDailyInterest', () => {
    const savings = (
      lastInterestDate: string
    ): ReturnType<typeof createMockWallet> =>
      createMockWallet({ monthlyInterestRate: MONTHLY_RATE, lastInterestDate });

    it('compounds one interest txn per day from settled-through+1 through asOf', () => {
      const wallet = savings(OPENED_ON);
      const actualTransactions = addDailyInterest({
        wallet,
        transactions: [deposit(DEPOSIT_AGOROT, OPENED_ON)],
        asOf: '2026-01-03',
        accountId: ACCOUNT_ID,
      });

      expect(
        actualTransactions.map((transaction) => transaction.occurredAt)
      ).toEqual(['2026-01-02', '2026-01-03']);

      const day1 = interestForDay(DEPOSIT_AGOROT, MONTHLY_RATE);
      const day2 = interestForDay(DEPOSIT_AGOROT + day1, MONTHLY_RATE);

      expect(
        actualTransactions.map((transaction) => transaction.amount)
      ).toEqual([day1, day2]);
      expect(
        actualTransactions.every(
          (transaction) => transaction.type === 'interest'
        )
      ).toBe(true);
    });

    it('stamps walletId and accountId on every created transaction', () => {
      const actualTransactions = addDailyInterest({
        wallet: savings(OPENED_ON),
        transactions: [deposit(DEPOSIT_AGOROT, OPENED_ON)],
        asOf: '2026-01-02',
        accountId: ACCOUNT_ID,
      });

      expect(actualTransactions[0].walletId).toBe('w1');
      expect(actualTransactions[0].accountId).toBe(ACCOUNT_ID);
    });

    it('is idempotent — interest already settled through asOf returns nothing', () => {
      const wallet = savings(OPENED_ON);
      const settled: Transaction[] = [
        deposit(DEPOSIT_AGOROT, OPENED_ON),
        interest(53, '2026-01-02'),
        interest(54, '2026-01-03'),
      ];

      expect(
        addDailyInterest({
          wallet,
          transactions: settled,
          asOf: '2026-01-03',
          accountId: ACCOUNT_ID,
        })
      ).toEqual([]);
    });

    it('treats lastInterestDate as the floor when no interest exists yet', () => {
      const wallet = savings('2026-01-05');
      const actualTransactions = addDailyInterest({
        wallet,
        transactions: [deposit(DEPOSIT_AGOROT, OPENED_ON)],
        asOf: '2026-01-06',
        accountId: ACCOUNT_ID,
      });

      expect(
        actualTransactions.map((transaction) => transaction.occurredAt)
      ).toEqual(['2026-01-06']);
      expect(actualTransactions[0].amount).toBe(
        interestForDay(DEPOSIT_AGOROT, MONTHLY_RATE)
      );
    });

    it('weights by day of deposit — a mid-period deposit earns no interest that day', () => {
      const wallet = savings(OPENED_ON);
      const actualTransactions = addDailyInterest({
        wallet,
        transactions: [
          deposit(DEPOSIT_AGOROT, OPENED_ON),
          deposit(LATER_DEPOSIT_AGOROT, '2026-01-03'),
        ],
        asOf: '2026-01-03',
        accountId: ACCOUNT_ID,
      });

      expect(actualTransactions[0].amount).toBe(
        interestForDay(DEPOSIT_AGOROT, MONTHLY_RATE)
      );
      expect(actualTransactions[1].amount).toBe(
        interestForDay(
          DEPOSIT_AGOROT + actualTransactions[0].amount,
          MONTHLY_RATE
        )
      );
    });

    it('earns nothing on a zero-rate wallet', () => {
      const wallet = createMockWallet({ monthlyInterestRate: 0 });
      expect(
        addDailyInterest({
          wallet,
          transactions: [deposit(DEPOSIT_AGOROT, OPENED_ON)],
          asOf: '2026-01-05',
          accountId: ACCOUNT_ID,
        })
      ).toEqual([]);
    });

    it('lets a withdrawal cut later interest to zero', () => {
      const wallet = savings(OPENED_ON);
      const actualTransactions = addDailyInterest({
        wallet,
        transactions: [
          deposit(DEPOSIT_AGOROT, OPENED_ON),
          withdrawal(DEPOSIT_AGOROT, '2026-01-02'),
        ],
        asOf: '2026-01-04',
        accountId: ACCOUNT_ID,
      });

      expect(
        actualTransactions.map((transaction) => transaction.amount)
      ).toEqual([interestForDay(DEPOSIT_AGOROT, MONTHLY_RATE)]);
    });
  });
});
