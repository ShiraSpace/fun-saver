'use client';

import { JSX } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { Account } from '@/components/Account';
import { selectedAccount } from '@/lib/selected-account';
import { useAccounts } from './accounts-context';

interface AccountSwitcherProps {
  accounts: AccountWithDerivedWallets[];
}

export function AccountSwitcher({
  accounts,
}: AccountSwitcherProps): JSX.Element {
  const { selectedAccountId } = useAccounts();
  const current = selectedAccount(accounts, selectedAccountId);

  if (!current) {
    return <></>;
  }

  return <Account account={current} />;
}
