'use client';

import { JSX } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { Account } from '@/components/Account';
import { useAccounts } from './accounts-context';

interface AccountSwitcherProps {
  accounts: AccountWithDerivedWallets[];
}

export function AccountSwitcher({
  accounts,
}: AccountSwitcherProps): JSX.Element {
  const { selectedAccountId } = useAccounts();
  const current =
    accounts.find((account) => account.id === selectedAccountId) ?? accounts[0];

  return <Account account={current} />;
}
