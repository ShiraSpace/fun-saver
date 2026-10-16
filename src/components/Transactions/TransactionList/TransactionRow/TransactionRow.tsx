import { JSX } from 'react';
import { dayMonth } from '@/lib/dates';
import type { TransactionListRow } from '@/lib/transaction/transaction-rows';
import { Money } from '@/components/Money';
import { MONEY_ROUNDING } from '@/components/Money/constants';
import { BalanceChange } from '../../BalanceChange';
import { TRANSACTION_LIST_COPY } from '../constants';
import { BalanceColumn, Amounts } from '../transaction-list-parts';
import { TransactionIcon } from './TransactionIcon';
import { TRANSACTION_ROW_COPY, TRANSACTION_ROW_TEST_IDS } from './constants';
import { transactionRowCopy } from './transaction-row-copy';
import {
  ChangeAmount,
  ColumnName,
  Days,
  Name,
  Row,
  TransactionRowDescription,
} from './TransactionRow.styles';

interface TransactionRowProps {
  transactionListRow: TransactionListRow;
}

function transactionRowDays({ interestDays, day }: TransactionListRow): string {
  return interestDays === undefined
    ? dayMonth(day)
    : TRANSACTION_ROW_COPY.interestDays(interestDays);
}

export function TransactionRow({ transactionListRow }: TransactionRowProps): JSX.Element {
  const { type, balanceChange, balance } = transactionListRow;
  const { label } = transactionRowCopy(transactionListRow);
  const days = transactionRowDays(transactionListRow);
  const balanceFell = balanceChange < 0;

  return (
    <Row data-testid={TRANSACTION_ROW_TEST_IDS.row}>
      <TransactionIcon transactionListRow={transactionListRow} />
      <TransactionRowDescription>
        <Name data-transaction-type={type}>{label}</Name>
        <Days>{days}</Days>
      </TransactionRowDescription>
      <Amounts dir="ltr">
        <ChangeAmount data-balance-fell={balanceFell}>
          <ColumnName>{TRANSACTION_LIST_COPY.columns.balanceChange}</ColumnName>
          <BalanceChange
            balanceChange={balanceChange}
            testId={TRANSACTION_ROW_TEST_IDS.balanceChange}
            rounding={MONEY_ROUNDING.toTheAgora}
          />
        </ChangeAmount>
        <BalanceColumn>
          <ColumnName>{TRANSACTION_LIST_COPY.columns.balance}</ColumnName>
          <Money
            amountAgorot={balance}
            testId={TRANSACTION_ROW_TEST_IDS.balance}
            rounding={MONEY_ROUNDING.toTheAgora}
          />
        </BalanceColumn>
      </Amounts>
    </Row>
  );
}
