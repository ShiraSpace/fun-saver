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
import {
  barIsThin,
  Body,
  GoalHeading,
  GoalHeadingText,
  Picture,
  Progress,
} from './GoalProgress.styles';

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
  const { goal, isGoalReached } = savedTowardGoal;
  const heading = isGoalReached ? GOAL_PROGRESS_COPY.reached : goal.name;
  const pictureGlows = glowWhenReached && isGoalReached;

  return (
    <Progress>
      <Picture
        aria-hidden="true"
        data-testid={GOAL_PROGRESS_TEST_IDS.picture}
        progressSize={size}
        glowing={pictureGlows}
      >
        {goal.picture.emoji}
      </Picture>
      <Body>
        <GoalHeading isGoalReached={isGoalReached} progressSize={size}>
          <GoalHeadingText data-testid={GOAL_PROGRESS_TEST_IDS.heading}>{heading}</GoalHeadingText>
          <SavedOutOfGoal savedTowardGoal={savedTowardGoal} />
        </GoalHeading>
        <GoalProgressBar savedTowardGoal={savedTowardGoal} thin={barIsThin(size)} />
      </Body>
    </Progress>
  );
}
