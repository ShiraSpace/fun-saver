'use client';

import { JSX } from 'react';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import {
  APP_MODE,
  useAppMode,
} from '@/components/AccountManagement/app-mode-context';
import { GoalProgressBar } from '@/components/Goal/GoalProgressBar';
import { SavedOfGoal } from '@/components/Goal/SavedOfGoal';
import { GOAL_PROGRESS_COPY, GOAL_PROGRESS_TEST_IDS } from './constants';
import { Body, Line, Thumb, Top } from './GoalProgress.styles';

interface GoalProgressProps {
  savedTowardGoal: SavedTowardGoal;
}

export function GoalProgress({
  savedTowardGoal,
}: GoalProgressProps): JSX.Element {
  const { setMode } = useAppMode();
  const { goal, reached } = savedTowardGoal;

  return (
    <Line
      type="button"
      data-testid={GOAL_PROGRESS_TEST_IDS.line}
      onClick={(): void => setMode(APP_MODE.viewingGoal)}
    >
      <Thumb aria-hidden="true">{goal.picture.emoji}</Thumb>
      <Body>
        <Top reached={reached}>
          <span data-testid={GOAL_PROGRESS_TEST_IDS.heading}>
            {reached ? GOAL_PROGRESS_COPY.reached : goal.name}
          </span>
          <SavedOfGoal savedTowardGoal={savedTowardGoal} />
        </Top>
        <GoalProgressBar savedTowardGoal={savedTowardGoal} thin />
      </Body>
    </Line>
  );
}
