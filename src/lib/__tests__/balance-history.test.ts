import {
  balanceHistory,
  balanceOverRange,
  totalBalanceByDay,
  totalBalanceChange,
  type BalanceHistory,
} from '../balance-history';
import { eachDayInclusive } from '../dates';
import type { Transaction } from '../types';
import {
  createMockTransaction,
  createMockWallets,
} from '@/test-utils/fixtures';

describe('the balance history', () => {
  const mockWallets = createMockWallets();
  const mockOpeningDeposit = createMockTransaction({
    id: 'opening',
    amount: 500,
    occurredAt: '2026-01-01',
  });

  const historyOf = (
    transactions: Transaction[],
    asOf: string
  ): BalanceHistory =>
    balanceHistory({ wallets: mockWallets, transactions, asOf });

  it('carries a balance across the days nothing happened', () => {
    const history = historyOf([mockOpeningDeposit], '2026-01-03');
    const firstThreeDays = eachDayInclusive('2026-01-01', '2026-01-03');

    expect(history.days).toEqual(firstThreeDays);
    expect(history.totalBalance).toEqual([500, 500, 500]);
  });

  it('gives the same history whichever order the store returned the transactions in', () => {
    const mockSameDayDeposit = createMockTransaction({
      id: 'deposit',
      amount: 300,
      occurredAt: '2026-01-02',
    });
    const mockSameDayWithdrawal = createMockTransaction({
      id: 'withdrawal',
      type: 'withdrawal',
      amount: 200,
      occurredAt: '2026-01-02',
    });
    const unsortedTransactions = [
      mockSameDayDeposit,
      mockOpeningDeposit,
      mockSameDayWithdrawal,
    ];
    const sortedTransactions = [...unsortedTransactions].sort((a, b) =>
      a.occurredAt.localeCompare(b.occurredAt)
    );

    expect(historyOf(unsortedTransactions, '2026-01-02')).toEqual(
      historyOf(sortedTransactions, '2026-01-02')
    );
  });

  it('has no days for an account with no transactions', () => {
    const history = historyOf([], '2026-01-03');

    expect(history.days).toEqual([]);
    expect(history.totalBalance).toEqual([]);
    expect(history.wallets).toEqual({
      savings: [],
      spending: [],
      goodDeeds: [],
    });
  });

  it('is one day for an account whose whole history is today', () => {
    const history = historyOf(
      [mockOpeningDeposit],
      mockOpeningDeposit.occurredAt
    );

    expect(history.days).toEqual([mockOpeningDeposit.occurredAt]);
  });

  describe('each wallet’s balance', () => {
    const mockSpendingDeposit = createMockTransaction({
      id: 'spending',
      walletId: 'w2',
      amount: 300,
    });

    it('takes a withdrawal off the wallet it came out of', () => {
      const mockSpendingWithdrawal = createMockTransaction({
        id: 'purchase',
        walletId: 'w2',
        type: 'withdrawal',
        amount: 200,
      });
      const history = historyOf(
        [mockSpendingDeposit, mockSpendingWithdrawal],
        '2026-01-01'
      );
      const spendingLeft =
        mockSpendingDeposit.amount - mockSpendingWithdrawal.amount;

      expect(history.wallets.spending).toEqual([spendingLeft]);
    });

    describe('when savings and spending each had a deposit', () => {
      const mockSavingsDeposit = createMockTransaction({
        id: 'savings',
        walletId: 'w1',
        amount: 500,
      });
      const history = historyOf(
        [mockSavingsDeposit, mockSpendingDeposit],
        '2026-01-01'
      );

      it('holds only what went into that wallet', () => {
        expect(history.wallets.savings).toEqual([mockSavingsDeposit.amount]);
      });

      it('stays at zero for a wallet nothing went into', () => {
        expect(history.wallets.goodDeeds).toEqual([0]);
      });

      it('adds the three wallets up to the total balance', () => {
        const { savings, spending, goodDeeds } = history.wallets;

        expect(history.totalBalance).toEqual([
          savings[0] + spending[0] + goodDeeds[0],
        ]);
      });
    });
  });

  describe('an account ten days old, with a second deposit today', () => {
    const mockLaterDeposit = createMockTransaction({
      id: 'later',
      amount: 100,
      occurredAt: '2026-01-10',
    });
    const history = historyOf(
      [mockOpeningDeposit, mockLaterDeposit],
      '2026-01-10'
    );

    it('starts a narrow range at the balance carried into it, not at zero', () => {
      const lastWeek = balanceOverRange(history, 7);
      const openingBalance = lastWeek.totalBalance[0];

      expect(openingBalance).toBe(mockOpeningDeposit.amount);
    });

    it('reports how much the total balance changed across the range', () => {
      expect(totalBalanceChange(history, 7)).toBe(mockLaterDeposit.amount);
    });

    it('reads the total balance a day ended on', () => {
      const bothDeposits = mockOpeningDeposit.amount + mockLaterDeposit.amount;

      expect(totalBalanceByDay(history).get(mockLaterDeposit.occurredAt)).toBe(
        bothDeposits
      );
    });
  });

  describe('an account younger than the range', () => {
    describe('five days after its only deposit', () => {
      const history = historyOf([mockOpeningDeposit], '2026-01-05');

      it('shows its whole history', () => {
        expect(balanceOverRange(history, 7)).toEqual(history);
        expect(balanceOverRange(history, Infinity)).toEqual(history);
      });

      it('counts the deposit as growth, for the week and since the beginning', () => {
        expect(totalBalanceChange(history, 7)).toBe(mockOpeningDeposit.amount);
        expect(totalBalanceChange(history, Infinity)).toBe(
          mockOpeningDeposit.amount
        );
      });
    });

    it('counts every deposit since the account opened', () => {
      const mockSecondDeposit = createMockTransaction({
        id: 'second',
        amount: 100,
        occurredAt: '2026-01-03',
      });
      const history = historyOf(
        [mockOpeningDeposit, mockSecondDeposit],
        '2026-01-05'
      );
      const bothDeposits = mockOpeningDeposit.amount + mockSecondDeposit.amount;

      expect(totalBalanceChange(history, 7)).toBe(bothDeposits);
    });
  });
});
