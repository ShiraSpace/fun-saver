import { JSX } from 'react';
import { agorotToShekels } from '@/lib/money';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { GoalProgressBar } from '@/components/Goal/GoalProgressBar';
import { LOCKED_SAVINGS_COPY, LOCKED_SAVINGS_TEST_IDS } from './constants';
import { Heading, Panel, StillToSave, Thumb } from './LockedSavings.styles';

interface LockedSavingsProps {
  savedTowardGoal: SavedTowardGoal;
}

export function LockedSavings({
  savedTowardGoal,
}: LockedSavingsProps): JSX.Element {
  const { goal, stillToSave } = savedTowardGoal;

  return (
    <Panel data-testid={LOCKED_SAVINGS_TEST_IDS.panel}>
      <Thumb aria-hidden="true">{goal.picture.emoji}</Thumb>
      <Heading data-testid={LOCKED_SAVINGS_TEST_IDS.heading}>
        {LOCKED_SAVINGS_COPY.heading(goal.name)}
      </Heading>
      <StillToSave data-testid={LOCKED_SAVINGS_TEST_IDS.stillToSave}>
        {LOCKED_SAVINGS_COPY.stillToSave(agorotToShekels(stillToSave))}
      </StillToSave>
      <GoalProgressBar savedTowardGoal={savedTowardGoal} thin />
    </Panel>
  );
}
