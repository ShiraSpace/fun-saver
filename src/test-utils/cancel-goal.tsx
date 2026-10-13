import { act, fireEvent, render, screen } from '@/test-utils/render';
import { createMockSavedTowardGoal } from '@/test-utils/mocks/goal.mocks';
import { IsLoaderShown } from '@/test-utils/is-loader-shown';
import { CancelGoal, type CancelGoalProps } from '@/components/Goal/CancelGoal/CancelGoal';
import { CANCEL_GOAL_TEST_IDS } from '@/components/Goal/CancelGoal/constants';
import {
  HOLD_TO_CANCEL,
  HOLD_TO_CANCEL_TEST_IDS,
} from '@/components/Goal/CancelGoal/HoldToCancel/constants';

class MockPointerEvent extends MouseEvent {}

export function stubPointerEventEachTest(): void {
  const originalPointerEvent = window.PointerEvent;

  beforeEach(() => {
    window.PointerEvent = MockPointerEvent as unknown as typeof PointerEvent;
  });

  afterEach(() => {
    window.PointerEvent = originalPointerEvent;
  });
}

export function renderCancelGoal(props: Partial<CancelGoalProps> = {}): void {
  render(
    <>
      <CancelGoal
        savedTowardGoal={createMockSavedTowardGoal()}
        onKeep={jest.fn()}
        onFinished={jest.fn()}
        {...props}
      />
      <IsLoaderShown />
    </>
  );
}

export function keepGoalButton(): HTMLElement {
  return screen.getByTestId(CANCEL_GOAL_TEST_IDS.keepGoal);
}

export function holdToCancelButton(): HTMLElement {
  return screen.getByTestId(HOLD_TO_CANCEL_TEST_IDS.button);
}

export async function completeHold(): Promise<void> {
  fireEvent.pointerDown(holdToCancelButton(), { button: 0 });
  await act(async () => {
    jest.advanceTimersByTime(HOLD_TO_CANCEL.holdMs);
  });
}
