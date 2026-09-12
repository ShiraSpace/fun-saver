'use client';

import { JSX } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { AccountSwitcher } from '@/components/AccountSwitcher';
import { CreateAccount } from '@/components/CreateAccount';
import { EditAccount } from '@/components/EditAccount';
import { EmptyState } from '@/components/EmptyState';
import { AccountsProvider } from '@/components/AccountSwitcher/accounts-context';
import { APP_MODE, AppModeProvider } from './app-mode-context';
import { useHomeState } from './use-home-state';
import { Overlay } from './Home.styles';

interface HomeProps {
  accounts: AccountWithDerivedWallets[];
  initialAccountId: string;
}

export function Home({ accounts, initialAccountId }: HomeProps): JSX.Element {
  const home = useHomeState(accounts, initialAccountId);
  const { mode, setMode, selectedAccountId, selectAccount } = home;
  const viewing = (): void => setMode(APP_MODE.viewing);

  return (
    <AppModeProvider value={{ mode, setMode }}>
      <AccountsProvider value={{ accounts, selectedAccountId, selectAccount }}>
        {home.hasAccounts && <AccountSwitcher accounts={accounts} />}
        {!home.hasAccounts && !home.isCreating && (
          <EmptyState onCreate={() => setMode(APP_MODE.creatingAccount)} />
        )}
        {home.isCreating && (
          <Overlay>
            <CreateAccount onCreated={home.handleCreated} onCancel={viewing} />
          </Overlay>
        )}
        {home.editingAccount && (
          <Overlay>
            <EditAccount
              key={home.editingAccount.id}
              account={home.editingAccount}
              onUpdated={home.handleUpdated}
              onCancel={viewing}
            />
          </Overlay>
        )}
      </AccountsProvider>
    </AppModeProvider>
  );
}
