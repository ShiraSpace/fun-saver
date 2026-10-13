'use client';

import { JSX, useId } from 'react';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { BottomSheetScrim } from '@/components/BottomSheet';
import { GoalBeingCancelled } from './GoalBeingCancelled';
import { HoldToCancel } from './HoldToCancel';
import { useCancelGoal } from './use-cancel-goal';
import { useCancelGoalDialog } from './use-cancel-goal-dialog';
import { CANCEL_GOAL_COPY, CANCEL_GOAL_TEST_IDS } from './constants';
import { Card, KeepButton } from './CancelGoal.styles';

export interface CancelGoalProps {
  savedTowardGoal: SavedTowardGoal;
  onKeep: () => void;
  onFinished: () => void;
}

export function CancelGoal(props: CancelGoalProps): JSX.Element {
  const titleId = useId();
  const descriptionId = useId();
  const goalCancellation = useCancelGoal(props);
  const { isCancelling, keepGoal } = goalCancellation;
  const { dialogRef, keepGoalRef, holdToCancelRef, keepFocusInside } =
    useCancelGoalDialog(goalCancellation);

  return (
    <>
      <BottomSheetScrim data-testid={CANCEL_GOAL_TEST_IDS.scrim} onClick={keepGoal} />
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
          disabled={isCancelling}
          onClick={keepGoal}
          data-testid={CANCEL_GOAL_TEST_IDS.keepGoal}
        >
          {CANCEL_GOAL_COPY.keepGoal}
        </KeepButton>
        <HoldToCancel ref={holdToCancelRef} {...goalCancellation} />
      </Card>
    </>
  );
}
