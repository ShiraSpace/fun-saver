import { render, screen } from '@/test-utils/render';
import {
  createMockSavedTowardGoal,
  mockGoal,
} from '@/test-utils/mocks/goal.mocks';
import { REQUEST_STATE } from '@/lib/request-state';
import { SelectedWalletNote } from './SelectedWalletNote';
import { WITHDRAWAL_FORM_COPY, WITHDRAWAL_FORM_TEST_IDS } from '../constants';

const mockForm = {
  isOverdraft: false,
  requestState: REQUEST_STATE.idle,
  selectedBalance: 8500,
};

describe('SelectedWalletNote', () => {
  it('says withdrawing completes the goal, by name', () => {
    render(
      <SelectedWalletNote form={{ ...mockForm, goalToComplete: mockGoal }} />
    );

    expect(
      screen.getByTestId(WITHDRAWAL_FORM_TEST_IDS.completesGoal)
    ).toHaveTextContent(WITHDRAWAL_FORM_COPY.completesGoal(mockGoal.name));
  });

  it('shows the overdraft alert otherwise', () => {
    render(<SelectedWalletNote form={{ ...mockForm, isOverdraft: true }} />);

    expect(
      screen.getByTestId(WITHDRAWAL_FORM_TEST_IDS.overdraft)
    ).toBeInTheDocument();
  });

  it('says nothing while savings are locked', () => {
    render(
      <SelectedWalletNote
        form={{
          ...mockForm,
          isOverdraft: true,
          savingsLockedFor: createMockSavedTowardGoal(),
        }}
      />
    );

    expect(
      screen.queryByTestId(WITHDRAWAL_FORM_TEST_IDS.overdraft)
    ).not.toBeInTheDocument();
  });
});
