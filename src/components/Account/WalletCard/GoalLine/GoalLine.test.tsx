import { fireEvent, render, screen, within } from '@/test-utils/render';
import { createMockSavedTowardGoal } from '@/test-utils/mocks/goal.mocks';
import { APP_MODE, AppModeProvider } from '@/components/AccountManagement/app-mode-context';
import { GOAL_PROGRESS_TEST_IDS } from '@/components/Goal/GoalProgress/constants';
import { GoalLine } from './GoalLine';
import { GOAL_LINE_COPY, GOAL_LINE_TEST_IDS } from './constants';

describe('GoalLine', () => {
  describe('without a goal', () => {
    const mockSetMode = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      render(
        <AppModeProvider value={{ mode: APP_MODE.viewing, setMode: mockSetMode }}>
          <GoalLine />
        </AppModeProvider>
      );
    });

    it('offers to set a goal', () => {
      expect(screen.getByTestId(GOAL_LINE_TEST_IDS.setGoal)).toHaveTextContent(
        GOAL_LINE_COPY.setGoal
      );
    });

    it('shows no progress', () => {
      expect(screen.queryByTestId(GOAL_LINE_TEST_IDS.line)).not.toBeInTheDocument();
    });

    it('opens the screen that sets a goal when tapped', () => {
      fireEvent.click(screen.getByTestId(GOAL_LINE_TEST_IDS.setGoal));

      expect(mockSetMode).toHaveBeenCalledWith(APP_MODE.settingGoal);
    });
  });

  describe('with a goal', () => {
    const mockSetMode = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      render(
        <AppModeProvider value={{ mode: APP_MODE.viewing, setMode: mockSetMode }}>
          <GoalLine savedTowardGoal={createMockSavedTowardGoal()} />
        </AppModeProvider>
      );
    });

    it("shows the goal's progress", () => {
      expect(
        within(screen.getByTestId(GOAL_LINE_TEST_IDS.line)).getByTestId(
          GOAL_PROGRESS_TEST_IDS.heading
        )
      ).toBeInTheDocument();
    });

    it('opens the goal screen when tapped', () => {
      fireEvent.click(screen.getByTestId(GOAL_LINE_TEST_IDS.line));

      expect(mockSetMode).toHaveBeenCalledWith(APP_MODE.viewingGoal);
    });
  });
});
