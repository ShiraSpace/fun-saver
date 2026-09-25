import { JSX } from 'react';
import { fireEvent, render, screen } from '@/test-utils/render';
import {
  mockBusyDay,
  mockBusyDayTransactions,
  mockMonthOfInterest,
  mockMonthOfInterestLastDay,
  mockOpeningDeposit,
  mockWalletDeposits,
} from '@/test-utils/mocks/transaction.mocks';
import { createMockWallets } from '@/test-utils/mocks/wallet.mocks';
import { balanceHistoryFor } from '@/test-utils/transaction-rows';
import { INTEREST_MODE, TRANSACTION_TYPE } from '@/lib/transaction/constants';
import type { Transaction } from '@/lib/transaction/types';
import { CHOICE_CHIPS_TEST_IDS } from '../ChoiceChips/constants';
import { useTransactionsViewChoices } from '../use-transactions-view-choices';
import { TRANSACTION_ROW_TEST_IDS } from './TransactionRow/constants';
import { EMPTY_STATE_TEST_IDS } from '@/components/EmptyState/constants';
import { TRANSACTION_LIST_COPY, TRANSACTION_LIST_TEST_IDS } from './constants';
import { TransactionList } from './TransactionList';

describe('the transaction list', () => {
  interface TransactionListOnScreenProps {
    transactions: Transaction[];
    asOf: string;
  }

  function TransactionListOnScreen({
    transactions,
    asOf,
  }: TransactionListOnScreenProps): JSX.Element {
    return (
      <TransactionList
        transactions={transactions}
        wallets={createMockWallets()}
        balanceHistory={balanceHistoryFor(transactions, asOf)}
        asOf={asOf}
        viewChoices={useTransactionsViewChoices()}
      />
    );
  }

  function listedRows(): HTMLElement[] {
    return screen.getAllByTestId(TRANSACTION_ROW_TEST_IDS.row);
  }

  function choose(groupTestId: string, choiceId: string): void {
    fireEvent.click(
      screen.getByTestId(CHOICE_CHIPS_TEST_IDS.option(groupTestId, choiceId))
    );
  }

  describe('a deposit that lands in three wallets', () => {
    beforeEach(() => {
      render(
        <TransactionListOnScreen
          transactions={mockWalletDeposits}
          asOf={mockWalletDeposits[0].occurredAt}
        />
      );
    });

    it('shows it once, as the parent made it, not once per wallet', () => {
      expect(listedRows()).toHaveLength(1);
    });
  });

  describe('a month of interest', () => {
    beforeEach(() => {
      render(
        <TransactionListOnScreen
          transactions={mockMonthOfInterest}
          asOf={mockMonthOfInterestLastDay}
        />
      );
    });

    it('rolls the month into one row', () => {
      expect(listedRows()).toHaveLength(1);
    });

    describe('when the parent asks for every day', () => {
      beforeEach(() => {
        choose(TRANSACTION_LIST_TEST_IDS.interestMode, INTEREST_MODE.daily);
      });

      it('lists each day of interest on its own row', () => {
        expect(listedRows()).toHaveLength(mockMonthOfInterest.length);
      });
    });
  });

  describe('a busy day, shown only as its withdrawals', () => {
    beforeEach(() => {
      render(
        <TransactionListOnScreen
          transactions={mockBusyDayTransactions}
          asOf={mockBusyDay}
        />
      );
      choose(TRANSACTION_LIST_TEST_IDS.filters, TRANSACTION_TYPE.withdrawal);
    });

    it('counts only the rows it shows, over the whole history', () => {
      const mockBusyDayWithdrawalCount = 1;
      const historyDays = balanceHistoryFor(
        mockBusyDayTransactions,
        mockBusyDay
      ).days.length;

      expect(
        screen.getByTestId(TRANSACTION_LIST_TEST_IDS.count)
      ).toHaveTextContent(
        TRANSACTION_LIST_COPY.count(mockBusyDayWithdrawalCount, historyDays)
      );
    });
  });

  describe('the count line', () => {
    it('says one row in words', () => {
      expect(TRANSACTION_LIST_COPY.count(1, 2)).toContain('שורה אחת');
    });

    it('says one day in words', () => {
      expect(TRANSACTION_LIST_COPY.count(2, 1)).toContain('יום אחד');
    });
  });

  describe('deposits only, filtered to withdrawals', () => {
    beforeEach(() => {
      render(
        <TransactionListOnScreen
          transactions={mockWalletDeposits}
          asOf={mockWalletDeposits[0].occurredAt}
        />
      );
      choose(TRANSACTION_LIST_TEST_IDS.filters, TRANSACTION_TYPE.withdrawal);
    });

    it('says nothing matches, instead of showing a blank card', () => {
      expect(
        screen.getByTestId(TRANSACTION_LIST_TEST_IDS.emptyFilter)
      ).toHaveTextContent(TRANSACTION_LIST_COPY.emptyFilter);
    });
  });

  describe('a child with no transactions yet', () => {
    beforeEach(() => {
      render(
        <TransactionListOnScreen
          transactions={[]}
          asOf={mockOpeningDeposit.occurredAt}
        />
      );
    });

    it('says what the list will hold once there is some', () => {
      expect(
        screen.getByTestId(TRANSACTION_LIST_TEST_IDS.noTransactions)
      ).toHaveTextContent(TRANSACTION_LIST_COPY.noTransactions);
    });

    it('does not offer to create an account, since this one exists', () => {
      expect(
        screen.queryByTestId(EMPTY_STATE_TEST_IDS.container)
      ).not.toBeInTheDocument();
    });
  });
});
