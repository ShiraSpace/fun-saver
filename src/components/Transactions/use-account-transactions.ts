import { useMemo } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import {
  accountTransactions,
  type TransactionsByAccount,
} from '@/lib/transaction/transactions-by-account';
import {
  balanceHistory,
  type BalanceHistory,
} from '@/lib/wallet/balance-history';

interface AccountTransactionsInput {
  account: AccountSummary;
  transactionsByAccount: TransactionsByAccount;
  asOf: string;
}

interface AccountTransactions {
  transactions: TransactionsByAccount[string];
  balanceHistory: BalanceHistory;
}

export function useAccountTransactions({
  account,
  transactionsByAccount,
  asOf,
}: AccountTransactionsInput): AccountTransactions {
  const transactions = accountTransactions(transactionsByAccount, account.id);
  const { wallets } = account;
  const accountBalanceHistory = useMemo(
    () => balanceHistory({ wallets, transactions, asOf }),
    [wallets, transactions, asOf]
  );

  return { transactions, balanceHistory: accountBalanceHistory };
}
