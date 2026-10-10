import { JSX } from 'react';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { GoalProgressBar } from '@/components/Goal/GoalProgressBar';
import { SavedOutOfGoal } from '@/components/Goal/SavedOutOfGoal';
import { GOAL_PROGRESS_COPY, GOAL_PROGRESS_TEST_IDS } from './constants';
import { Body, GoalHeading, GoalLine, Picture } from './GoalProgress.styles';

interface GoalProgressProps {
  savedTowardGoal: SavedTowardGoal;
}

export function GoalProgress({
  savedTowardGoal,
}: GoalProgressProps): JSX.Element {
  const { goal, reached } = savedTowardGoal;
  const heading = reached ? GOAL_PROGRESS_COPY.reached : goal.name;

  return (
    <GoalLine data-testid={GOAL_PROGRESS_TEST_IDS.line}>
      <Picture aria-hidden="true">{goal.picture.emoji}</Picture>
      <Body>
        <GoalHeading reached={reached}>
          <span data-testid={GOAL_PROGRESS_TEST_IDS.heading}>{heading}</span>
          <SavedOutOfGoal savedTowardGoal={savedTowardGoal} />
        </GoalHeading>
        <GoalProgressBar savedTowardGoal={savedTowardGoal} thin />
      </Body>
    </GoalLine>
  );
}
