import { render, screen } from '@/test-utils/render';
import {
  createMockSavedTowardGoal,
  mockGoal,
} from '@/test-utils/mocks/goal.mocks';
import { GoalHero } from './GoalHero';
import { GOAL_HERO_COPY, GOAL_HERO_TEST_IDS } from '../constants';

describe('GoalHero', () => {
  describe('while saving toward the goal', () => {
    beforeEach(() => {
      render(
        <GoalHero
          savedTowardGoal={createMockSavedTowardGoal({
            saved: 8500,
            stillToSave: 21500,
          })}
        />
      );
    });

    it('shows the goal picture', () => {
      expect(screen.getByTestId(GOAL_HERO_TEST_IDS.picture)).toHaveTextContent(
        mockGoal.picture.emoji
      );
    });

    it('shows the goal name', () => {
      expect(screen.getByTestId(GOAL_HERO_TEST_IDS.name)).toHaveTextContent(
        mockGoal.name
      );
    });

    it('shows how much is saved', () => {
      expect(screen.getByTestId(GOAL_HERO_TEST_IDS.saved)).toHaveTextContent(
        '₪85'
      );
    });

    it('shows the goal amount', () => {
      expect(screen.getByTestId(GOAL_HERO_TEST_IDS.amount)).toHaveTextContent(
        '₪300'
      );
    });

    it('says how much is still to save', () => {
      expect(
        screen.getByTestId(GOAL_HERO_TEST_IDS.stillToSave)
      ).toHaveTextContent(GOAL_HERO_COPY.stillToSave(215));
    });
  });

  it('says the goal can be bought once it is reached', () => {
    render(
      <GoalHero
        savedTowardGoal={createMockSavedTowardGoal({
          saved: mockGoal.amount,
          stillToSave: 0,
          reached: true,
        })}
      />
    );

    expect(
      screen.getByTestId(GOAL_HERO_TEST_IDS.stillToSave)
    ).toHaveTextContent(
      GOAL_HERO_COPY.canBuy(mockGoal.name, mockGoal.picture.emoji)
    );
  });
});
