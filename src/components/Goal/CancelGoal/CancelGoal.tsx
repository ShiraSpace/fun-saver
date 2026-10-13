'use client';

import { JSX, useId } from 'react';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { REQUEST_STATE } from '@/lib/request-state';
import { useModal } from '@/hooks/use-modal';
import { GoalBeingCancelled } from './GoalBeingCancelled';
import { HoldToCancel } from './HoldToCancel';
import { useCancelGoal } from './use-cancel-goal';
import { useFocusKeptInside } from './use-focus-kept-inside';
import { CANCEL_GOAL_COPY, CANCEL_GOAL_TEST_IDS } from './constants';
import { Card, KeepButton, Scrim } from './CancelGoal.styles';

export interface CancelGoalProps {
  savedTowardGoal: SavedTowardGoal;
  onKeep: () => void;
  onFinished: () => void;
}

export function CancelGoal(props: CancelGoalProps): JSX.Element {
  const titleId = useId();
  const descriptionId = useId();
  const { requestState, cancelGoal, keep } = useCancelGoal(props);
  const isPending = requestState === REQUEST_STATE.pending;
  const modalRef = useModal(keep);
  const { firstRef, lastRef, onKeyDown } = useFocusKeptInside(requestState);

  return (
    <>
      <Scrim data-testid={CANCEL_GOAL_TEST_IDS.scrim} onClick={keep} />
      <Card
        ref={modalRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        data-testid={CANCEL_GOAL_TEST_IDS.container}
      >
        <GoalBeingCancelled
          savedTowardGoal={props.savedTowardGoal}
          titleId={titleId}
          descriptionId={descriptionId}
        />
        <KeepButton
          ref={firstRef}
          type="button"
          disabled={isPending}
          onClick={keep}
          data-testid={CANCEL_GOAL_TEST_IDS.keep}
        >
          {CANCEL_GOAL_COPY.keep}
        </KeepButton>
        <HoldToCancel ref={lastRef} requestState={requestState} onHeld={cancelGoal} />
      </Card>
    </>
  );
}
