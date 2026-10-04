import { useState } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import type { ViewMode } from '@/lib/account/view-mode';
import type { ViewModeChoice } from './accounts-context';

interface ChosenViewMode {
  viewMode: ViewMode;
  accountId: string;
}

interface ShownViewMode {
  shownAccount?: AccountSummary;
  viewModeChoice: ViewModeChoice;
}

function withChosenViewMode(
  account: AccountSummary | undefined,
  chosen: ChosenViewMode | undefined
): AccountSummary | undefined {
  if (!account || chosen?.accountId !== account.id) {
    return account;
  }

  return { ...account, viewMode: chosen.viewMode };
}

export function useShownViewMode(
  currentAccount: AccountSummary | undefined
): ShownViewMode {
  const [chosen, setChosen] = useState<ChosenViewMode>();

  const showViewMode = (viewMode: ViewMode): void => {
    if (currentAccount) {
      setChosen({ viewMode, accountId: currentAccount.id });
    }
  };

  return {
    shownAccount: withChosenViewMode(currentAccount, chosen),
    viewModeChoice: { showViewMode },
  };
}
