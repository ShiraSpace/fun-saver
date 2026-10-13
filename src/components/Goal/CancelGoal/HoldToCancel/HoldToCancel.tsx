'use client';

import { JSX, MouseEvent, Ref } from 'react';
import type { GoalCancellation } from '../use-cancel-goal';
import { useHoldToCancel } from './use-hold-to-cancel';
import { HOLD_TO_CANCEL, HOLD_TO_CANCEL_COPY, HOLD_TO_CANCEL_TEST_IDS } from './constants';
import { CancelError, Fill, Hint, HoldButton, Label } from './HoldToCancel.styles';

interface HoldToCancelProps extends Pick<
  GoalCancellation,
  'isCancelling' | 'cancelFailed' | 'cancelGoal'
> {
  ref: Ref<HTMLButtonElement>;
}

function withoutLongPressMenu(mouseEvent: MouseEvent<HTMLButtonElement>): void {
  mouseEvent.preventDefault();
}

export function HoldToCancel({
  ref,
  isCancelling,
  cancelFailed,
  cancelGoal,
}: HoldToCancelProps): JSX.Element {
  const { isHolding, handlers } = useHoldToCancel({
    holdMs: HOLD_TO_CANCEL.holdMs,
    isCancelling,
    onHeld: cancelGoal,
  });
  const cancelError = cancelFailed && (
    <CancelError role="alert" data-testid={HOLD_TO_CANCEL_TEST_IDS.cancelError}>
      {HOLD_TO_CANCEL_COPY.cancelError}
    </CancelError>
  );

  return (
    <>
      <HoldButton
        ref={ref}
        type="button"
        disabled={isCancelling}
        aria-label={HOLD_TO_CANCEL_COPY.ariaLabel}
        onContextMenu={withoutLongPressMenu}
        data-testid={HOLD_TO_CANCEL_TEST_IDS.button}
        {...handlers}
      >
        <Fill
          aria-hidden="true"
          data-filling={isHolding}
          data-testid={HOLD_TO_CANCEL_TEST_IDS.fill}
        />
        <Label>{HOLD_TO_CANCEL_COPY.label}</Label>
      </HoldButton>
      <Hint aria-hidden="true">{HOLD_TO_CANCEL_COPY.hint}</Hint>
      {cancelError}
    </>
  );
}
