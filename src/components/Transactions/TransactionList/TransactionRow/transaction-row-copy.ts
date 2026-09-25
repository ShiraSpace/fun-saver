import { TRANSACTION_TYPE } from '@/lib/transaction/constants';
import type { TransactionListRow } from '@/lib/transaction/transaction-rows';
import { TRANSACTION_ROW_COPY } from './constants';

interface TransactionRowCopy {
  label: string;
  badge?: string;
}

export function transactionRowCopy({
  type,
  walletName,
}: TransactionListRow): TransactionRowCopy {
  if (type === TRANSACTION_TYPE.interest) {
    return TRANSACTION_ROW_COPY.interest;
  }

  if (type === TRANSACTION_TYPE.withdrawal && walletName) {
    return TRANSACTION_ROW_COPY.withdrawal[walletName];
  }

  return TRANSACTION_ROW_COPY.deposit;
}
