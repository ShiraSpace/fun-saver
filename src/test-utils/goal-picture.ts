import { screen } from '@testing-library/react';
import { GOAL_PROGRESS_TEST_IDS } from '@/components/Goal/GoalProgress/constants';

export function goalPictureGlow(): string {
  return getComputedStyle(screen.getByTestId(GOAL_PROGRESS_TEST_IDS.picture)).boxShadow;
}
