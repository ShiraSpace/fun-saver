import { render, screen } from '@/test-utils/render';
import {
  mockMonthOfInterest,
  mockMonthOfInterestLastDay,
} from '@/test-utils/mocks/transaction.mocks';
import { transactionListRowsFor } from '@/test-utils/transaction-rows';
import { addDays, monthLabel } from '@/lib/dates';
import { INTEREST_MODE } from '@/lib/transaction/constants';
import { monthSections } from '@/lib/transaction/transaction-rows';
import { TRANSACTION_MONTH_TEST_IDS } from './constants';
import { TransactionMonth } from './TransactionMonth';

describe('a month of the transaction list', () => {
  const [mockMonthSection] = monthSections(
    transactionListRowsFor(
      mockMonthOfInterest,
      INTEREST_MODE.monthly,
      mockMonthOfInterestLastDay
    )
  );
  const { month } = mockMonthSection;

  function monthName(): string | null {
    return screen.getByTestId(TRANSACTION_MONTH_TEST_IDS.monthName(month))
      .textContent;
  }

  describe('this year', () => {
    beforeEach(() => {
      render(
        <TransactionMonth
          monthSection={mockMonthSection}
          asOf={mockMonthOfInterestLastDay}
        />
      );
    });

    it('is named without the year', () => {
      expect(monthName()).toBe(monthLabel(month, mockMonthOfInterestLastDay));
    });

    it('keeps the column names out of what a screen reader reads', () => {
      expect(
        screen.getByTestId(TRANSACTION_MONTH_TEST_IDS.columnNames(month))
      ).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('a year ago', () => {
    it('is named with its year', () => {
      const mockAYearLater = addDays(mockMonthOfInterestLastDay, 366);
      render(
        <TransactionMonth
          monthSection={mockMonthSection}
          asOf={mockAYearLater}
        />
      );

      expect(monthName()).toBe(monthLabel(month, mockAYearLater));
    });
  });
});
