import { JSX } from 'react';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { GoalProgressBar } from '@/components/Goal/GoalProgressBar';
import { StillToSave } from '@/components/Goal/StillToSave';
import { LOCKED_SAVINGS_COPY, LOCKED_SAVINGS_TEST_IDS } from './constants';
import {
  Heading,
  Panel,
  Picture,
  StillToSaveLine,
} from './LockedSavings.styles';

interface LockedSavingsProps {
  savedTowardGoal: SavedTowardGoal;
}

export function LockedSavings({
  savedTowardGoal,
}: LockedSavingsProps): JSX.Element {
  const { goal, stillToSave } = savedTowardGoal;
  const heading = LOCKED_SAVINGS_COPY.heading(goal.name);

  return (
    <Panel data-testid={LOCKED_SAVINGS_TEST_IDS.panel}>
      <Picture aria-hidden="true">{goal.picture.emoji}</Picture>
      <Heading data-testid={LOCKED_SAVINGS_TEST_IDS.heading}>{heading}</Heading>
      <StillToSaveLine data-testid={LOCKED_SAVINGS_TEST_IDS.stillToSave}>
        <StillToSave stillToSave={stillToSave} />
      </StillToSaveLine>
      <GoalProgressBar savedTowardGoal={savedTowardGoal} thin />
    </Panel>
  );
}
