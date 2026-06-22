'use client';

import { JSX, useState } from 'react';
import type { Account as AccountModel, WalletWithDerived } from '@/lib/types';
import { Account } from '@/components/Account';
import { AccountSelectionProvider } from './account-selection-context';

export interface AccountView {
  account: AccountModel;
  wallets: WalletWithDerived[];
}

interface AccountSwitcherProps {
  views: AccountView[];
}

export function AccountSwitcher({ views }: AccountSwitcherProps): JSX.Element {
  const [selectedId, setSelectedId] = useState(views[0].account.id);
  const current =
    views.find((view) => view.account.id === selectedId) ?? views[0];
  const accounts = views.map((view) => view.account);

  return (
    <AccountSelectionProvider
      value={{ accounts, selectedId, selectAccount: setSelectedId }}
    >
      <Account
        accountId={current.account.id}
        name={current.account.name}
        avatarId={current.account.avatarId}
        wallets={current.wallets}
      />
    </AccountSelectionProvider>
  );
}
