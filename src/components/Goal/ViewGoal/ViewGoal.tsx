'use client';

import { JSX } from 'react';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { Screen } from '@/components/Screen';
import { PrimaryButton } from '@/components/PrimaryButton';
import { CancelButton, FormTitle } from '@/components/AccountForm';
import { GoalHero } from './GoalHero';
import { VIEW_GOAL_COPY, VIEW_GOAL_TEST_IDS } from './constants';
import { Badge, Page, ReachedHeading } from './ViewGoal.styles';

interface ViewGoalProps {
  accountName: string;
  savedTowardGoal: SavedTowardGoal;
  onClose: () => void;
}

export function ViewGoal({
  accountName,
  savedTowardGoal,
  onClose,
}: ViewGoalProps): JSX.Element {
  const { reached } = savedTowardGoal;

  return (
    <Screen align="top" data-testid={VIEW_GOAL_TEST_IDS.container}>
      <Page>
        <CancelButton onCancel={onClose} disabled={false} />
        <FormTitle
          title={VIEW_GOAL_COPY.title(accountName)}
          titleIcon={VIEW_GOAL_COPY.titleIcon}
        />
        {reached && (
          <ReachedHeading data-testid={VIEW_GOAL_TEST_IDS.reachedHeading}>
            {VIEW_GOAL_COPY.reachedHeading}
          </ReachedHeading>
        )}
        <GoalHero savedTowardGoal={savedTowardGoal} />
        <Badge reached={reached} data-testid={VIEW_GOAL_TEST_IDS.badge}>
          {reached ? VIEW_GOAL_COPY.openBadge : VIEW_GOAL_COPY.lockedBadge}
        </Badge>
        <PrimaryButton
          type="button"
          data-testid={VIEW_GOAL_TEST_IDS.back}
          onClick={onClose}
        >
          {VIEW_GOAL_COPY.back}
        </PrimaryButton>
      </Page>
    </Screen>
  );
}
