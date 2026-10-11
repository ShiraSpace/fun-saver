'use client';

import { JSX } from 'react';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { useModal } from '@/hooks/use-modal';
import { PrimaryButton } from '@/components/PrimaryButton';
import { CancelButton, FormTitle } from '@/components/AccountForm';
import { GoalHero } from './GoalHero';
import { SavingsLock } from './SavingsLock';
import { VIEW_GOAL_COPY, VIEW_GOAL_TEST_IDS } from './constants';
import { Dialog, Page, ReachedHeading } from './ViewGoal.styles';

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
  const modalRef = useModal(onClose);
  const { reached } = savedTowardGoal;
  const title = VIEW_GOAL_COPY.title(accountName);
  const reachedHeading = reached && (
    <ReachedHeading data-testid={VIEW_GOAL_TEST_IDS.reachedHeading}>
      {VIEW_GOAL_COPY.reachedHeading}
    </ReachedHeading>
  );

  return (
    <Dialog
      ref={modalRef}
      align="top"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
      data-testid={VIEW_GOAL_TEST_IDS.container}
    >
      <Page>
        <CancelButton onCancel={onClose} disabled={false} />
        <FormTitle title={title} titleIcon={VIEW_GOAL_COPY.titleIcon} />
        {reachedHeading}
        <GoalHero savedTowardGoal={savedTowardGoal} />
        <SavingsLock reached={reached} />
        <PrimaryButton
          type="button"
          data-testid={VIEW_GOAL_TEST_IDS.back}
          onClick={onClose}
        >
          {VIEW_GOAL_COPY.back}
        </PrimaryButton>
      </Page>
    </Dialog>
  );
}
