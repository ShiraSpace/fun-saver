'use client';

import { JSX } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import { Account } from '@/components/Account';
import { ChildAccount } from '@/components/ChildAccount';
import { AccountManagement } from '@/components/AccountManagement';
import { APP_MODE } from '@/components/AccountManagement/app-mode-context';
import { EmptyState } from '@/components/EmptyState';
import { isChildView } from '@/lib/account/view-mode';
import { useAccountNavigation } from '@/hooks/use-account-navigation';
import { AccountsProvider } from './accounts-context';
import { useShownViewMode } from './use-shown-view-mode';

interface HomeProps {
  accounts: AccountSummary[];
  initialAccountId: string;
}

export function Home({ accounts, initialAccountId }: HomeProps): JSX.Element {
  const navigation = useAccountNavigation(accounts, initialAccountId);
  const { switchAccount, setMode } = navigation;
  const { shownAccount: currentAccount, viewModeChoice } = useShownViewMode(
    navigation.currentAccount
  );
  const startCreatingAccount = (): void => setMode(APP_MODE.creatingAccount);
  const showsEmptyState = !currentAccount && !navigation.isCreating;

  return (
    <AccountManagement navigation={navigation}>
      {currentAccount && (
        <AccountsProvider
          value={{ accounts, currentAccount, switchAccount, viewModeChoice }}
        >
          {isChildView(currentAccount) ? (
            <ChildAccount account={currentAccount} />
          ) : (
            <Account account={currentAccount} />
          )}
        </AccountsProvider>
      )}
      {showsEmptyState && <EmptyState onCreate={startCreatingAccount} />}
    </AccountManagement>
  );
}
