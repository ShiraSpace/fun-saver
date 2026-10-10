import { render, screen } from '@/test-utils/render';
import {
  createMockSavedTowardGoal,
  mockGoal,
} from '@/test-utils/mocks/goal.mocks';
import { LockedSavings } from './LockedSavings';
import { LOCKED_SAVINGS_COPY, LOCKED_SAVINGS_TEST_IDS } from './constants';

describe('LockedSavings', () => {
  beforeEach(() => {
    render(
      <LockedSavings
        savedTowardGoal={createMockSavedTowardGoal({ stillToSave: 21500 })}
      />
    );
  });

  it('says savings are kept for the goal, by name', () => {
    expect(
      screen.getByTestId(LOCKED_SAVINGS_TEST_IDS.heading)
    ).toHaveTextContent(LOCKED_SAVINGS_COPY.heading(mockGoal.name));
  });

  it('says how much is still to save', () => {
    expect(
      screen.getByTestId(LOCKED_SAVINGS_TEST_IDS.stillToSave)
    ).toHaveTextContent(LOCKED_SAVINGS_COPY.stillToSave(215));
  });

  it('shows the progress toward the goal', () => {
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
