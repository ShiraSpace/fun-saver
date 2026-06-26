'use client';

import { JSX, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import type { Account } from '@/lib/types';
import {
  AccountSwitcher,
  type AccountView,
} from '@/components/AccountSwitcher';
import { CreateAccount } from '@/components/CreateAccount';
import { EmptyState } from '@/components/EmptyState';
import { AccountsProvider } from '@/components/AccountSwitcher/accounts-context';
import { LAYERS } from '@/theme/layers';
import { APP_MODE, AppMode, AppModeProvider } from './app-mode-context';
import { persistSelectedAccount } from './selected-account-cookie';

const CreateOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${LAYERS.modal};
  overflow-y: auto;
`;

interface HomeProps {
  views: AccountView[];
  initialAccountId: string;
}

export function Home({ views, initialAccountId }: HomeProps): JSX.Element {
  const router = useRouter();
  const accounts = views.map((view) => view.account);

  const [mode, setMode] = useState<AppMode>(APP_MODE.viewing);
  const [selectedAccountId, setSelectedAccountId] = useState(initialAccountId);

  const isCreating = mode === APP_MODE.creatingAccount;

  const selectAccount = (id: string): void => {
    setSelectedAccountId(id);
    persistSelectedAccount(id);
  };

  const handleCreated = (account: Account): void => {
    selectAccount(account.id);
    setMode(APP_MODE.viewing);
    router.refresh();
  };

  const hasAccounts = accounts.length > 0;

  return (
    <AppModeProvider value={{ mode, setMode }}>
      <AccountsProvider value={{ accounts, selectedAccountId, selectAccount }}>
        {hasAccounts && <AccountSwitcher views={views} />}
        {!hasAccounts && !isCreating && (
          <EmptyState onCreate={() => setMode(APP_MODE.creatingAccount)} />
        )}
        {isCreating && (
          <CreateOverlay>
            <CreateAccount
              onCreated={handleCreated}
              onCancel={() => setMode(APP_MODE.viewing)}
            />
          </CreateOverlay>
        )}
      </AccountsProvider>
    </AppModeProvider>
  );
}
