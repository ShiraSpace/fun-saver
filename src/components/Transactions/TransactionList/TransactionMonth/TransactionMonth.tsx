import { JSX } from 'react';
import { monthLabel } from '@/lib/dates';
import type { MonthSection } from '@/lib/transaction/transaction-rows';
import { TRANSACTION_LIST_COPY } from '../constants';
import { BalanceColumn, ChangeColumn } from '../transaction-list-parts';
import { TransactionRow } from '../TransactionRow';
import { TRANSACTION_MONTH_TEST_IDS } from './constants';
import {
  ColumnNames,
  Heading,
  MonthName,
  Rows,
} from './TransactionMonth.styles';

interface TransactionMonthProps {
  monthSection: MonthSection;
  asOf: string;
}

export function TransactionMonth({
  monthSection,
  asOf,
}: TransactionMonthProps): JSX.Element {
  const { month, rows } = monthSection;

  return (
    <section>
      <Heading>
        <MonthName data-testid={TRANSACTION_MONTH_TEST_IDS.monthName(month)}>
          {monthLabel(month, asOf)}
        </MonthName>
        <ColumnNames
          dir="ltr"
          aria-hidden
          data-testid={TRANSACTION_MONTH_TEST_IDS.columnNames(month)}
        >
          <ChangeColumn>
            {TRANSACTION_LIST_COPY.columns.balanceChange}
          </ChangeColumn>
          <BalanceColumn>{TRANSACTION_LIST_COPY.columns.balance}</BalanceColumn>
        </ColumnNames>
      </Heading>
      <Rows>
        {rows.map((transactionListRow) => (
          <TransactionRow
            key={transactionListRow.key}
            transactionListRow={transactionListRow}
          />
        ))}
      </Rows>
    </section>
  );
}
