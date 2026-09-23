import { fireEvent, renderWithAccounts, screen } from '@/test-utils/render';
import { MenuGlobalScope } from './MenuGlobalScope';
import { ACCOUNT_LIST_TEST_IDS } from '../AccountList/constants';
import { EDIT_ACCOUNT_BUTTON_TEST_IDS } from '../EditAccountButton/constants';
import { type AccountsContextValue } from '@/components/Home/accounts-context';
import {
  APP_MODE,
  AppModeProvider,
} from '@/components/AccountManagement/app-mode-context';
import {
  mockDerivedAccount,
  mockSecondDerivedAccount,
} from '@/test-utils/fixtures';

const mockOnLeaveMenu = jest.fn();

const accountsValue: AccountsContextValue = {
  accounts: [mockDerivedAccount, mockSecondDerivedAccount],
  currentAccount: mockDerivedAccount,
  selectAccount: () => {},
};

function renderScope(): void {
  renderWithAccounts(
    <AppModeProvider
      value={{ mode: APP_MODE.viewing, setMode: (): void => {} }}
    >
      <MenuGlobalScope
        onLeaveMenu={mockOnLeaveMenu}
        isAccountListOpen
        onAccountListToggle={(): void => {}}
      />
    </AppModeProvider>,
    accountsValue
  );
}

describe('MenuGlobalScope', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderScope();
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
