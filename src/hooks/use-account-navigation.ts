import { Dispatch, SetStateAction, useState } from 'react';
import type { Account, AccountSummary } from '@/lib/account/types';
import {
  APP_MODE,
  AppMode,
  MODES_SHOWING_THE_GOAL,
} from '@/components/AccountManagement/app-mode-context';
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
  goalBeingCancelled?: SavedTowardGoal;
}

export interface GoalBeingViewed {
  accountName: string;
  savedTowardGoal: SavedTowardGoal;
}

interface GoalOnScreen {
  goalBeingViewed?: GoalBeingViewed;
  goalBeingCancelled?: SavedTowardGoal;
}

interface GoalOnScreenParams {
  mode: AppMode;
  setMode: Dispatch<SetStateAction<AppMode>>;
  currentAccount?: AccountSummary;
}

function goalOnScreenOf({ mode, setMode, currentAccount }: GoalOnScreenParams): GoalOnScreen {
  if (!MODES_SHOWING_THE_GOAL.includes(mode)) {
    return {};
  }

  const savedTowardGoal = currentAccount && savedTowardGoalOf(currentAccount);

  if (!currentAccount || !savedTowardGoal) {
    setMode(APP_MODE.viewing);
    return {};
  }

  if (mode === APP_MODE.cancellingGoal) {
    return { goalBeingCancelled: savedTowardGoal };
  }

  return { goalBeingViewed: { accountName: currentAccount.name, savedTowardGoal } };
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
  const goalOnScreen = goalOnScreenOf({ mode, setMode, currentAccount });

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
    ...goalOnScreen,
  };
}
