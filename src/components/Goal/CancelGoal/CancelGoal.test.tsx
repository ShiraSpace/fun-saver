import { act, fireEvent, screen } from '@/test-utils/render';
import { fakeTimersEachTest } from '@/test-utils/hold-to-cancel';
import { mockGoal } from '@/test-utils/mocks/goal.mocks';
import { restoreFetchAfterEach, stubFetch } from '@/test-utils/stub-fetch';
import {
  holdToCancelButton,
  keepGoalButton,
  pressHoldToCancel,
  renderCancelGoal,
  stubPointerSupportEachTest,
} from '@/test-utils/cancel-goal';
import { ESCAPE_KEY, TAB_KEY } from '@/hooks/constants';
import { CANCEL_GOAL_TEST_IDS } from './constants';
import { GOAL_BEING_CANCELLED_COPY } from './GoalBeingCancelled/constants';
import { HOLD_TO_CANCEL } from './HoldToCancel/constants';

function pressTab(from: HTMLElement, shiftKey = false): void {
  from.focus();
  fireEvent.keyDown(from, { key: TAB_KEY, shiftKey });
}

describe('CancelGoal', () => {
  const mockOnKeep = jest.fn();

  restoreFetchAfterEach();
  stubPointerSupportEachTest();
  fakeTimersEachTest();

  beforeEach(() => {
    jest.clearAllMocks();
    renderCancelGoal({ onKeep: mockOnKeep });
  });

  describe('when it opens', () => {
    it('puts the focus on keeping the goal', () => {
      expect(keepGoalButton()).toHaveFocus();
    });

    it('asks whether to cancel the goal, by its name', () => {
      expect(
        screen.getByRole('alertdialog', { name: GOAL_BEING_CANCELLED_COPY.title(mockGoal.name) })
      ).toBeInTheDocument();
    });

    it('describes what was saved so far', () => {
      expect(screen.getByRole('alertdialog')).toHaveAccessibleDescription(
        expect.stringContaining(GOAL_BEING_CANCELLED_COPY.savedSoFar)
      );
    });
  });

  it('keeps the goal on Escape', () => {
    fireEvent.keyDown(document, { key: ESCAPE_KEY });

    expect(mockOnKeep).toHaveBeenCalledTimes(1);
  });

  it('keeps the goal on a tap on keeping the goal', () => {
    fireEvent.click(keepGoalButton());

    expect(mockOnKeep).toHaveBeenCalledTimes(1);
  });

  it('keeps the goal on a tap on the dimmed page behind', () => {
    fireEvent.click(screen.getByTestId(CANCEL_GOAL_TEST_IDS.scrim));

    expect(mockOnKeep).toHaveBeenCalledTimes(1);
  });

  it('does not cancel the goal on a quick tap on the hold button', () => {
    const mockFetch = jest.fn();
    stubFetch(mockFetch);

    pressHoldToCancel();
    fireEvent.pointerUp(holdToCancelButton());
    fireEvent.click(holdToCancelButton());
    act(() => {
      jest.advanceTimersByTime(HOLD_TO_CANCEL.holdMs);
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  describe('Tab', () => {
    it('from the hold button comes back round to keeping the goal', () => {
      pressTab(holdToCancelButton());

      expect(keepGoalButton()).toHaveFocus();
    });

    it('backwards from keeping the goal comes back round to the hold button', () => {
      pressTab(keepGoalButton(), true);

      expect(holdToCancelButton()).toHaveFocus();
    });

    it('from the dialog itself stays inside, on keeping the goal', () => {
      pressTab(screen.getByTestId(CANCEL_GOAL_TEST_IDS.container));

      expect(keepGoalButton()).toHaveFocus();
    });
  });
});
