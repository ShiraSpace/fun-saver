'use client';

import { JSX } from 'react';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { PrimaryButton } from '@/components/PrimaryButton';
import { CloseButton } from '@/components/CloseButton';
import { ScreenTitle } from '@/components/ScreenTitle';
import { GoalDialog } from '../GoalDialog';
import { GoalHero } from './GoalHero';
import { SavingsLock } from './SavingsLock';
import { VIEW_GOAL_COPY, VIEW_GOAL_TEST_IDS } from './constants';
import { ReachedHeading } from './ViewGoal.styles';

interface ViewGoalProps {
  accountName: string;
  savedTowardGoal: SavedTowardGoal;
  onClose: () => void;
}

export function ViewGoal({ accountName, savedTowardGoal, onClose }: ViewGoalProps): JSX.Element {
  const { reached } = savedTowardGoal;
  const title = VIEW_GOAL_COPY.title(accountName);
  const reachedHeading = reached && (
    <ReachedHeading data-testid={VIEW_GOAL_TEST_IDS.reachedHeading}>
      {VIEW_GOAL_COPY.reachedHeading}
    </ReachedHeading>
  );

  return (
    <GoalDialog title={title} onClose={onClose} data-testid={VIEW_GOAL_TEST_IDS.container}>
      <CloseButton onClose={onClose} />
      <ScreenTitle title={title} titleIcon={VIEW_GOAL_COPY.titleIcon} />
      {reachedHeading}
      <GoalHero savedTowardGoal={savedTowardGoal} />
      <SavingsLock reached={reached} />
      <PrimaryButton type="button" data-testid={VIEW_GOAL_TEST_IDS.back} onClick={onClose}>
        {VIEW_GOAL_COPY.back}
      </PrimaryButton>
    </GoalDialog>
  );
}
