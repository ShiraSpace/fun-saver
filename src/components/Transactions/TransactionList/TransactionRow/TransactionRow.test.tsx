import { render, screen } from '@/test-utils/render';
import {
  createMockWithdrawal,
  mockMonthOfInterest,
  mockMonthOfInterestLastDay,
} from '@/test-utils/mocks/transaction.mocks';
import { createMockWallets } from '@/test-utils/mocks/wallet.mocks';
import { transactionListRowsFor } from '@/test-utils/transaction-rows';
import { dayMonth, dayRange } from '@/lib/dates';
import { INTEREST_MODE } from '@/lib/transaction/constants';
import { MONEY_COPY } from '@/components/Money/constants';
import { BALANCE_CHANGE_COPY } from '../../BalanceChange/constants';
import { TRANSACTION_LIST_COPY } from '../constants';
import { TRANSACTION_ROW_COPY, TRANSACTION_ROW_TEST_IDS } from './constants';
import { TransactionRow } from './TransactionRow';

describe('a transaction row', () => {
  const [mockDayOfInterest] = mockMonthOfInterest;
  const [mockInterestRow] = transactionListRowsFor(
    [mockDayOfInterest],
    INTEREST_MODE.daily,
    mockDayOfInterest.occurredAt
  );

  function row(): HTMLElement {
    return screen.getByTestId(TRANSACTION_ROW_TEST_IDS.row);
  }

  function shownText(testId: string): string | null {
    return screen.getByTestId(testId).textContent;
  }

  describe('a day of interest', () => {
    beforeEach(() => {
      render(<TransactionRow transactionListRow={mockInterestRow} />);
    });

    it('shows a day of interest to the agora', () => {
      expect(screen.getByTestId(TRANSACTION_ROW_TEST_IDS.balanceChange)).toHaveTextContent(
        `${BALANCE_CHANGE_COPY.rose}${MONEY_COPY.currencySign}0.09`
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

  it('shows the date of a single day of interest shown by period', () => {
    const [mockSingleDayRow] = transactionListRowsFor(
      [mockDayOfInterest],
      INTEREST_MODE.byPeriod,
      mockDayOfInterest.occurredAt
    );
    render(<TransactionRow transactionListRow={mockSingleDayRow} />);

    expect(row()).toHaveTextContent(dayMonth(mockSingleDayRow.day));
  });

  it('shows the days and how many there are for interest over several days', () => {
    const [mockPeriodRow] = transactionListRowsFor(
      mockMonthOfInterest,
      INTEREST_MODE.byPeriod,
      mockMonthOfInterestLastDay
    );
    render(<TransactionRow transactionListRow={mockPeriodRow} />);

    expect(row()).toHaveTextContent(
      `${dayRange(mockDayOfInterest.occurredAt, mockMonthOfInterestLastDay)} · ${TRANSACTION_ROW_COPY.interestDays(mockMonthOfInterest.length)}`
    );
  });

  it('shows the balance to the agora', () => {
    render(<TransactionRow transactionListRow={{ ...mockInterestRow, balance: 16060 }} />);

    expect(screen.getByTestId(TRANSACTION_ROW_TEST_IDS.balance)).toHaveTextContent(
      new RegExp(`^${MONEY_COPY.currencySign}160\\.60$`)
    );
  });

  it('shows a change of more than a tenth to the agora too', () => {
    render(<TransactionRow transactionListRow={{ ...mockInterestRow, balanceChange: 1234 }} />);

    expect(screen.getByTestId(TRANSACTION_ROW_TEST_IDS.balanceChange)).toHaveTextContent(
      `${BALANCE_CHANGE_COPY.rose}${MONEY_COPY.currencySign}12.34`
    );
  });

  it.each(createMockWallets())(
    'names a withdrawal from $name by what the money was for',
    (wallet) => {
      const [mockWithdrawalRow] = transactionListRowsFor(
        [createMockWithdrawal(wallet)],
        INTEREST_MODE.byPeriod,
        mockDayOfInterest.occurredAt
      );
      render(<TransactionRow transactionListRow={mockWithdrawalRow} />);

      expect(row()).toHaveTextContent(TRANSACTION_ROW_COPY.withdrawal[wallet.name].label);
    }
  );
});
