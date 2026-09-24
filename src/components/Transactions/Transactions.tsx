'use client';

import { JSX, useMemo } from 'react';
import type { AccountSummary, Transaction } from '@/lib/types';
import { balanceHistory } from '@/lib/balance-history';
import { Header } from '@/components/Header';
import { Column, Screen } from '@/components/Screen';
import { AccountManagement } from '@/components/AccountManagement';
import { AccountsProvider } from '@/components/Home/accounts-context';
import { useAccountNavigation } from '@/hooks/use-account-navigation';
import { BalanceOverTime } from './BalanceOverTime';
import { TRANSACTIONS_COPY } from './constants';
import { useTransactionsViewChoices } from './use-transactions-view-choices';

interface TransactionsProps {
  accounts: AccountSummary[];
  initialAccount: AccountSummary;
  transactionsByAccount: Record<
    string,
    Omit<Transaction, 'id' | 'accountId'>[]
  >;
  asOf: string;
}

export function Transactions({
  accounts,
  initialAccount,
  transactionsByAccount,
  asOf,
}: TransactionsProps): JSX.Element {
  const navigation = useAccountNavigation(accounts, initialAccount.id);
  const { switchAccount } = navigation;
  const currentAccount = navigation.currentAccount ?? initialAccount;
  const viewChoices = useTransactionsViewChoices();
  const currentBalanceHistory = useMemo(
    () =>
      balanceHistory({
        wallets: currentAccount.wallets,
        transactions: transactionsByAccount[currentAccount.id] ?? [],
        asOf,
      }),
    [currentAccount, transactionsByAccount, asOf]
  );

  return (
    <AccountManagement navigation={navigation}>
      <AccountsProvider value={{ accounts, currentAccount, switchAccount }}>
        <Screen align="top">
          <Column>
            <Header title={TRANSACTIONS_COPY.title} account={currentAccount} />
            <BalanceOverTime
              balanceHistory={currentBalanceHistory}
              viewChoices={viewChoices}
            />
          </Column>
        </Screen>
      </AccountsProvider>
    </AccountManagement>
  );
}
