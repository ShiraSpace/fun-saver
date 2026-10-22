import { JSX } from 'react';
import { monthLabel } from '@/lib/dates';
import type { MonthSection } from '@/lib/transaction/transaction-rows';
import { MONEY_ROUNDING } from '@/components/Money/constants';
import { BalanceChange } from '../../BalanceChange';
import { TRANSACTION_LIST_COPY } from '../constants';
import { BalanceColumn, ChangeColumn } from '../transaction-list-parts';
import { TransactionRow } from '../TransactionRow';
import { TRANSACTION_MONTH_COPY, TRANSACTION_MONTH_TEST_IDS } from './constants';
import {
  ColumnNames,
  Heading,
  InterestThisMonth,
  MonthName,
  MonthNameAndInterest,
  Rows,
} from './TransactionMonth.styles';

interface TransactionMonthProps {
  monthSection: MonthSection;
}

export function TransactionMonth({ monthSection }: TransactionMonthProps): JSX.Element {
  const { month, rows, interestEarned } = monthSection;
  const monthName = monthLabel(month);
  const interestThisMonth =
    interestEarned > 0 ? (
      <InterestThisMonth>
        {TRANSACTION_MONTH_COPY.interestThisMonth}
        <BalanceChange
          balanceChange={interestEarned}
          testId={TRANSACTION_MONTH_TEST_IDS.interestThisMonth(month)}
          rounding={MONEY_ROUNDING.exact}
        />
      </InterestThisMonth>
    ) : null;
  const transactionRows = rows.map((transactionListRow) => (
    <TransactionRow key={transactionListRow.key} transactionListRow={transactionListRow} />
  ));

  return (
    <section>
      <Heading>
        <MonthNameAndInterest>
          <MonthName data-testid={TRANSACTION_MONTH_TEST_IDS.monthName(month)}>
            {monthName}
          </MonthName>
          {interestThisMonth}
        </MonthNameAndInterest>
        <ColumnNames
          dir="ltr"
          aria-hidden
          data-testid={TRANSACTION_MONTH_TEST_IDS.columnNames(month)}
        >
          <ChangeColumn>{TRANSACTION_LIST_COPY.columns.balanceChange}</ChangeColumn>
          <BalanceColumn>{TRANSACTION_LIST_COPY.columns.balance}</BalanceColumn>
        </ColumnNames>
      </Heading>
      <Rows>{transactionRows}</Rows>
    </section>
  );
}
