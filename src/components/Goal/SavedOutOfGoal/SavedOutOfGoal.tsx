import { JSX } from 'react';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { Money } from '@/components/Money';
import {
  SAVED_OUT_OF_GOAL_COPY,
  SAVED_OUT_OF_GOAL_TEST_IDS,
} from './constants';
import { Amounts } from './SavedOutOfGoal.styles';

interface SavedOutOfGoalProps {
  savedTowardGoal: SavedTowardGoal;
}

export function SavedOutOfGoal({
  savedTowardGoal,
}: SavedOutOfGoalProps): JSX.Element {
  return (
    <Amounts dir="ltr">
      <Money
        amountAgorot={savedTowardGoal.saved}
        testId={SAVED_OUT_OF_GOAL_TEST_IDS.saved}
      />
      {SAVED_OUT_OF_GOAL_COPY.separator}
      <Money
        amountAgorot={savedTowardGoal.goal.amount}
        testId={SAVED_OUT_OF_GOAL_TEST_IDS.amount}
      />
    </Amounts>
  );
}
