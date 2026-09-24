import {
  balanceHistory,
  balanceOverRange,
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

  it('starts a narrow range at the balance carried into it, not at zero', () => {
    const mockLaterDeposit = createMockTransaction({
      id: 'later',
      amount: 100,
      occurredAt: '2026-01-10',
    });
    const history = historyOf(
      [mockOpeningDeposit, mockLaterDeposit],
      '2026-01-10'
    );

    const lastWeek = balanceOverRange(history, 7);
    const openingBalance = lastWeek.totalBalance[0];

    expect(openingBalance).toBe(mockOpeningDeposit.amount);
  });
});
