import { render, screen } from '@/test-utils/render';
import {
  mockMonthOfInterest,
  mockMonthOfInterestLastDay,
  mockOpeningDeposit,
} from '@/test-utils/mocks/transaction.mocks';
import { transactionListRowsFor } from '@/test-utils/transaction-rows';
import { monthLabel } from '@/lib/dates';
import { INTEREST_MODE } from '@/lib/transaction/constants';
import { MONEY_COPY } from '@/components/Money/constants';
import { BALANCE_CHANGE_COPY } from '../../BalanceChange/constants';
import { monthSections } from '@/lib/transaction/transaction-rows';
import { TRANSACTION_MONTH_TEST_IDS } from './constants';
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

  describe('with interest', () => {
    beforeEach(() => {
      render(<TransactionMonth monthSection={mockMonthSection} />);
    });

    it('is named with its year', () => {
      expect(monthName()).toBe(monthLabel(month));
    });

    it('shows the month’s interest beside its name', () => {
      expect(
        screen.getByTestId(TRANSACTION_MONTH_TEST_IDS.interestThisMonth(month))
      ).toHaveTextContent(`${BALANCE_CHANGE_COPY.rose}${MONEY_COPY.currencySign}0.27`);
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
    render(<TransactionMonth monthSection={mockDepositOnlySection} />);

    expect(
      screen.queryByTestId(
        TRANSACTION_MONTH_TEST_IDS.interestThisMonth(mockDepositOnlySection.month)
      )
    ).toBeNull();
  });
});
