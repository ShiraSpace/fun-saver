'use client';

import { JSX, useState } from 'react';
import type { Account as AccountModel, WalletWithDerived } from '@/lib/types';
import { Account } from '@/components/Account';
import { AccountsProvider } from './accounts-context';
import { Reveal } from '@/components/Reveal';

export interface AccountView {
  account: AccountModel;
  wallets: WalletWithDerived[];
}

interface AccountSwitcherProps {
  views: AccountView[];
}

export function AccountSwitcher({ views }: AccountSwitcherProps): JSX.Element {
  const [selectedAccountId, setSelectedAccountId] = useState(
    views[0].account.id
  );
  const current =
    views.find((view) => view.account.id === selectedAccountId) ?? views[0];
  const accounts = views.map((view) => view.account);

  const accountsContextValue = {
    accounts,
    selectedAccountId,
    selectAccount: setSelectedAccountId,
  };

  return (
    <AccountsProvider value={accountsContextValue}>
      <Reveal key={selectedAccountId}>
        <Account
          accountId={current.account.id}
          name={current.account.name}
          avatarId={current.account.avatarId}
          wallets={current.wallets}
        />
      </Reveal>
    </AccountsProvider>
  );
}
