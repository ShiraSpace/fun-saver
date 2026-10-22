import { render, screen } from '@/test-utils/render';
import {
  mockMonthOfInterest,
  mockMonthOfInterestLastDay,
  mockOpeningDeposit,
} from '@/test-utils/mocks/transaction.mocks';
import { transactionListRowsFor } from '@/test-utils/transaction-rows';
import { addDays, monthLabel } from '@/lib/dates';
import { INTEREST_MODE } from '@/lib/transaction/constants';
import { MONEY_COPY } from '@/components/Money/constants';
import { BALANCE_CHANGE_COPY } from '../../BalanceChange/constants';
import { monthSections } from '@/lib/transaction/transaction-rows';
import { TRANSACTION_MONTH_COPY, TRANSACTION_MONTH_TEST_IDS } from './constants';
import { TransactionMonth } from './TransactionMonth';

describe('a month of the transaction list', () => {
  const [mockMonthSection] = monthSections(
    transactionListRowsFor(mockMonthOfInterest, INTEREST_MODE.byPeriod, mockMonthOfInterestLastDay),
    mockMonthOfInterest
  );
  const { month } = mockMonthSection;

  function monthName(): string | null {
    return screen.getByTestId(TRANSACTION_MONTH_TEST_IDS.monthName(month)).textContent;
  }

  describe('this year', () => {
    beforeEach(() => {
      render(
        <TransactionMonth monthSection={mockMonthSection} asOf={mockMonthOfInterestLastDay} />
      );
    });

    it('is named without the year', () => {
      expect(monthName()).toBe(monthLabel(month, mockMonthOfInterestLastDay));
    });

    it('shows the month’s interest beside its name', () => {
      expect(screen.getByText(TRANSACTION_MONTH_COPY.interestThisMonth)).toHaveTextContent(
        `${BALANCE_CHANGE_COPY.rose}${MONEY_COPY.currencySign}0.27`
      );
    });

    it('keeps the column names out of what a screen reader reads', () => {
      expect(screen.getByTestId(TRANSACTION_MONTH_TEST_IDS.columnNames(month))).toHaveAttribute(
        'aria-hidden',
        'true'
      );
    });
  });

  it('shows no interest for a month without any', () => {
    const [mockDepositOnlySection] = monthSections(
      transactionListRowsFor(
        [mockOpeningDeposit],
        INTEREST_MODE.byPeriod,
        mockOpeningDeposit.occurredAt
      ),
      [mockOpeningDeposit]
    );
    render(
      <TransactionMonth
        monthSection={mockDepositOnlySection}
        asOf={mockOpeningDeposit.occurredAt}
      />
    );

    expect(screen.queryByText(TRANSACTION_MONTH_COPY.interestThisMonth)).toBeNull();
  });

  describe('a year ago', () => {
    it('is named with its year', () => {
      const mockAYearLater = addDays(mockMonthOfInterestLastDay, 366);
      render(<TransactionMonth monthSection={mockMonthSection} asOf={mockAYearLater} />);

      expect(monthName()).toBe(monthLabel(month, mockAYearLater));
    });
  });
});
