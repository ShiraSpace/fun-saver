import { fireEvent, render, screen } from '@/test-utils/render';
import { EditAccountButton } from './EditAccountButton';
import {
  EDIT_ACCOUNT_BUTTON_COPY,
  EDIT_ACCOUNT_BUTTON_TEST_IDS,
} from './constants';
import { mockAccount } from '@/test-utils/fixtures';

describe('EditAccountButton', () => {
  const mockOnEditAccount = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <EditAccountButton
        accountName={mockAccount.name}
        onEditAccount={mockOnEditAccount}
      />
    );
  });

  it('calls onEditAccount when clicked', () => {
    fireEvent.click(screen.getByTestId(EDIT_ACCOUNT_BUTTON_TEST_IDS.button));

    expect(mockOnEditAccount).toHaveBeenCalledTimes(1);
  });

  it('names the account it edits', () => {
    expect(
      screen.getByTestId(EDIT_ACCOUNT_BUTTON_TEST_IDS.button)
    ).toHaveAccessibleName(
      `${EDIT_ACCOUNT_BUTTON_COPY.label} ${mockAccount.name}`
    );
  });
});
