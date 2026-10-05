'use client';

import { JSX } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import { AccountManagement } from '@/components/AccountManagement';
import { APP_MODE } from '@/components/AccountManagement/app-mode-context';
import { EmptyState } from '@/components/EmptyState';
import { useAccountNavigation } from '@/hooks/use-account-navigation';
import { AccountsProvider } from './accounts-context';
import { ShownAccount } from './ShownAccount';

interface HomeProps {
  accounts: AccountSummary[];
  initialAccountId: string;
}

export function Home({ accounts, initialAccountId }: HomeProps): JSX.Element {
  const navigation = useAccountNavigation(accounts, initialAccountId);
  const { currentAccount, switchAccount, setMode } = navigation;
  const startCreatingAccount = (): void => setMode(APP_MODE.creatingAccount);
  const showsEmptyState = !currentAccount && !navigation.isCreating;
  const accountsContext = currentAccount && {
    accounts,
    currentAccount,
    switchAccount,
  };

  return (
    <AccountManagement navigation={navigation}>
      {accountsContext && (
        <AccountsProvider value={accountsContext}>
          <ShownAccount account={accountsContext.currentAccount} />
        </AccountsProvider>
      )}
      {showsEmptyState && <EmptyState onCreate={startCreatingAccount} />}
    </AccountManagement>
  );
}
