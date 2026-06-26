'use client';

import { JSX } from 'react';
import type { Account as AccountModel, WalletWithDerived } from '@/lib/types';
import { Account } from '@/components/Account';
import { useAccounts } from './accounts-context';

export interface AccountView {
  account: AccountModel;
  wallets: WalletWithDerived[];
}

interface AccountSwitcherProps {
  views: AccountView[];
}

export function AccountSwitcher({ views }: AccountSwitcherProps): JSX.Element {
  const { selectedAccountId } = useAccounts();
  const current =
    views.find((view) => view.account.id === selectedAccountId) ?? views[0];

  return (
    <Account
      accountId={current.account.id}
      name={current.account.name}
      avatarId={current.account.avatarId}
      wallets={current.wallets}
    />
  );
}
