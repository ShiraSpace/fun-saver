import { fireEvent, render, screen } from '@/test-utils/render';
import { AccountControls } from './AccountControls';
import { ACCOUNT_LIST_TEST_IDS } from '../AccountList/constants';
import { EDIT_ACCOUNT_BUTTON_TEST_IDS } from '../EditAccountButton/constants';
import { mockAccountsContext, mockDerivedAccount } from '@/test-utils/fixtures';

const mockOnLeaveMenu = jest.fn();

function renderControls(): void {
  render(
    <AccountControls
      onLeaveMenu={mockOnLeaveMenu}
      isAccountListOpen
      onAccountListToggle={(): void => {}}
    />,
    { accounts: mockAccountsContext }
  );
}

describe('AccountControls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderControls();
  });

  it('names the account in view on the edit button', () => {
    expect(
      screen.getByTestId(EDIT_ACCOUNT_BUTTON_TEST_IDS.button)
    ).toHaveTextContent(mockDerivedAccount.name);
  });

  it('leaves the menu when the add row is tapped', () => {
    fireEvent.click(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.addRow));

    expect(mockOnLeaveMenu).toHaveBeenCalled();
  });

  it('leaves the menu when the edit button is tapped', () => {
    fireEvent.click(screen.getByTestId(EDIT_ACCOUNT_BUTTON_TEST_IDS.button));

    expect(mockOnLeaveMenu).toHaveBeenCalled();
  });
});
