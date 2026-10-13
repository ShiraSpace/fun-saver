'use client';

import { JSX, MouseEvent, Ref } from 'react';
import { usePressAndHold } from './use-press-and-hold';
import { HOLD_TO_CANCEL, HOLD_TO_CANCEL_COPY, HOLD_TO_CANCEL_TEST_IDS } from './constants';
import { Fill, Hint, HoldButton, Label } from './HoldToCancel.styles';

interface HoldToCancelProps {
  ref: Ref<HTMLButtonElement>;
  isPending: boolean;
  onHeld: () => void;
}

function withoutLongPressMenu(mouseEvent: MouseEvent<HTMLButtonElement>): void {
  mouseEvent.preventDefault();
}

export function HoldToCancel({ ref, isPending, onHeld }: HoldToCancelProps): JSX.Element {
  const { isHolding, handlers } = usePressAndHold({
    holdMs: HOLD_TO_CANCEL.holdMs,
    isDisabled: isPending,
    onHeld,
  });

  return (
    <>
      <HoldButton
        ref={ref}
        type="button"
        disabled={isPending}
        aria-label={HOLD_TO_CANCEL_COPY.ariaLabel}
        onContextMenu={withoutLongPressMenu}
        data-testid={HOLD_TO_CANCEL_TEST_IDS.button}
        {...handlers}
      >
        <Fill
          aria-hidden="true"
          data-filling={isHolding || isPending}
          data-testid={HOLD_TO_CANCEL_TEST_IDS.fill}
        />
        <Label>{HOLD_TO_CANCEL_COPY.label}</Label>
      </HoldButton>
      <Hint aria-hidden="true">{HOLD_TO_CANCEL_COPY.hint}</Hint>
    </>
  );
}
