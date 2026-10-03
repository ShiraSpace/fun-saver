import { useState } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import type { AppViewMode } from '@/lib/account/view-mode';
import type { ViewModeChoice } from './accounts-context';

interface ChosenViewMode {
  accountId: string;
  viewMode: AppViewMode;
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
  const [saveFailed, reportSaveFailed] = useState(false);

  const showViewMode = (viewMode: AppViewMode): void => {
    if (currentAccount) {
      setChosen({ accountId: currentAccount.id, viewMode });
    }
  };

  return {
    shownAccount: withChosenViewMode(currentAccount, chosen),
    viewModeChoice: {
      showViewMode,
      returnToSavedViewMode: (): void => setChosen(undefined),
      saveFailed,
      reportSaveFailed,
    },
  };
}
