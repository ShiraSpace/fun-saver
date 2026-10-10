import { JSX } from 'react';
import { floorToShekels } from '@/lib/money';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import {
  FULL_PERCENT,
  GOAL_PROGRESS_BAR_COPY,
  GOAL_PROGRESS_BAR_TEST_IDS,
  MIN_FILL_PERCENT,
} from './constants';
import { Fill, Track } from './GoalProgressBar.styles';

interface GoalProgressBarProps {
  savedTowardGoal: SavedTowardGoal;
  thin?: boolean;
}

function filledPercent({ saved, goal }: SavedTowardGoal): number {
  const percent = (saved / goal.amount) * FULL_PERCENT;

  return Math.min(Math.max(percent, MIN_FILL_PERCENT), FULL_PERCENT);
}

export function GoalProgressBar({
  savedTowardGoal,
  thin = false,
}: GoalProgressBarProps): JSX.Element {
  const { saved, goal, reached } = savedTowardGoal;

  return (
    <Track
      role="progressbar"
      aria-label={GOAL_PROGRESS_BAR_COPY.label}
      aria-valuemin={0}
      aria-valuemax={floorToShekels(goal.amount)}
      aria-valuenow={floorToShekels(saved)}
      data-testid={GOAL_PROGRESS_BAR_TEST_IDS.bar}
      thin={thin}
    >
      <Fill
        data-testid={GOAL_PROGRESS_BAR_TEST_IDS.fill}
        reached={reached}
        style={{ width: `${filledPercent(savedTowardGoal)}%` }}
      />
    </Track>
  );
}
