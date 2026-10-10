import { fireEvent, render, screen } from '@/test-utils/render';
import {
  createMockSavedTowardGoal,
  mockGoal,
} from '@/test-utils/mocks/goal.mocks';
import {
  APP_MODE,
  AppModeProvider,
} from '@/components/AccountManagement/app-mode-context';
import { SAVED_OF_GOAL_TEST_IDS } from '@/components/Goal/SavedOfGoal/constants';
import { GoalProgress } from './GoalProgress';
import { GOAL_PROGRESS_COPY, GOAL_PROGRESS_TEST_IDS } from './constants';

describe('GoalProgress', () => {
  describe('while saving toward the goal', () => {
    const mockSetMode = jest.fn();

    beforeEach(() => {
      mockSetMode.mockClear();
      render(
        <AppModeProvider
          value={{ mode: APP_MODE.viewing, setMode: mockSetMode }}
        >
          <GoalProgress savedTowardGoal={createMockSavedTowardGoal()} />
        </AppModeProvider>
      );
    });

    it('names the goal', () => {
      expect(
        screen.getByTestId(GOAL_PROGRESS_TEST_IDS.heading)
      ).toHaveTextContent(mockGoal.name);
    });

    it('shows how much is saved toward it', () => {
      expect(
        screen.getByTestId(SAVED_OF_GOAL_TEST_IDS.saved)
      ).toHaveTextContent('₪85');
    });

    it('opens the goal screen when tapped', () => {
      fireEvent.click(screen.getByTestId(GOAL_PROGRESS_TEST_IDS.line));

      expect(mockSetMode).toHaveBeenCalledWith(APP_MODE.viewingGoal);
    });
  });

  it('says the goal is reached once it is', () => {
    render(
      <GoalProgress
        savedTowardGoal={createMockSavedTowardGoal({ reached: true })}
      />
    );

    expect(
      screen.getByTestId(GOAL_PROGRESS_TEST_IDS.heading)
    ).toHaveTextContent(GOAL_PROGRESS_COPY.reached);
  });
});
