'use client';

import { JSX } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { Account } from '@/components/Account';
import { AccountManagement } from '@/components/AccountManagement';
import { APP_MODE } from '@/components/AccountManagement/app-mode-context';
import { EmptyState } from '@/components/EmptyState';
import { useAccountNavigation } from '@/hooks/use-account-navigation';
import { AccountsProvider } from './accounts-context';

interface HomeProps {
  accounts: AccountWithDerivedWallets[];
  initialAccountId: string;
}

export function Home({ accounts, initialAccountId }: HomeProps): JSX.Element {
  const navigation = useAccountNavigation(accounts, initialAccountId);
  const { currentAccount, switchAccount, setMode } = navigation;
  const startCreatingAccount = (): void => setMode(APP_MODE.creatingAccount);
  const showsEmptyState = !currentAccount && !navigation.isCreating;

  return (
    <AccountManagement navigation={navigation}>
      {currentAccount && (
        <AccountsProvider value={{ accounts, currentAccount, switchAccount }}>
          <Account account={currentAccount} />
        </AccountsProvider>
      )}
      {showsEmptyState && <EmptyState onCreate={startCreatingAccount} />}
    </AccountManagement>
  );
}
