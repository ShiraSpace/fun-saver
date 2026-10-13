'use client';

import { JSX, MouseEvent, Ref } from 'react';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';
import { useHoldToCancel } from './use-hold-to-cancel';
import { HOLD_TO_CANCEL, HOLD_TO_CANCEL_COPY, HOLD_TO_CANCEL_TEST_IDS } from './constants';
import { CancelError, Fill, Hint, HoldButton, Label } from './HoldToCancel.styles';

interface HoldToCancelProps {
  ref: Ref<HTMLButtonElement>;
  requestState: RequestState;
  onHeld: () => void;
}

function withoutLongPressMenu(mouseEvent: MouseEvent<HTMLButtonElement>): void {
  mouseEvent.preventDefault();
}

export function HoldToCancel({ ref, requestState, onHeld }: HoldToCancelProps): JSX.Element {
  const isCancelling = requestState === REQUEST_STATE.pending;
  const { isHolding, handlers } = useHoldToCancel({
    holdMs: HOLD_TO_CANCEL.holdMs,
    isCancelling,
    onHeld,
  });

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
          data-filling={isHolding || isCancelling}
          data-testid={HOLD_TO_CANCEL_TEST_IDS.fill}
        />
        <Label>{HOLD_TO_CANCEL_COPY.label}</Label>
      </HoldButton>
      <Hint aria-hidden="true">{HOLD_TO_CANCEL_COPY.hint}</Hint>
      {requestState === REQUEST_STATE.failed && (
        <CancelError role="alert" data-testid={HOLD_TO_CANCEL_TEST_IDS.cancelError}>
          {HOLD_TO_CANCEL_COPY.cancelError}
        </CancelError>
      )}
    </>
  );
}
