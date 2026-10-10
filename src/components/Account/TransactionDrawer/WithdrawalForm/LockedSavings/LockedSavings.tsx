import { JSX } from 'react';
import { agorotToShekels } from '@/lib/money';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { GoalProgressBar } from '@/components/Goal/GoalProgressBar';
import { LOCKED_SAVINGS_COPY, LOCKED_SAVINGS_TEST_IDS } from './constants';
import { Heading, Panel, StillToSave, Picture } from './LockedSavings.styles';

interface LockedSavingsProps {
  savedTowardGoal: SavedTowardGoal;
}

export function LockedSavings({
  savedTowardGoal,
}: LockedSavingsProps): JSX.Element {
  const { goal, stillToSave } = savedTowardGoal;
  const heading = LOCKED_SAVINGS_COPY.heading(goal.name);
  const stillToSaveText = LOCKED_SAVINGS_COPY.stillToSave(
    agorotToShekels(stillToSave)
  );

  return (
    <Panel data-testid={LOCKED_SAVINGS_TEST_IDS.panel}>
      <Picture aria-hidden="true">{goal.picture.emoji}</Picture>
      <Heading data-testid={LOCKED_SAVINGS_TEST_IDS.heading}>{heading}</Heading>
      <StillToSave data-testid={LOCKED_SAVINGS_TEST_IDS.stillToSave}>
        {stillToSaveText}
      </StillToSave>
      <GoalProgressBar savedTowardGoal={savedTowardGoal} thin />
    </Panel>
  );
}
