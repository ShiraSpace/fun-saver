'use client';

import { JSX, useId } from 'react';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { REQUEST_STATE } from '@/lib/request-state';
import { GoalBeingCancelled } from './GoalBeingCancelled';
import { HoldToCancel } from './HoldToCancel';
import { useCancelGoal } from './use-cancel-goal';
import { useCancelGoalDialog } from './use-cancel-goal-dialog';
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
  const { requestState, cancelGoal, keepGoal } = useCancelGoal(props);
  const { dialogRef, keepGoalRef, holdToCancelRef, keepFocusInside } = useCancelGoalDialog({
    requestState,
    onKeepGoal: keepGoal,
  });

  return (
    <>
      <Scrim data-testid={CANCEL_GOAL_TEST_IDS.scrim} onClick={keepGoal} />
      <Card
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        onKeyDown={keepFocusInside}
        data-testid={CANCEL_GOAL_TEST_IDS.container}
      >
        <GoalBeingCancelled
          savedTowardGoal={props.savedTowardGoal}
          titleId={titleId}
          descriptionId={descriptionId}
        />
        <KeepButton
          ref={keepGoalRef}
          type="button"
          disabled={requestState === REQUEST_STATE.pending}
          onClick={keepGoal}
          data-testid={CANCEL_GOAL_TEST_IDS.keepGoal}
        >
          {CANCEL_GOAL_COPY.keepGoal}
        </KeepButton>
        <HoldToCancel ref={holdToCancelRef} requestState={requestState} onHeld={cancelGoal} />
      </Card>
    </>
  );
}
