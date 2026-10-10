import { render, screen } from '@/test-utils/render';
import {
  createMockSavedTowardGoal,
  mockGoal,
} from '@/test-utils/mocks/goal.mocks';
import { SAVED_OUT_OF_GOAL_TEST_IDS } from '@/components/Goal/SavedOutOfGoal/constants';
import { GoalProgress } from './GoalProgress';
import { GOAL_PROGRESS_COPY, GOAL_PROGRESS_TEST_IDS } from './constants';

describe('GoalProgress', () => {
  describe('while saving toward the goal', () => {
    beforeEach(() => {
      render(<GoalProgress savedTowardGoal={createMockSavedTowardGoal()} />);
    });

    it('names the goal', () => {
      expect(
        screen.getByTestId(GOAL_PROGRESS_TEST_IDS.heading)
      ).toHaveTextContent(mockGoal.name);
    });

    it('shows how much is saved toward it', () => {
      expect(
        screen.getByTestId(SAVED_OUT_OF_GOAL_TEST_IDS.saved)
      ).toHaveTextContent('₪85');
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
