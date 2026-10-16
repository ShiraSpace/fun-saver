import { fireEvent, render, screen } from '@/test-utils/render';
import { createMockSavedTowardGoal } from '@/test-utils/mocks/goal.mocks';
import { ESCAPE_KEY } from '@/hooks/constants';
import { ViewGoal } from './ViewGoal';
import { VIEW_GOAL_COPY, VIEW_GOAL_TEST_IDS } from './constants';
import { SAVINGS_OPEN_COPY, SAVINGS_OPEN_TEST_IDS } from './SavingsOpen/constants';
import { CLOSE_BUTTON_TEST_IDS } from '@/components/CloseButton/constants';
import { SCREEN_TITLE_TEST_IDS } from '@/components/ScreenTitle/constants';
import { CELEBRATION_TEST_IDS } from '../Celebration/constants';

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
      expect(screen.getByTestId(SCREEN_TITLE_TEST_IDS.title)).toHaveTextContent(
        VIEW_GOAL_COPY.title(mockAccountName)
      );
    });

    it('shows no reached heading', () => {
      expect(screen.queryByTestId(VIEW_GOAL_TEST_IDS.reachedHeading)).not.toBeInTheDocument();
    });

    it('does not say savings are open', () => {
      expect(screen.queryByTestId(SAVINGS_OPEN_TEST_IDS.label)).not.toBeInTheDocument();
    });

    it('does not play the celebration', () => {
      expect(screen.queryByTestId(CELEBRATION_TEST_IDS.celebration)).not.toBeInTheDocument();
    });
  });

  describe('once the goal is reached', () => {
    beforeEach(() => {
      render(
        <ViewGoal
          accountName={mockAccountName}
          savedTowardGoal={createMockSavedTowardGoal({ isGoalReached: true })}
          onClose={jest.fn()}
        />
      );
    });

    it('shows the reached heading', () => {
      expect(screen.getByTestId(VIEW_GOAL_TEST_IDS.reachedHeading)).toHaveTextContent(
        VIEW_GOAL_COPY.reachedHeading
      );
    });

    it('says savings are open', () => {
      expect(screen.getByTestId(SAVINGS_OPEN_TEST_IDS.label)).toHaveTextContent(
        SAVINGS_OPEN_COPY.label
      );
    });

    it('plays the celebration', () => {
      expect(screen.getByTestId(CELEBRATION_TEST_IDS.celebration)).toBeInTheDocument();
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
      fireEvent.click(screen.getByTestId(CLOSE_BUTTON_TEST_IDS.button));

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
