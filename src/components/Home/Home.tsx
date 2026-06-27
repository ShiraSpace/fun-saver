'use client';

import { JSX, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import type { Account, AccountWithDerivedWallets } from '@/lib/types';
import { AccountSwitcher } from '@/components/AccountSwitcher';
import { CreateAccount } from '@/components/CreateAccount';
import { EmptyState } from '@/components/EmptyState';
import { AccountsProvider } from '@/components/AccountSwitcher/accounts-context';
import { LAYERS } from '@/theme/layers';
import { resolveThemeId } from '@/theme/registry';
import { useSetThemeId } from '@/theme/ThemeController';
import { APP_MODE, AppMode, AppModeProvider } from './app-mode-context';
import { persistSelectedAccount } from './selected-account-cookie';

interface HomeProps {
  accounts: AccountWithDerivedWallets[];
  initialAccountId: string;
}

const CreateOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${LAYERS.modal};
  overflow-y: auto;
`;

export function Home({ accounts, initialAccountId }: HomeProps): JSX.Element {
  const router = useRouter();
  const setThemeId = useSetThemeId();

  const [mode, setMode] = useState<AppMode>(APP_MODE.viewing);
  const [selectedAccountId, setSelectedAccountId] = useState(initialAccountId);

  const isCreating = mode === APP_MODE.creatingAccount;

  const selectAccount = (id: string): void => {
    setSelectedAccountId(id);
    persistSelectedAccount(id);

    const target = accounts.find((account) => account.id === id);
    setThemeId(resolveThemeId(target?.themeId));
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
        {hasAccounts && <AccountSwitcher accounts={accounts} />}
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
