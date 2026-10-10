import { render, screen } from '@/test-utils/render';
import {
  createMockSavedTowardGoal,
  mockGoal,
} from '@/test-utils/mocks/goal.mocks';
import { SelectedWalletNote } from './SelectedWalletNote';
import { WITHDRAWAL_FORM_COPY, WITHDRAWAL_FORM_TEST_IDS } from '../constants';

const mockNoteProps = {
  isSavingsLocked: false,
  completesGoal: false,
  savedTowardGoal: createMockSavedTowardGoal({ reached: true }),
  isOverdraft: false,
  hasError: false,
  selectedBalance: 8500,
};

describe('SelectedWalletNote', () => {
  it('says withdrawing completes the goal, by name', () => {
    render(<SelectedWalletNote {...mockNoteProps} completesGoal />);

    expect(
      screen.getByTestId(WITHDRAWAL_FORM_TEST_IDS.completesGoal)
    ).toHaveTextContent(WITHDRAWAL_FORM_COPY.completesGoal(mockGoal.name));
  });

  it('shows the overdraft alert otherwise', () => {
    render(<SelectedWalletNote {...mockNoteProps} isOverdraft />);

    expect(
      screen.getByTestId(WITHDRAWAL_FORM_TEST_IDS.overdraft)
    ).toBeInTheDocument();
  });

  it('says nothing while savings are locked', () => {
    render(
      <SelectedWalletNote {...mockNoteProps} isSavingsLocked isOverdraft />
    );

    expect(
      screen.queryByTestId(WITHDRAWAL_FORM_TEST_IDS.overdraft)
    ).not.toBeInTheDocument();
  });
});
