'use client';

import { JSX } from 'react';
import { savedTowardGoalOf } from '@/lib/goal/saved-toward-goal';
import { useAccounts } from '@/components/Home/accounts-context';
import {
  APP_MODE,
  useAppMode,
  type AppMode,
} from '@/components/AccountManagement/app-mode-context';
import { GoalProgress } from '@/components/Goal/GoalProgress';
import { useMenu } from '../use-menu-state';
import { MENU_GOAL_COPY, MENU_GOAL_TEST_IDS } from './constants';
import { CancelGoalLink, Chevron, GoalRow } from './MenuGoal.styles';

export function MenuGoal(): JSX.Element {
  const { currentAccount } = useAccounts();
  const { closeMenu } = useMenu();
  const { setMode } = useAppMode();
  const savedTowardGoal = savedTowardGoalOf(currentAccount);

  const openGoalScreen = (mode: AppMode): void => {
    closeMenu();
    setMode(mode);
  };
  const setGoal = (): void => openGoalScreen(APP_MODE.settingGoal);
  const viewGoal = (): void => openGoalScreen(APP_MODE.viewingGoal);
  const cancelGoal = (): void => openGoalScreen(APP_MODE.cancellingGoal);

  if (!savedTowardGoal) {
    return (
      <GoalRow type="button" data-testid={MENU_GOAL_TEST_IDS.setGoal} onClick={setGoal}>
        {MENU_GOAL_COPY.setGoal}
      </GoalRow>
    );
  }

  return (
    <>
      <GoalRow type="button" data-testid={MENU_GOAL_TEST_IDS.row} onClick={viewGoal}>
        <GoalProgress savedTowardGoal={savedTowardGoal} />
        <Chevron aria-hidden="true">{MENU_GOAL_COPY.chevron}</Chevron>
      </GoalRow>
      <CancelGoalLink
        type="button"
        data-testid={MENU_GOAL_TEST_IDS.cancelGoal}
        onClick={cancelGoal}
      >
        {MENU_GOAL_COPY.cancelGoal}
      </CancelGoalLink>
    </>
  );
}
