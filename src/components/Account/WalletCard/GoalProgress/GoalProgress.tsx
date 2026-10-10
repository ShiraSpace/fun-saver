import { JSX } from 'react';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { GoalProgressBar } from '@/components/Goal/GoalProgressBar';
import { SavedOutOfGoal } from '@/components/Goal/SavedOutOfGoal';
import { GOAL_PROGRESS_COPY, GOAL_PROGRESS_TEST_IDS } from './constants';
import { Body, Line, Thumb, Top } from './GoalProgress.styles';

interface GoalProgressProps {
  savedTowardGoal: SavedTowardGoal;
}

export function GoalProgress({
  savedTowardGoal,
}: GoalProgressProps): JSX.Element {
  const { goal, reached } = savedTowardGoal;

  return (
    <Line data-testid={GOAL_PROGRESS_TEST_IDS.line}>
      <Thumb aria-hidden="true">{goal.picture.emoji}</Thumb>
      <Body>
        <Top reached={reached}>
          <span data-testid={GOAL_PROGRESS_TEST_IDS.heading}>
            {reached ? GOAL_PROGRESS_COPY.reached : goal.name}
          </span>
          <SavedOutOfGoal savedTowardGoal={savedTowardGoal} />
        </Top>
        <GoalProgressBar savedTowardGoal={savedTowardGoal} thin />
      </Body>
    </Line>
  );
}
