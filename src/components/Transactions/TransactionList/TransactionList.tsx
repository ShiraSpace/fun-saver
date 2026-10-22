'use client';

import { JSX, useMemo } from 'react';
import {
  filterByTransactionType,
  monthSections,
  transactionListRows,
  type MonthSection,
  type TransactionListRowsInput,
} from '@/lib/transaction/transaction-rows';
import type { TransactionsViewChoices } from '../use-transactions-view-choices';
import { TransactionListHead } from './TransactionListHead';
import { TransactionMonth } from './TransactionMonth';
import { TRANSACTION_LIST_COPY, TRANSACTION_LIST_TEST_IDS } from './constants';
import { Card, EmptyMessage } from './TransactionList.styles';

interface TransactionListProps extends Omit<TransactionListRowsInput, 'interestMode'> {
  viewChoices: TransactionsViewChoices;
}

interface TransactionListMonthsProps {
  hasTransactions: boolean;
  sections: MonthSection[];
}

function TransactionListMonths({
  hasTransactions,
  sections,
}: TransactionListMonthsProps): JSX.Element {
  if (!hasTransactions) {
    return (
      <EmptyMessage data-testid={TRANSACTION_LIST_TEST_IDS.noTransactions}>
        {TRANSACTION_LIST_COPY.noTransactions}
      </EmptyMessage>
    );
  }

  if (sections.length === 0) {
    return (
      <EmptyMessage data-testid={TRANSACTION_LIST_TEST_IDS.emptyFilter}>
        {TRANSACTION_LIST_COPY.emptyFilter}
      </EmptyMessage>
    );
  }

  const months = sections.map((monthSection) => (
    <TransactionMonth key={monthSection.month} monthSection={monthSection} />
  ));

  return <>{months}</>;
}

export function TransactionList({
  transactions,
  wallets,
  balanceHistory,
  viewChoices,
}: TransactionListProps): JSX.Element {
  const { interestMode } = viewChoices;
  const rows = useMemo(
    () =>
      transactionListRows({
        transactions,
        wallets,
        balanceHistory,
        interestMode,
      }),
    [transactions, wallets, balanceHistory, interestMode]
  );
  const shownRows = filterByTransactionType(rows, viewChoices.transactionTypeFilter);
  const hasTransactions = transactions.length > 0;
  const sections = monthSections(shownRows, transactions);

  return (
    <Card data-testid={TRANSACTION_LIST_TEST_IDS.list}>
      <TransactionListHead
        rowCount={shownRows.length}
        dayCount={balanceHistory.days.length}
        viewChoices={viewChoices}
      />
      <TransactionListMonths hasTransactions={hasTransactions} sections={sections} />
    </Card>
  );
}
