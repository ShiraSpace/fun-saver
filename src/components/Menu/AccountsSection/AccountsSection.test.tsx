import { fireEvent, render, screen } from '@/test-utils/render';
import { AccountsSection } from './AccountsSection';
import { ACCOUNTS_SECTION_TEST_IDS } from './constants';
import { ACCOUNT_LIST_TEST_IDS } from '../AccountList/constants';
import {
  AccountsProvider,
  type AccountsContextValue,
} from '@/components/Home/accounts-context';
import {
  APP_MODE,
  AppModeProvider,
  type AppMode,
} from '@/components/Home/app-mode-context';
import {
  mockDerivedAccount,
  mockSecondDerivedAccount,
} from '@/test-utils/fixtures';

interface RenderSectionParams {
  contextOverrides?: Partial<AccountsContextValue>;
  onAccountSelect?: () => void;
  setMode?: (mode: AppMode) => void;
}

const accounts = [mockDerivedAccount, mockSecondDerivedAccount];

function renderSection({
  contextOverrides,
  onAccountSelect,
  setMode,
}: RenderSectionParams = {}): void {
  const value: AccountsContextValue = {
    accounts,
    currentAccount: mockDerivedAccount,
    selectAccount: () => {},
    ...contextOverrides,
  };

  render(
    <AppModeProvider
      value={{ mode: APP_MODE.viewing, setMode: setMode ?? ((): void => {}) }}
    >
      <AccountsProvider value={value}>
        <AccountsSection
          onAccountSelect={onAccountSelect ?? ((): void => {})}
          isAccountListOpen
          onAccountListToggle={(): void => {}}
        />
      </AccountsProvider>
    </AppModeProvider>
  );
}

describe('AccountsSection', () => {
  const mockSelectAccount = jest.fn();
  const mockOnAccountSelect = jest.fn();
  const mockSetMode = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    renderSection({
      contextOverrides: { selectAccount: mockSelectAccount },
      onAccountSelect: mockOnAccountSelect,
      setMode: mockSetMode,
    });
  });

  it('lists the accounts', () => {
    expect(screen.getAllByTestId(ACCOUNT_LIST_TEST_IDS.row)).toHaveLength(
      accounts.length
    );
  });

  it('renders the edit chip', () => {
    expect(
      screen.getByTestId(ACCOUNTS_SECTION_TEST_IDS.editChip)
    ).toBeInTheDocument();
  });

  it('selects the tapped account', () => {
    fireEvent.click(screen.getAllByTestId(ACCOUNT_LIST_TEST_IDS.row)[1]);

    expect(mockSelectAccount).toHaveBeenCalledWith(mockSecondDerivedAccount.id);
  });

  it('closes the menu when an account is tapped', () => {
    fireEvent.click(screen.getAllByTestId(ACCOUNT_LIST_TEST_IDS.row)[1]);

    expect(mockOnAccountSelect).toHaveBeenCalled();
  });

  it('enters create mode when the add row is tapped', () => {
    fireEvent.click(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.addRow));

    expect(mockSetMode).toHaveBeenCalledWith(APP_MODE.creatingAccount);
  });

  it('closes the menu when the add row is tapped', () => {
    fireEvent.click(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.addRow));

    expect(mockOnAccountSelect).toHaveBeenCalled();
  });

  it('enters edit mode when the edit chip is tapped', () => {
    fireEvent.click(screen.getByTestId(ACCOUNTS_SECTION_TEST_IDS.editChip));

    expect(mockSetMode).toHaveBeenCalledWith(APP_MODE.editingAccount);
  });

  it('closes the menu when the edit chip is tapped', () => {
    fireEvent.click(screen.getByTestId(ACCOUNTS_SECTION_TEST_IDS.editChip));

    expect(mockOnAccountSelect).toHaveBeenCalled();
  });
});
