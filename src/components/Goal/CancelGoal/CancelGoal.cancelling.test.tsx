import { act, fireEvent, screen } from '@/test-utils/render';
import { mockGoal } from '@/test-utils/mocks/goal.mocks';
import { restoreFetchAfterEach, stubFetch } from '@/test-utils/stub-fetch';
import { IS_LOADER_SHOWN_TEST_ID } from '@/test-utils/is-loader-shown';
import {
  completeHold,
  holdToCancelButton,
  keepGoalButton,
  renderCancelGoal,
  stubPointerEventEachTest,
} from '@/test-utils/cancel-goal';
import { ESCAPE_KEY } from '@/hooks/constants';
import { CANCEL_GOAL_TEST_IDS } from './constants';
import { HOLD_TO_CANCEL_TEST_IDS } from './HoldToCancel/constants';

describe('CancelGoal, cancelling', () => {
  const mockFetch = jest.fn();
  const mockOnKeep = jest.fn();
  const mockOnFinished = jest.fn();

  restoreFetchAfterEach();
  stubPointerEventEachTest();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    stubFetch(mockFetch.mockResolvedValue({ ok: true, json: async () => mockGoal }));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('a completed hold', () => {
    beforeEach(async () => {
      renderCancelGoal({ onKeep: mockOnKeep, onFinished: mockOnFinished });
      await completeHold();
    });

    it('cancels this goal by its id', () => {
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/accounts/${mockGoal.accountId}/goals/${mockGoal.id}`,
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('finishes', () => {
      expect(mockOnFinished).toHaveBeenCalledTimes(1);
    });
  });

  describe('a completed hold on a goal that has already ended', () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 409, json: async () => ({}) });
      renderCancelGoal({ onKeep: mockOnKeep, onFinished: mockOnFinished });
      await completeHold();
    });

    it('finishes, since the screen was out of date', () => {
      expect(mockOnFinished).toHaveBeenCalledTimes(1);
    });
  });

  describe('a completed hold that fails after a while', () => {
    beforeEach(async () => {
      let answerCancel: (response: unknown) => void = () => {};
      mockFetch.mockReturnValue(new Promise((resolve) => (answerCancel = resolve)));
      renderCancelGoal({ onKeep: mockOnKeep, onFinished: mockOnFinished });
      await completeHold();
      await act(async () => answerCancel({ ok: false, status: 500, json: async () => ({}) }));
    });

    it('says the goal was not cancelled', () => {
      expect(screen.getByTestId(HOLD_TO_CANCEL_TEST_IDS.cancelError)).toBeInTheDocument();
    });

    it('stays open', () => {
      expect(mockOnFinished).not.toHaveBeenCalled();
    });

    it('puts the focus back on keeping the goal', () => {
      expect(keepGoalButton()).toHaveFocus();
    });
  });

  describe('while the goal is being cancelled', () => {
    beforeEach(async () => {
      mockFetch.mockReturnValue(new Promise(() => {}));
      renderCancelGoal({ onKeep: mockOnKeep, onFinished: mockOnFinished });
      await completeHold();
    });

    it('cannot keep the goal by its button', () => {
      expect(keepGoalButton()).toBeDisabled();
    });

    it('cannot start another hold', () => {
      expect(holdToCancelButton()).toBeDisabled();
    });

    it('holds the focus on the dialog', () => {
      expect(screen.getByTestId(CANCEL_GOAL_TEST_IDS.container)).toHaveFocus();
    });

    it('shows the loader', () => {
      expect(screen.getByTestId(IS_LOADER_SHOWN_TEST_ID)).toHaveTextContent('true');
    });

    describe('and Escape is pressed', () => {
      beforeEach(() => {
        fireEvent.keyDown(document, { key: ESCAPE_KEY });
      });

      it('does not close', () => {
        expect(mockOnKeep).not.toHaveBeenCalled();
      });
    });
  });
});
