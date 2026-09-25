'use client';

import { JSX } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import type { TransactionsByAccount } from '@/lib/transaction/transactions-by-account';
import { Header } from '@/components/Header';
import { Column, Screen } from '@/components/Screen';
import { AccountManagement } from '@/components/AccountManagement';
import { AccountsProvider } from '@/components/Home/accounts-context';
import { useAccountNavigation } from '@/hooks/use-account-navigation';
import { BalanceOverTime } from './BalanceOverTime';
import { TransactionList } from './TransactionList';
import { TRANSACTIONS_COPY } from './constants';
import { useBalanceHistory } from './use-balance-history';
import { useTransactionsViewChoices } from './use-transactions-view-choices';

interface TransactionsProps {
  accounts: AccountSummary[];
  initialAccount: AccountSummary;
  transactionsByAccount: TransactionsByAccount;
  asOf: string;
}

export function Transactions({
  accounts,
  initialAccount,
  transactionsByAccount,
  asOf,
}: TransactionsProps): JSX.Element {
  const navigation = useAccountNavigation(accounts, initialAccount.id);
  const viewChoices = useTransactionsViewChoices();

  const { switchAccount } = navigation;
  const currentAccount = navigation.currentAccount ?? initialAccount;
  const accountsContext = { accounts, currentAccount, switchAccount };

  const currentTransactions = transactionsByAccount[currentAccount.id] ?? [];
  const currentBalanceHistory = useBalanceHistory({
    wallets: currentAccount.wallets,
    transactions: currentTransactions,
    asOf,
  });

  return (
    <AccountManagement navigation={navigation}>
      <AccountsProvider value={accountsContext}>
        <Screen align="top">
          <Column>
            <Header title={TRANSACTIONS_COPY.title} account={currentAccount} />
            <BalanceOverTime
              balanceHistory={currentBalanceHistory}
              viewChoices={viewChoices}
            />
            <TransactionList
              transactions={currentTransactions}
              wallets={currentAccount.wallets}
              balanceHistory={currentBalanceHistory}
              asOf={asOf}
              viewChoices={viewChoices}
            />
          </Column>
        </Screen>
      </AccountsProvider>
    </AccountManagement>
  );
}
