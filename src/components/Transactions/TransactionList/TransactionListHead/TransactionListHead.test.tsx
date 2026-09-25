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

describe('the count line', () => {
  it('says one row in words', () => {
    expect(TRANSACTION_LIST_COPY.count(1, 2)).toContain('שורה אחת');
  });

  it('says one day in words', () => {
    expect(TRANSACTION_LIST_COPY.count(2, 1)).toContain('יום אחד');
  });

  it('says several days in the plural', () => {
    expect(TRANSACTION_LIST_COPY.count(2, 3)).toContain('3 ימים');
  });
});
