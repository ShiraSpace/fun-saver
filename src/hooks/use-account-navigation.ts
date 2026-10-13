import { Dispatch, SetStateAction, useState } from 'react';
import type { Account, AccountSummary } from '@/lib/account/types';
import { APP_MODE, AppMode } from '@/components/AccountManagement/app-mode-context';
import { CURRENT_ACCOUNT_COOKIE, writeCookie } from '@/lib/cookies';
import { findCurrentAccount } from '@/lib/account/current-account';
import { savedTowardGoalOf, type SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { resolveThemeId } from '@/theme/registry';
import { useSetThemeId } from '@/theme/AppThemeProvider';
import { useRefreshWithLoader } from './loader-context';

export interface AccountNavigation {
  mode: AppMode;
  setMode: Dispatch<SetStateAction<AppMode>>;
  currentAccount?: AccountSummary;
  switchAccount: (id: string) => void;
  showNewAccount: (account: Account) => void;
  finishEditing: () => void;
  cancel: () => void;
  isCreating: boolean;
  editingAccount?: AccountSummary;
  accountSettingGoal?: AccountSummary;
  goalBeingViewed?: GoalBeingViewed;
}

export interface GoalBeingViewed {
  accountName: string;
  savedTowardGoal: SavedTowardGoal;
}

interface GoalBeingViewedParams {
  mode: AppMode;
  currentAccount?: AccountSummary;
}

interface LeavingGoneGoalParams extends GoalBeingViewedParams {
  setMode: Dispatch<SetStateAction<AppMode>>;
}

function goalBeingViewedOf({
  mode,
  currentAccount,
}: GoalBeingViewedParams): GoalBeingViewed | undefined {
  if (mode !== APP_MODE.viewingGoal || !currentAccount) {
    return;
  }

  const savedTowardGoal = savedTowardGoalOf(currentAccount);

  if (!savedTowardGoal) {
    return;
  }

  return { accountName: currentAccount.name, savedTowardGoal };
}

function useGoalBeingViewed({
  setMode,
  ...params
}: LeavingGoneGoalParams): GoalBeingViewed | undefined {
  const goalBeingViewed = goalBeingViewedOf(params);

  if (params.mode === APP_MODE.viewingGoal && !goalBeingViewed) {
    setMode(APP_MODE.viewing);
  }

  return goalBeingViewed;
}

export function useAccountNavigation(
  accounts: AccountSummary[],
  initialAccountId: string
): AccountNavigation {
  const refreshWithLoader = useRefreshWithLoader();
  const setThemeId = useSetThemeId();

  const [mode, setMode] = useState<AppMode>(APP_MODE.viewing);
  const [currentAccountId, setCurrentAccountId] = useState(initialAccountId);

  const switchAccount = (id: string): void => {
    setCurrentAccountId(id);
    writeCookie(CURRENT_ACCOUNT_COOKIE, id);

    const nextAccount = accounts.find((account) => account.id === id);
    setThemeId(resolveThemeId(nextAccount?.themeId));
  };

  const returnToViewing = (): void => setMode(APP_MODE.viewing);

  const finishEditing = (): void => {
    returnToViewing();
    refreshWithLoader();
  };

  const currentAccount = findCurrentAccount(accounts, currentAccountId);
  const isEditing = mode === APP_MODE.editingAccount;
  const goalBeingViewed = useGoalBeingViewed({ mode, setMode, currentAccount });

  return {
    mode,
    setMode,
    currentAccount,
    switchAccount,
    showNewAccount: (account): void => {
      switchAccount(account.id);
      finishEditing();
    },
    finishEditing,
    cancel: returnToViewing,
    isCreating: mode === APP_MODE.creatingAccount,
    editingAccount: isEditing ? currentAccount : undefined,
    accountSettingGoal: mode === APP_MODE.settingGoal ? currentAccount : undefined,
    goalBeingViewed,
  };
}
