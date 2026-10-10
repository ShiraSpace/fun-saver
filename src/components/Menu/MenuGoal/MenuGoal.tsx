'use client';

import { JSX } from 'react';
import { savedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { useAccounts } from '@/components/Home/accounts-context';
import {
  APP_MODE,
  useAppMode,
} from '@/components/AccountManagement/app-mode-context';
import { GoalProgressBar } from '@/components/Goal/GoalProgressBar';
import { SavedOfGoal } from '@/components/Goal/SavedOfGoal';
import { useMenu } from '../use-menu-state';
import { MENU_GOAL_COPY, MENU_GOAL_TEST_IDS } from './constants';
import { Body, Chevron, GoalRow, Thumb, Top } from './MenuGoal.styles';

export function MenuGoal(): JSX.Element | null {
  const { currentAccount } = useAccounts();
  const { closeMenu } = useMenu();
  const { setMode } = useAppMode();
  const accountGoal = savedTowardGoal(currentAccount);

  if (!accountGoal) {
    return null;
  }

  const viewGoal = (): void => {
    closeMenu();
    setMode(APP_MODE.viewingGoal);
  };

  return (
    <GoalRow
      type="button"
      data-testid={MENU_GOAL_TEST_IDS.row}
      onClick={viewGoal}
    >
      <Thumb aria-hidden="true">{accountGoal.goal.picture.emoji}</Thumb>
      <Body>
        <Top>
          <span data-testid={MENU_GOAL_TEST_IDS.name}>
            {accountGoal.goal.name}
          </span>
          <SavedOfGoal savedTowardGoal={accountGoal} />
        </Top>
        <GoalProgressBar savedTowardGoal={accountGoal} thin />
      </Body>
      <Chevron aria-hidden="true">{MENU_GOAL_COPY.chevron}</Chevron>
    </GoalRow>
  );
}
