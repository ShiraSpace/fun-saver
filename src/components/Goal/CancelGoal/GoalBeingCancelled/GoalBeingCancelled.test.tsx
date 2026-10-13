import { render, screen } from '@/test-utils/render';
import { createMockSavedTowardGoal, mockGoal } from '@/test-utils/mocks/goal.mocks';
import { GoalBeingCancelled } from './GoalBeingCancelled';
import { GOAL_BEING_CANCELLED_COPY, GOAL_BEING_CANCELLED_TEST_IDS } from './constants';

const mockTitleId = 'mock-title';

const mockDescriptionId = 'mock-description';

describe('GoalBeingCancelled', () => {
  describe('a goal not reached yet', () => {
    beforeEach(() => {
      render(
        <GoalBeingCancelled
          savedTowardGoal={createMockSavedTowardGoal()}
          titleId={mockTitleId}
          descriptionId={mockDescriptionId}
        />
      );
    });

    it('asks about the goal by its name', () => {
      expect(screen.getByTestId(GOAL_BEING_CANCELLED_TEST_IDS.title)).toHaveTextContent(
        GOAL_BEING_CANCELLED_COPY.title(mockGoal.name)
      );
    });

    it('shows how much is saved', () => {
      expect(screen.getByTestId(GOAL_BEING_CANCELLED_TEST_IDS.saved)).toHaveTextContent('85');
    });

    it('shows how much the goal is', () => {
      expect(screen.getByTestId(GOAL_BEING_CANCELLED_TEST_IDS.amount)).toHaveTextContent('300');
    });

    it('says savings opens for withdrawals', () => {
      expect(screen.getByTestId(GOAL_BEING_CANCELLED_TEST_IDS.moneyStays)).toHaveTextContent(
        GOAL_BEING_CANCELLED_COPY.moneyStaysAndSavingsOpens
      );
    });
  });

  describe('a goal already reached', () => {
    beforeEach(() => {
      render(
        <GoalBeingCancelled
          savedTowardGoal={createMockSavedTowardGoal({ reached: true })}
          titleId={mockTitleId}
          descriptionId={mockDescriptionId}
        />
      );
    });

    it('only says the money stays, since savings is already open', () => {
      expect(screen.getByTestId(GOAL_BEING_CANCELLED_TEST_IDS.moneyStays)).toHaveTextContent(
        new RegExp(`^${GOAL_BEING_CANCELLED_COPY.moneyStays}$`)
      );
    });
  });
});
