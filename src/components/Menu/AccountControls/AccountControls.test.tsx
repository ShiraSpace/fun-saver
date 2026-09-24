import { fireEvent, render, screen } from '@/test-utils/render';
import { AccountControls } from './AccountControls';
import { ACCOUNT_LIST_TEST_IDS } from '../AccountList/constants';
import { EDIT_ACCOUNT_BUTTON_TEST_IDS } from '../EditAccountButton/constants';
import { openAccountPicker } from '@/test-utils/account-picker';
import { mockAccountsContext, mockDerivedAccount } from '@/test-utils/fixtures';
import { WithMenu } from '@/test-utils/menu';

const mockCloseMenu = jest.fn();

function renderControls(): void {
  render(
    <WithMenu closeMenu={mockCloseMenu}>
      <AccountControls />
    </WithMenu>,
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

  describe('with the account list open', () => {
    beforeEach(() => {
      openAccountPicker();
    });

    it('leaves the menu when the add-account button is tapped', () => {
      fireEvent.click(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.addAccount));

      expect(mockCloseMenu).toHaveBeenCalled();
    });

    it('leaves the menu when another account is picked', () => {
      fireEvent.click(screen.getAllByTestId(ACCOUNT_LIST_TEST_IDS.row)[1]);

      expect(mockCloseMenu).toHaveBeenCalled();
    });
  });

  it('leaves the menu when the edit button is tapped', () => {
    fireEvent.click(screen.getByTestId(EDIT_ACCOUNT_BUTTON_TEST_IDS.button));

    expect(mockCloseMenu).toHaveBeenCalled();
  });
});
