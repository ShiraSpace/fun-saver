import { act, fireEvent, screen } from '@/test-utils/render';
import { fakeTimersEachTest } from '@/test-utils/hold-to-cancel';
import { mockGoal } from '@/test-utils/mocks/goal.mocks';
import { restoreFetchAfterEach, stubFetch } from '@/test-utils/stub-fetch';
import {
  holdToCancelButton,
  keepGoalButton,
  pressHoldToCancel,
  renderCancelGoal,
  stubPointerEventEachTest,
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

  stubPointerEventEachTest();
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

  describe('Escape', () => {
    beforeEach(() => {
      fireEvent.keyDown(document, { key: ESCAPE_KEY });
    });

    it('keeps the goal', () => {
      expect(mockOnKeep).toHaveBeenCalledTimes(1);
    });
  });

  describe('a tap on keeping the goal', () => {
    beforeEach(() => {
      fireEvent.click(keepGoalButton());
    });

    it('keeps the goal', () => {
      expect(mockOnKeep).toHaveBeenCalledTimes(1);
    });
  });

  describe('a tap on the dimmed page behind', () => {
    beforeEach(() => {
      fireEvent.click(screen.getByTestId(CANCEL_GOAL_TEST_IDS.scrim));
    });

    it('keeps the goal', () => {
      expect(mockOnKeep).toHaveBeenCalledTimes(1);
    });
  });

  describe('a quick tap on the hold button', () => {
    const mockFetch = jest.fn();

    restoreFetchAfterEach();

    beforeEach(() => {
      stubFetch(mockFetch);
      pressHoldToCancel();
      fireEvent.pointerUp(holdToCancelButton());
      fireEvent.click(holdToCancelButton());
      act(() => {
        jest.advanceTimersByTime(HOLD_TO_CANCEL.holdMs);
      });
    });

    it('does not cancel the goal', () => {
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('Tab', () => {
    describe('from the hold button', () => {
      beforeEach(() => {
        pressTab(holdToCancelButton());
      });

      it('comes back round to keeping the goal', () => {
        expect(keepGoalButton()).toHaveFocus();
      });
    });

    describe('backwards from keeping the goal', () => {
      beforeEach(() => {
        pressTab(keepGoalButton(), true);
      });

      it('comes back round to the hold button', () => {
        expect(holdToCancelButton()).toHaveFocus();
      });
    });

    describe('from the dialog itself', () => {
      beforeEach(() => {
        pressTab(screen.getByTestId(CANCEL_GOAL_TEST_IDS.container));
      });

      it('stays inside, on keeping the goal', () => {
        expect(keepGoalButton()).toHaveFocus();
      });
    });
  });
});
