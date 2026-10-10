import { render, screen } from '@/test-utils/render';
import { createMockSavedTowardGoal } from '@/test-utils/mocks/goal.mocks';
import { SavedOfGoal } from './SavedOfGoal';
import { SAVED_OF_GOAL_TEST_IDS } from './constants';

describe('SavedOfGoal', () => {
  beforeEach(() => {
    render(
      <SavedOfGoal
        savedTowardGoal={createMockSavedTowardGoal({ saved: 8500 })}
      />
    );
  });

  it('shows how much is saved', () => {
    expect(screen.getByTestId(SAVED_OF_GOAL_TEST_IDS.saved)).toHaveTextContent(
      '₪85'
    );
  });

  it('shows the goal amount', () => {
    expect(screen.getByTestId(SAVED_OF_GOAL_TEST_IDS.amount)).toHaveTextContent(
      '₪300'
    );
  });
});
