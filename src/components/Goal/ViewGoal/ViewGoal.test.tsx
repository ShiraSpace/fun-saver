import { fireEvent, render, screen } from '@/test-utils/render';
import { createMockSavedTowardGoal } from '@/test-utils/mocks/goal.mocks';
import { ACCOUNT_FORM_TEST_IDS } from '@/components/AccountForm/constants';
import { ViewGoal } from './ViewGoal';
import { VIEW_GOAL_COPY, VIEW_GOAL_TEST_IDS } from './constants';

const mockAccountName = 'נועה';

describe('ViewGoal', () => {
  describe('while savings are kept for the goal', () => {
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

    it('names whose goal it is', () => {
      expect(screen.getByTestId(ACCOUNT_FORM_TEST_IDS.title)).toHaveTextContent(
        VIEW_GOAL_COPY.title(mockAccountName)
      );
    });

    it('says savings are kept until the goal', () => {
      expect(screen.getByTestId(VIEW_GOAL_TEST_IDS.badge)).toHaveTextContent(
        VIEW_GOAL_COPY.lockedBadge
      );
    });

    it('does not say the goal is reached', () => {
      expect(
        screen.queryByTestId(VIEW_GOAL_TEST_IDS.reachedHeading)
      ).not.toBeInTheDocument();
    });

    it('closes from ✕', () => {
      fireEvent.click(screen.getByTestId(ACCOUNT_FORM_TEST_IDS.cancel));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('closes from the back button', () => {
      fireEvent.click(screen.getByTestId(VIEW_GOAL_TEST_IDS.back));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
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

    it('says the goal is reached', () => {
      expect(
        screen.getByTestId(VIEW_GOAL_TEST_IDS.reachedHeading)
      ).toHaveTextContent(VIEW_GOAL_COPY.reachedHeading);
    });

    it('says savings are open', () => {
      expect(screen.getByTestId(VIEW_GOAL_TEST_IDS.badge)).toHaveTextContent(
        VIEW_GOAL_COPY.openBadge
      );
    });
  });
});
