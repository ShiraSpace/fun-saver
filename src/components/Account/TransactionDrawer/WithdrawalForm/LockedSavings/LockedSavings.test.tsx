import { render, screen } from '@/test-utils/render';
import {
  createMockSavedTowardGoal,
  mockGoal,
} from '@/test-utils/mocks/goal.mocks';
import { stillToSaveAsShown } from '@/test-utils/money';
import { LockedSavings } from './LockedSavings';
import { LOCKED_SAVINGS_COPY, LOCKED_SAVINGS_TEST_IDS } from './constants';

describe('LockedSavings', () => {
  const mockSavedTowardGoal = createMockSavedTowardGoal();

  beforeEach(() => {
    render(<LockedSavings savedTowardGoal={mockSavedTowardGoal} />);
  });

  it('says savings are kept for the goal, by name', () => {
    expect(
      screen.getByTestId(LOCKED_SAVINGS_TEST_IDS.heading)
    ).toHaveTextContent(LOCKED_SAVINGS_COPY.heading(mockGoal.name));
  });

  it('says how much is still to save', () => {
    expect(
      screen.getByTestId(LOCKED_SAVINGS_TEST_IDS.stillToSave)
    ).toHaveTextContent(stillToSaveAsShown(mockSavedTowardGoal.stillToSave));
  });

  it('shows the progress toward the goal', () => {
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
