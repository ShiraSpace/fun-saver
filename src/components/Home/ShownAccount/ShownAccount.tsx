import { JSX } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import { VIEW_MODE } from '@/lib/view-mode';
import { Account } from '@/components/Account';
import { ChildAccount } from '@/components/ChildAccount';
import { useViewMode } from '../view-mode-context';

interface ShownAccountProps {
  account: AccountSummary;
}

export function ShownAccount({ account }: ShownAccountProps): JSX.Element {
  const { viewMode } = useViewMode();

  if (viewMode === VIEW_MODE.child) {
    return <ChildAccount account={account} />;
  }

  return <Account account={account} />;
}
