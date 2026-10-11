import { render, screen } from '@/test-utils/render';
import { createMockSavedTowardGoal, mockGoal } from '@/test-utils/mocks/goal.mocks';
import { moneyAsShown, stillToSaveAsShown } from '@/test-utils/money';
import { GoalHero } from './GoalHero';
import { GOAL_HERO_COPY, GOAL_HERO_TEST_IDS } from './constants';

describe('GoalHero', () => {
  describe('while saving toward the goal', () => {
    const mockSavedTowardGoal = createMockSavedTowardGoal();

    beforeEach(() => {
      render(<GoalHero savedTowardGoal={mockSavedTowardGoal} />);
    });

    it("shows the goal's picture", () => {
      expect(screen.getByTestId(GOAL_HERO_TEST_IDS.picture)).toHaveTextContent(
        mockGoal.picture.emoji
      );
    });

    it('names the goal', () => {
      expect(screen.getByTestId(GOAL_HERO_TEST_IDS.name)).toHaveTextContent(mockGoal.name);
    });

    it('shows how much is saved', () => {
      expect(screen.getByTestId(GOAL_HERO_TEST_IDS.saved)).toHaveTextContent(
        moneyAsShown(mockSavedTowardGoal.saved)
      );
    });

    it("shows the goal's amount", () => {
      expect(screen.getByTestId(GOAL_HERO_TEST_IDS.amount)).toHaveTextContent(
        moneyAsShown(mockGoal.amount)
      );
    });

    it('says how much is still to save', () => {
      expect(screen.getByTestId(GOAL_HERO_TEST_IDS.encouragement)).toHaveTextContent(
        stillToSaveAsShown(mockSavedTowardGoal.stillToSave)
      );
    });
  });

  describe('once the goal is reached', () => {
    beforeEach(() => {
      render(<GoalHero savedTowardGoal={createMockSavedTowardGoal({ reached: true })} />);
    });

    it('says it can be bought', () => {
      expect(screen.getByTestId(GOAL_HERO_TEST_IDS.encouragement)).toHaveTextContent(
        GOAL_HERO_COPY.canBuy(mockGoal.name, mockGoal.picture.emoji)
      );
    });
  });
});
