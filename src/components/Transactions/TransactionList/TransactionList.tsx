'use client';

import { JSX, useMemo } from 'react';
import {
  filterByTransactionType,
  monthSections,
  transactionListRows,
  type MonthSection,
  type TransactionListRowsInput,
} from '@/lib/transaction/transaction-rows';
import { CHOICE_CHIPS_VARIANT, ChoiceChips } from '../ChoiceChips';
import type { TransactionsViewChoices } from '../use-transactions-view-choices';
import { TransactionMonth } from './TransactionMonth';
import {
  INTEREST_MODES,
  TRANSACTION_LIST_COPY,
  TRANSACTION_LIST_INTEREST_GROUP_NAME,
  TRANSACTION_LIST_TEST_IDS,
  TRANSACTION_LIST_TYPE_GROUP_NAME,
  TRANSACTION_TYPE_FILTERS,
} from './constants';
import {
  Card,
  Count,
  Head,
  EmptyMessage,
  SubTitle,
  Title,
  TitleRow,
} from './TransactionList.styles';

interface TransactionListProps extends Omit<
  TransactionListRowsInput,
  'interestMode'
> {
  asOf: string;
  viewChoices: TransactionsViewChoices;
}

interface TransactionListMonthsProps {
  hasTransactions: boolean;
  sections: MonthSection[];
  asOf: string;
}

function TransactionListMonths({
  hasTransactions,
  sections,
  asOf,
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
    <TransactionMonth
      key={monthSection.month}
      monthSection={monthSection}
      asOf={asOf}
    />
  ));

  return <>{months}</>;
}

interface TransactionListHeadProps {
  rowCount: number;
  dayCount: number;
  viewChoices: TransactionsViewChoices;
}

function TransactionListHead({
  rowCount,
  dayCount,
  viewChoices,
}: TransactionListHeadProps): JSX.Element {
  const countText = TRANSACTION_LIST_COPY.count(rowCount, dayCount);

  return (
    <Head>
      <TitleRow>
        <Title>{TRANSACTION_LIST_COPY.title}</Title>
        <Count data-testid={TRANSACTION_LIST_TEST_IDS.count}>{countText}</Count>
      </TitleRow>
      <ChoiceChips
        groupName={TRANSACTION_LIST_TYPE_GROUP_NAME}
        legend={TRANSACTION_LIST_COPY.filterLegend}
        choices={TRANSACTION_TYPE_FILTERS}
        selected={viewChoices.transactionTypeFilter}
        onSelect={viewChoices.setTransactionTypeFilter}
        testId={TRANSACTION_LIST_TEST_IDS.filters}
      />
      <SubTitle
        aria-hidden
        data-testid={TRANSACTION_LIST_TEST_IDS.interestTitle}
      >
        {TRANSACTION_LIST_COPY.interestTitle}
      </SubTitle>
      <ChoiceChips
        variant={CHOICE_CHIPS_VARIANT.segmented}
        groupName={TRANSACTION_LIST_INTEREST_GROUP_NAME}
        legend={TRANSACTION_LIST_COPY.interestTitle}
        choices={INTEREST_MODES}
        selected={viewChoices.interestMode}
        onSelect={viewChoices.setInterestMode}
        testId={TRANSACTION_LIST_TEST_IDS.interestMode}
      />
    </Head>
  );
}

export function TransactionList({
  transactions,
  wallets,
  balanceHistory,
  asOf,
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
  const shownRows = filterByTransactionType(
    rows,
    viewChoices.transactionTypeFilter
  );
  const hasTransactions = transactions.length > 0;
  const sections = monthSections(shownRows);

  return (
    <Card data-testid={TRANSACTION_LIST_TEST_IDS.list}>
      <TransactionListHead
        rowCount={shownRows.length}
        dayCount={balanceHistory.days.length}
        viewChoices={viewChoices}
      />
      <TransactionListMonths
        hasTransactions={hasTransactions}
        sections={sections}
        asOf={asOf}
      />
    </Card>
  );
}
