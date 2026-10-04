import { useState } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import type { ViewMode } from '@/lib/account/view-mode';
import type { ViewModeChoice } from './accounts-context';

interface ChosenViewMode {
  viewMode: ViewMode;
  chosenOn: AccountSummary;
  isHeld: boolean;
}

interface ShownViewMode {
  shownAccount?: AccountSummary;
  viewModeChoice: ViewModeChoice;
}

function isChosenFor(chosen: ChosenViewMode, account: AccountSummary): boolean {
  if (chosen.isHeld) {
    return chosen.chosenOn.id === account.id;
  }

  return chosen.chosenOn === account;
}

function withChosenViewMode(
  account: AccountSummary | undefined,
  chosen: ChosenViewMode | undefined
): AccountSummary | undefined {
  if (!account || !chosen || !isChosenFor(chosen, account)) {
    return account;
  }

  return { ...account, viewMode: chosen.viewMode };
}

export function useShownViewMode(
  currentAccount: AccountSummary | undefined
): ShownViewMode {
  const [chosen, setChosen] = useState<ChosenViewMode>();

  const choose = (viewMode: ViewMode, isHeld: boolean): void => {
    if (currentAccount) {
      setChosen({ viewMode, chosenOn: currentAccount, isHeld });
    }
  };

  return {
    shownAccount: withChosenViewMode(currentAccount, chosen),
    viewModeChoice: {
      showViewMode: (viewMode: ViewMode): void => choose(viewMode, false),
      holdViewMode: (viewMode: ViewMode): void => choose(viewMode, true),
    },
  };
}
