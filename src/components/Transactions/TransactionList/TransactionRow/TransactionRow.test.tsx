import { render, screen } from '@/test-utils/render';
import {
  createMockWithdrawal,
  mockMonthOfInterest,
} from '@/test-utils/mocks/transaction.mocks';
import { createMockWallets } from '@/test-utils/mocks/wallet.mocks';
import { transactionListRowsFor } from '@/test-utils/transaction-rows';
import { dayMonth } from '@/lib/dates';
import { INTEREST_MODE } from '@/lib/transaction/constants';
import { MONEY_COPY } from '@/components/Money/constants';
import { BALANCE_CHANGE_COPY } from '../../BalanceChange/constants';
import { shekelsText } from '../../money-text';
import { TRANSACTION_LIST_COPY } from '../constants';
import { TRANSACTION_ROW_COPY, TRANSACTION_ROW_TEST_IDS } from './constants';
import { TransactionRow } from './TransactionRow';

describe('a transaction row', () => {
  const [mockDayOfInterest] = mockMonthOfInterest;

  function row(): HTMLElement {
    return screen.getByTestId(TRANSACTION_ROW_TEST_IDS.row);
  }

  function shownText(testId: string): string | null {
    return screen.getByTestId(testId).textContent;
  }

  describe('a day of interest', () => {
    const [mockInterestRow] = transactionListRowsFor(
      [mockDayOfInterest],
      INTEREST_MODE.daily,
      mockDayOfInterest.occurredAt
    );

    beforeEach(() => {
      render(<TransactionRow transactionListRow={mockInterestRow} />);
    });

    it('shows its change in agorot, so it never reads ₪0', () => {
      expect(
        screen.getByTestId(TRANSACTION_ROW_TEST_IDS.balanceChange)
      ).toHaveTextContent(
        `${BALANCE_CHANGE_COPY.rose}${MONEY_COPY.currencySign}${shekelsText(mockInterestRow.balanceChange, true)}`
      );
    });

    it('shows the day it was paid', () => {
      expect(row()).toHaveTextContent(dayMonth(mockInterestRow.day));
    });

    it('names its change for a screen reader', () => {
      expect(row()).toHaveTextContent(
        `${TRANSACTION_LIST_COPY.columns.balanceChange}${shownText(TRANSACTION_ROW_TEST_IDS.balanceChange)}`
      );
    });

    it('names its balance for a screen reader', () => {
      expect(row()).toHaveTextContent(
        `${TRANSACTION_LIST_COPY.columns.balance}${shownText(TRANSACTION_ROW_TEST_IDS.balance)}`
      );
    });
  });

  describe('a month with a single day of interest', () => {
    const mockSingleDayOfInterest = [mockDayOfInterest];
    const [mockMonthlyInterestRow] = transactionListRowsFor(
      mockSingleDayOfInterest,
      INTEREST_MODE.monthly,
      mockDayOfInterest.occurredAt
    );

    beforeEach(() => {
      render(<TransactionRow transactionListRow={mockMonthlyInterestRow} />);
    });

    it('shows how many days it covers, not a date', () => {
      expect(row()).toHaveTextContent(
        TRANSACTION_ROW_COPY.interestDays(mockSingleDayOfInterest.length)
      );
    });
  });

  it.each(createMockWallets())(
    'names a withdrawal from $name by what the money was for',
    (wallet) => {
      const [mockWithdrawalRow] = transactionListRowsFor(
        [createMockWithdrawal(wallet)],
        INTEREST_MODE.monthly,
        mockDayOfInterest.occurredAt
      );
      render(<TransactionRow transactionListRow={mockWithdrawalRow} />);

      expect(row()).toHaveTextContent(
        TRANSACTION_ROW_COPY.withdrawal[wallet.name].label
      );
    }
  );
});
