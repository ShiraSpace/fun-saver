import { JSX } from 'react';
import { redirect } from 'next/navigation';
import { Transactions } from '@/components/Transactions';
import { HOME_ROUTE } from '@/components/Home/constants';
import { getStore } from '@/db';
import { settleInterest } from '@/lib/interest/interest-settlement';
import { transactionsByAccount } from '@/lib/transactions-by-account';
import { today } from '@/lib/clock';
import { findCurrentAccount } from '@/lib/current-account';
import { ThemedPage } from '@/theme/ThemedPage';
import { SignedInUserProvider } from '@/components/Home/signed-in-user-context';
import { signedInAccounts } from '../signed-in-accounts';

export const dynamic = 'force-dynamic';

export default async function TransactionsPage(): Promise<JSX.Element> {
  const { user, accounts, currentAccountId, themeId } =
    await signedInAccounts();
  const asOf = today();

  const settledAccounts = await settleInterest({
    store: getStore(),
    accounts,
    asOf,
  });

  const accountSummaries = settledAccounts.map(
    (settledAccount) => settledAccount.account
  );
  const initialAccount = findCurrentAccount(accountSummaries, currentAccountId);
  const settledTransactionsByAccount = transactionsByAccount(settledAccounts);

  if (!initialAccount) {
    redirect(HOME_ROUTE);
  }

  return (
    <ThemedPage themeId={themeId}>
      <SignedInUserProvider value={user}>
        <Transactions
          accounts={accountSummaries}
          initialAccount={initialAccount}
          transactionsByAccount={settledTransactionsByAccount}
          asOf={asOf}
        />
      </SignedInUserProvider>
    </ThemedPage>
  );
}
