import { JSX } from 'react';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { GoalProgressBar } from '../GoalProgressBar';
import { SavedOutOfGoal } from '../SavedOutOfGoal';
import {
  GOAL_PROGRESS_COPY,
  GOAL_PROGRESS_SIZE,
  GOAL_PROGRESS_TEST_IDS,
  type GoalProgressSize,
} from './constants';
import { Body, GoalHeading, Picture, Progress } from './GoalProgress.styles';

interface GoalProgressProps {
  savedTowardGoal: SavedTowardGoal;
  size?: GoalProgressSize;
  glowWhenReached?: boolean;
}

export function GoalProgress({
  savedTowardGoal,
  size = GOAL_PROGRESS_SIZE.small,
  glowWhenReached = false,
}: GoalProgressProps): JSX.Element {
  const { goal, reached } = savedTowardGoal;
  const heading = reached ? GOAL_PROGRESS_COPY.reached : goal.name;

  return (
    <Progress>
      <Picture
        aria-hidden="true"
        data-testid={GOAL_PROGRESS_TEST_IDS.picture}
        progressSize={size}
        glowing={glowWhenReached && reached}
      >
        {goal.picture.emoji}
      </Picture>
      <Body>
        <GoalHeading reached={reached} progressSize={size}>
          <span data-testid={GOAL_PROGRESS_TEST_IDS.heading}>{heading}</span>
          <SavedOutOfGoal savedTowardGoal={savedTowardGoal} />
        </GoalHeading>
        <GoalProgressBar
          savedTowardGoal={savedTowardGoal}
          thin={size === GOAL_PROGRESS_SIZE.small}
        />
      </Body>
    </Progress>
  );
}
