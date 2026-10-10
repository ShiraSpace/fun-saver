import { JSX } from 'react';
import { floorToShekels } from '@/lib/money';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import {
  GOAL_PERCENT,
  GOAL_PROGRESS_BAR_COPY,
  GOAL_PROGRESS_BAR_TEST_IDS,
  HEAD_START_PERCENT,
} from './constants';
import { Fill, Track } from './GoalProgressBar.styles';

interface GoalProgressBarProps {
  savedTowardGoal: SavedTowardGoal;
  thin?: boolean;
}

function savedPercent({ saved, goal }: SavedTowardGoal): number {
  const percent = (saved / goal.amount) * GOAL_PERCENT;

  return Math.min(Math.max(percent, HEAD_START_PERCENT), GOAL_PERCENT);
}

export function GoalProgressBar({
  savedTowardGoal,
  thin = false,
}: GoalProgressBarProps): JSX.Element {
  const { saved, goal, reached } = savedTowardGoal;
  const fillWidth = `${savedPercent(savedTowardGoal)}%`;
  const goalShekels = floorToShekels(goal.amount);
  const savedShekels = floorToShekels(Math.min(saved, goal.amount));

  return (
    <Track
      role="progressbar"
      aria-label={GOAL_PROGRESS_BAR_COPY.label}
      aria-valuemin={0}
      aria-valuemax={goalShekels}
      aria-valuenow={savedShekels}
      data-testid={GOAL_PROGRESS_BAR_TEST_IDS.bar}
      thin={thin}
    >
      <Fill
        data-testid={GOAL_PROGRESS_BAR_TEST_IDS.fill}
        reached={reached}
        fillWidth={fillWidth}
      />
    </Track>
  );
}
