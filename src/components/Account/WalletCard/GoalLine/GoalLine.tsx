'use client';

import { JSX } from 'react';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { GoalProgress } from '@/components/Goal/GoalProgress';
import { APP_MODE, useAppMode } from '@/components/AccountManagement/app-mode-context';
import { GOAL_LINE_TEST_IDS } from './constants';
import { Line } from './GoalLine.styles';

interface GoalLineProps {
  savedTowardGoal?: SavedTowardGoal;
}

export function GoalLine({ savedTowardGoal }: GoalLineProps): JSX.Element | null {
  const { setMode } = useAppMode();

  const viewGoal = (): void => setMode(APP_MODE.viewingGoal);

  if (!savedTowardGoal) {
    return null;
  }

  return (
    <Line type="button" data-testid={GOAL_LINE_TEST_IDS.line} onClick={viewGoal}>
      <GoalProgress savedTowardGoal={savedTowardGoal} />
    </Line>
  );
}
