import { render, screen } from '@/test-utils/render';
import { createMockSavedTowardGoal } from '@/test-utils/mocks/goal.mocks';
import { SavedOutOfGoal } from './SavedOutOfGoal';
import { SAVED_OUT_OF_GOAL_TEST_IDS } from './constants';

describe('SavedOutOfGoal', () => {
  beforeEach(() => {
    render(
      <SavedOutOfGoal
        savedTowardGoal={createMockSavedTowardGoal({ saved: 8500 })}
      />
    );
  });

  it('shows how much is saved', () => {
    expect(
      screen.getByTestId(SAVED_OUT_OF_GOAL_TEST_IDS.saved)
    ).toHaveTextContent('₪85');
  });

  it('shows the goal amount', () => {
    expect(
      screen.getByTestId(SAVED_OUT_OF_GOAL_TEST_IDS.amount)
    ).toHaveTextContent('₪300');
  });
});
