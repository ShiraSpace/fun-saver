import { JSX } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import { isShownToChild } from '@/lib/account/view-mode';
import { Account } from '@/components/Account';
import { ChildAccount } from '@/components/ChildAccount';

interface ShownAccountProps {
  account: AccountSummary;
}

export function ShownAccount({ account }: ShownAccountProps): JSX.Element {
  if (isShownToChild(account)) {
    return <ChildAccount account={account} />;
  }

  return <Account account={account} />;
}
