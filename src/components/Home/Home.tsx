'use client';

import { JSX } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { Account } from '@/components/Account';
import { CreateAccount } from '@/components/CreateAccount';
import { EditAccount } from '@/components/EditAccount';
import { EmptyState } from '@/components/EmptyState';
import { AccountsProvider } from './accounts-context';
import { APP_MODE, AppModeProvider } from './app-mode-context';
import { useHomeNavigation } from './use-home-navigation';
import { Overlay } from './Home.styles';

interface HomeProps {
  accounts: AccountWithDerivedWallets[];
  initialAccountId: string;
}

export function Home({ accounts, initialAccountId }: HomeProps): JSX.Element {
  const navigation = useHomeNavigation(accounts, initialAccountId);
  const { mode, setMode, currentAccount, selectAccount, cancel } = navigation;
  const startCreating = (): void => setMode(APP_MODE.creatingAccount);
  const showsEmptyState = !currentAccount && !navigation.isCreating;

  return (
    <AppModeProvider value={{ mode, setMode }}>
      {currentAccount && (
        <AccountsProvider value={{ accounts, currentAccount, selectAccount }}>
          <Account account={currentAccount} />
        </AccountsProvider>
      )}
      {showsEmptyState && <EmptyState onCreate={startCreating} />}
      {navigation.isCreating && (
        <Overlay>
          <CreateAccount
            onCreated={navigation.showNewAccount}
            onCancel={cancel}
          />
        </Overlay>
      )}
      {navigation.editingAccount && (
        <Overlay>
          <EditAccount
            key={navigation.editingAccount.id}
            account={navigation.editingAccount}
            onUpdated={navigation.finishEditing}
            onCancel={cancel}
          />
        </Overlay>
      )}
    </AppModeProvider>
  );
}
