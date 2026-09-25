import { balanceHistory } from '../balance-history';
import { TRANSACTION_TYPE } from '@/lib/transaction/constants';
import { eachDayInclusive } from '../dates';
import {
  createMockTransaction,
  mockOpeningDeposit,
} from '@/test-utils/mocks/transaction.mocks';
import { createMockWallets } from '@/test-utils/mocks/general.mocks';

describe('the balance history', () => {
  const mockWallets = createMockWallets();

  it('carries a balance across the days nothing happened', () => {
    const accountBalanceHistory = balanceHistory({
      wallets: mockWallets,
      transactions: [mockOpeningDeposit],
      asOf: '2026-01-03',
    });
    const firstThreeDays = eachDayInclusive('2026-01-01', '2026-01-03');

    expect(accountBalanceHistory.days).toEqual(firstThreeDays);
    expect(accountBalanceHistory.totalBalance).toEqual([500, 500, 500]);
  });

  it('gives the same history whichever order the store returned the transactions in', () => {
    const mockSameDayDeposit = createMockTransaction({
      id: 'deposit',
      amount: 300,
      occurredAt: '2026-01-02',
    });
    const mockSameDayWithdrawal = createMockTransaction({
      id: 'withdrawal',
      type: TRANSACTION_TYPE.withdrawal,
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

    expect(
      balanceHistory({
        wallets: mockWallets,
        transactions: unsortedTransactions,
        asOf: '2026-01-02',
      })
    ).toEqual(
      balanceHistory({
        wallets: mockWallets,
        transactions: sortedTransactions,
        asOf: '2026-01-02',
      })
    );
  });

  it('has no days for an account with no transactions', () => {
    const accountBalanceHistory = balanceHistory({
      wallets: mockWallets,
      transactions: [],
      asOf: '2026-01-03',
    });

    expect(accountBalanceHistory.days).toEqual([]);
    expect(accountBalanceHistory.totalBalance).toEqual([]);
    expect(accountBalanceHistory.wallets).toEqual({
      savings: [],
      spending: [],
      goodDeeds: [],
    });
  });

  it('is one day for an account whose whole history is today', () => {
    const accountBalanceHistory = balanceHistory({
      wallets: mockWallets,
      transactions: [mockOpeningDeposit],
      asOf: mockOpeningDeposit.occurredAt,
    });

    expect(accountBalanceHistory.days).toEqual([mockOpeningDeposit.occurredAt]);
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
        type: TRANSACTION_TYPE.withdrawal,
        amount: 200,
      });
      const accountBalanceHistory = balanceHistory({
        wallets: mockWallets,
        transactions: [mockSpendingDeposit, mockSpendingWithdrawal],
        asOf: '2026-01-01',
      });
      const spendingLeft =
        mockSpendingDeposit.amount - mockSpendingWithdrawal.amount;

      expect(accountBalanceHistory.wallets.spending).toEqual([spendingLeft]);
    });

    describe('when savings and spending each had a deposit', () => {
      const mockSavingsDeposit = createMockTransaction({
        id: 'savings',
        walletId: 'w1',
        amount: 500,
      });
      const accountBalanceHistory = balanceHistory({
        wallets: mockWallets,
        transactions: [mockSavingsDeposit, mockSpendingDeposit],
        asOf: '2026-01-01',
      });

      it('holds only what went into that wallet', () => {
        expect(accountBalanceHistory.wallets.savings).toEqual([
          mockSavingsDeposit.amount,
        ]);
      });

      it('stays at zero for a wallet nothing went into', () => {
        expect(accountBalanceHistory.wallets.goodDeeds).toEqual([0]);
      });

      it('adds the three wallets up to the total balance', () => {
        const { savings, spending, goodDeeds } = accountBalanceHistory.wallets;

        expect(accountBalanceHistory.totalBalance).toEqual([
          savings[0] + spending[0] + goodDeeds[0],
        ]);
      });
    });
  });
});
