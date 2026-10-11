'use client';

import { JSX } from 'react';
import { savedTowardGoalOf } from '@/lib/goal/saved-toward-goal';
import { useAccounts } from '@/components/Home/accounts-context';
import { APP_MODE, useAppMode } from '@/components/AccountManagement/app-mode-context';
import { GoalProgress } from '@/components/Goal/GoalProgress';
import { useMenu } from '../use-menu-state';
import { MENU_GOAL_COPY, MENU_GOAL_TEST_IDS } from './constants';
import { Chevron, GoalRow } from './MenuGoal.styles';

export function MenuGoal(): JSX.Element | null {
  const { currentAccount } = useAccounts();
  const { closeMenu } = useMenu();
  const { setMode } = useAppMode();
  const savedTowardGoal = savedTowardGoalOf(currentAccount);

  if (!savedTowardGoal) {
    return null;
  }

  const viewGoal = (): void => {
    closeMenu();
    setMode(APP_MODE.viewingGoal);
  };

  return (
    <GoalRow type="button" data-testid={MENU_GOAL_TEST_IDS.row} onClick={viewGoal}>
      <GoalProgress savedTowardGoal={savedTowardGoal} />
      <Chevron aria-hidden="true">{MENU_GOAL_COPY.chevron}</Chevron>
    </GoalRow>
  );
}
