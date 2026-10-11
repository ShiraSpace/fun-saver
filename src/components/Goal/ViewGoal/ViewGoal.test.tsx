import { fireEvent, render, screen } from '@/test-utils/render';
import { createMockSavedTowardGoal } from '@/test-utils/mocks/goal.mocks';
import { ESCAPE_KEY } from '@/hooks/constants';
import { ACCOUNT_FORM_TEST_IDS } from '@/components/AccountForm/constants';
import { ViewGoal } from './ViewGoal';
import { VIEW_GOAL_COPY, VIEW_GOAL_TEST_IDS } from './constants';
import {
  SAVINGS_LOCK_COPY,
  SAVINGS_LOCK_TEST_IDS,
} from './SavingsLock/constants';

const mockAccountName = 'נועה';

describe('ViewGoal', () => {
  describe('while savings is locked', () => {
    beforeEach(() => {
      render(
        <ViewGoal
          accountName={mockAccountName}
          savedTowardGoal={createMockSavedTowardGoal()}
          onClose={jest.fn()}
        />
      );
    });

    it('names whose goal it is', () => {
      expect(screen.getByTestId(ACCOUNT_FORM_TEST_IDS.title)).toHaveTextContent(
        VIEW_GOAL_COPY.title(mockAccountName)
      );
    });

    it('shows no reached heading', () => {
      expect(
        screen.queryByTestId(VIEW_GOAL_TEST_IDS.reachedHeading)
      ).not.toBeInTheDocument();
    });
  });

  describe('once the goal is reached', () => {
    beforeEach(() => {
      render(
        <ViewGoal
          accountName={mockAccountName}
          savedTowardGoal={createMockSavedTowardGoal({ reached: true })}
          onClose={jest.fn()}
        />
      );
    });

    it('shows the reached heading', () => {
      expect(
        screen.getByTestId(VIEW_GOAL_TEST_IDS.reachedHeading)
      ).toHaveTextContent(VIEW_GOAL_COPY.reachedHeading);
    });

    it('says savings are open', () => {
      expect(screen.getByTestId(SAVINGS_LOCK_TEST_IDS.label)).toHaveTextContent(
        SAVINGS_LOCK_COPY.savingsOpen
      );
    });
  });

  describe('closing', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
      mockOnClose.mockClear();
      render(
        <ViewGoal
          accountName={mockAccountName}
          savedTowardGoal={createMockSavedTowardGoal()}
          onClose={mockOnClose}
        />
      );
    });

    it('closes on ✕', () => {
      fireEvent.click(screen.getByTestId(ACCOUNT_FORM_TEST_IDS.cancel));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('closes on חזרה', () => {
      fireEvent.click(screen.getByTestId(VIEW_GOAL_TEST_IDS.back));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('closes on Escape', () => {
      fireEvent.keyDown(document.body, { key: ESCAPE_KEY });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
