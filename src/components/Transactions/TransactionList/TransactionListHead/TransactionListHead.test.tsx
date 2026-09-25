import { JSX } from 'react';
import { render, screen } from '@/test-utils/render';
import { useTransactionsViewChoices } from '../../use-transactions-view-choices';
import { TRANSACTION_LIST_COPY, TRANSACTION_LIST_TEST_IDS } from '../constants';
import { TransactionListHead } from './TransactionListHead';

describe('the head of the transaction list', () => {
  const mockRowCount = 2;
  const mockDayCount = 5;

  function TransactionListHeadOnScreen(): JSX.Element {
    return (
      <TransactionListHead
        rowCount={mockRowCount}
        dayCount={mockDayCount}
        viewChoices={useTransactionsViewChoices()}
      />
    );
  }

  beforeEach(() => {
    render(<TransactionListHeadOnScreen />);
  });

  it('counts the rows and the days it covers', () => {
    expect(
      screen.getByTestId(TRANSACTION_LIST_TEST_IDS.count)
    ).toHaveTextContent(
      TRANSACTION_LIST_COPY.count(mockRowCount, mockDayCount)
    );
  });

  it('names the interest choice once for a screen reader, not twice', () => {
    expect(
      screen.getByTestId(TRANSACTION_LIST_TEST_IDS.interestTitle)
    ).toHaveAttribute('aria-hidden', 'true');
  });
});
