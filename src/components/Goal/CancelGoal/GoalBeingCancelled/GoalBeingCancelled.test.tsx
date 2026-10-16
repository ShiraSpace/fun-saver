import { render, screen } from '@/test-utils/render';
import { shekelsToAgorot } from '@/lib/money';
import { createMockGoal, createMockSavedTowardGoal, mockGoal } from '@/test-utils/mocks/goal.mocks';
import { GoalBeingCancelled } from './GoalBeingCancelled';
import { GOAL_BEING_CANCELLED_COPY, GOAL_BEING_CANCELLED_TEST_IDS } from './constants';

describe('GoalBeingCancelled', () => {
  const mockTitleId = 'mock-title';
  const mockDescriptionId = 'mock-description';

  describe('a goal not reached yet', () => {
    const mockSavedShekels = 85;
    const mockGoalShekels = 300;

    beforeEach(() => {
      render(
        <GoalBeingCancelled
          savedTowardGoal={createMockSavedTowardGoal({
            saved: shekelsToAgorot(mockSavedShekels),
            goal: createMockGoal({ amount: shekelsToAgorot(mockGoalShekels) }),
          })}
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
      expect(screen.getByTestId(GOAL_BEING_CANCELLED_TEST_IDS.saved)).toHaveTextContent(
        String(mockSavedShekels)
      );
    });

    it('shows how much the goal is', () => {
      expect(screen.getByTestId(GOAL_BEING_CANCELLED_TEST_IDS.amount)).toHaveTextContent(
        String(mockGoalShekels)
      );
    });

    it('says savings opens for withdrawals', () => {
      expect(screen.getByTestId(GOAL_BEING_CANCELLED_TEST_IDS.moneyStays)).toHaveTextContent(
        GOAL_BEING_CANCELLED_COPY.moneyStaysAndSavingsOpens
      );
    });
  });

  it('only says the money stays for a goal already reached, since savings is already open', () => {
    render(
      <GoalBeingCancelled
        savedTowardGoal={createMockSavedTowardGoal({ isGoalReached: true })}
        titleId={mockTitleId}
        descriptionId={mockDescriptionId}
      />
    );

    expect(screen.getByTestId(GOAL_BEING_CANCELLED_TEST_IDS.moneyStays)).toHaveTextContent(
      new RegExp(`^${GOAL_BEING_CANCELLED_COPY.moneyStays}$`)
    );
  });
});
