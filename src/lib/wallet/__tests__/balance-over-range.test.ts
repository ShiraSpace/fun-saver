import {
  balanceHistory,
  balanceOverRange,
  totalBalanceByDay,
  todaysTotalBalance,
  totalBalanceChange,
} from '../balance-history';
import { createMockTransaction, mockOpeningDeposit } from '@/test-utils/mocks/transaction.mocks';
import { createMockWallets } from '@/test-utils/mocks/wallet.mocks';

describe('the balance over a range', () => {
  const mockWallets = createMockWallets();

  describe('an account ten days old, with a second deposit today', () => {
    const mockLaterDeposit = createMockTransaction({
      id: 'later',
      amount: 100,
      occurredAt: '2026-01-10',
    });
    const accountBalanceHistory = balanceHistory({
      wallets: mockWallets,
      transactions: [mockOpeningDeposit, mockLaterDeposit],
      asOf: '2026-01-10',
    });
    const bothDeposits = mockOpeningDeposit.amount + mockLaterDeposit.amount;

    it('starts a narrow range at the balance carried into it, not at zero', () => {
      const lastWeek = balanceOverRange(accountBalanceHistory, 7);
      const openingBalance = lastWeek.totalBalance[0];

      expect(openingBalance).toBe(mockOpeningDeposit.amount);
    });

    it('reports how much the total balance changed across the range', () => {
      expect(totalBalanceChange(accountBalanceHistory, 7)).toBe(mockLaterDeposit.amount);
    });

    it('reads the total balance a day ended on', () => {
      expect(totalBalanceByDay(accountBalanceHistory).get(mockLaterDeposit.occurredAt)).toBe(
        bothDeposits
      );
    });

    it('ends today on both deposits', () => {
      expect(todaysTotalBalance(accountBalanceHistory)).toBe(bothDeposits);
    });
  });

  describe('an account younger than the range', () => {
    describe('five days after its only deposit', () => {
      const accountBalanceHistory = balanceHistory({
        wallets: mockWallets,
        transactions: [mockOpeningDeposit],
        asOf: '2026-01-05',
      });

      it('shows its whole history', () => {
        expect(balanceOverRange(accountBalanceHistory, 7)).toEqual(accountBalanceHistory);
        expect(balanceOverRange(accountBalanceHistory, Infinity)).toEqual(accountBalanceHistory);
      });

      it('counts the deposit as growth, for the week and since the beginning', () => {
        expect(totalBalanceChange(accountBalanceHistory, 7)).toBe(mockOpeningDeposit.amount);
        expect(totalBalanceChange(accountBalanceHistory, Infinity)).toBe(mockOpeningDeposit.amount);
      });
    });

    it('counts every deposit since the account opened', () => {
      const mockSecondDeposit = createMockTransaction({
        id: 'second',
        amount: 100,
        occurredAt: '2026-01-03',
      });
      const accountBalanceHistory = balanceHistory({
        wallets: mockWallets,
        transactions: [mockOpeningDeposit, mockSecondDeposit],
        asOf: '2026-01-05',
      });
      const bothDeposits = mockOpeningDeposit.amount + mockSecondDeposit.amount;

      expect(totalBalanceChange(accountBalanceHistory, 7)).toBe(bothDeposits);
    });
  });

  describe('at the edge of the range', () => {
    it('counts from the day before the range for an account one day older than it', () => {
      const mockSecondDayDeposit = createMockTransaction({
        id: 'second-day',
        amount: 100,
        occurredAt: '2026-01-02',
      });
      const accountBalanceHistory = balanceHistory({
        wallets: mockWallets,
        transactions: [mockOpeningDeposit, mockSecondDayDeposit],
        asOf: '2026-01-08',
      });

      expect(totalBalanceChange(accountBalanceHistory, 7)).toBe(mockSecondDayDeposit.amount);
    });

    it('counts from nothing for an account exactly as old as the range', () => {
      const accountBalanceHistory = balanceHistory({
        wallets: mockWallets,
        transactions: [mockOpeningDeposit],
        asOf: '2026-01-07',
      });

      expect(totalBalanceChange(accountBalanceHistory, 7)).toBe(mockOpeningDeposit.amount);
    });

    it('has no change and no days for an account with no transactions', () => {
      const accountBalanceHistory = balanceHistory({
        wallets: mockWallets,
        transactions: [],
        asOf: '2026-01-07',
      });

      expect(totalBalanceChange(accountBalanceHistory, 7)).toBe(0);
      expect(balanceOverRange(accountBalanceHistory, 7)).toEqual(accountBalanceHistory);
    });
  });

  describe('when the balances have agorot', () => {
    it('counts the agorot savings gained, though its whole shekels did not move', () => {
      const mockOpeningDepositWithAgorot = createMockTransaction({ id: 'opening', amount: 4610 });
      const mockInterest = createMockTransaction({
        id: 'interest',
        amount: 80,
        occurredAt: '2026-01-10',
      });
      const accountBalanceHistory = balanceHistory({
        wallets: mockWallets,
        transactions: [mockOpeningDepositWithAgorot, mockInterest],
        asOf: '2026-01-10',
      });

      expect(totalBalanceChange(accountBalanceHistory, 7)).toBe(mockInterest.amount);
    });

    it('counts the agorot every wallet gained', () => {
      const mockSavingsDeposit = createMockTransaction({ id: 'savings', amount: 4669 });
      const mockSpendingDeposit = createMockTransaction({
        id: 'spending',
        walletId: 'w2',
        amount: 5050,
      });
      const mockLaterSpendingDeposit = createMockTransaction({
        id: 'later-spending',
        walletId: 'w2',
        amount: 30,
        occurredAt: '2026-01-10',
      });
      const accountBalanceHistory = balanceHistory({
        wallets: mockWallets,
        transactions: [mockSavingsDeposit, mockSpendingDeposit, mockLaterSpendingDeposit],
        asOf: '2026-01-10',
      });

      expect(totalBalanceChange(accountBalanceHistory, 7)).toBe(mockLaterSpendingDeposit.amount);
    });
  });
});
