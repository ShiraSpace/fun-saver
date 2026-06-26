import { fireEvent, render, screen } from '@/test-support/render';
import { AccountsSection } from './AccountsSection';
import { ACCOUNTS_SECTION_TEST_IDS } from './constants';
import {
  AccountsProvider,
  type AccountsContextValue,
} from '@/components/AccountSwitcher/accounts-context';
import {
  APP_MODE,
  AppModeProvider,
  type AppMode,
} from '@/components/Home/app-mode-context';
import { mockAccount, mockSecondAccount } from '@/test-support/fixtures';

interface RenderSectionParams {
  contextOverrides?: Partial<AccountsContextValue>;
  onAccountSelect?: () => void;
  setMode?: (mode: AppMode) => void;
}

const accounts = [mockAccount, mockSecondAccount];

function renderSection({
  contextOverrides,
  onAccountSelect,
  setMode,
}: RenderSectionParams = {}): void {
  const value: AccountsContextValue = {
    accounts,
    selectedAccountId: mockAccount.id,
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

  it('renders a chip per account marking the selected one', () => {
    const chips = screen.getAllByTestId(ACCOUNTS_SECTION_TEST_IDS.chip);
    expect(chips).toHaveLength(accounts.length);

    expect(chips[0]).toHaveAttribute('data-selected', 'true');
    expect(chips[0]).toHaveTextContent('נ');
    expect(chips[1]).toHaveAttribute('data-selected', 'false');
    expect(chips[1]).toHaveTextContent('מ');
  });

  it('renders edit and add action chips', () => {
    expect(
      screen.getByTestId(ACCOUNTS_SECTION_TEST_IDS.editChip)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(ACCOUNTS_SECTION_TEST_IDS.addChip)
    ).toBeInTheDocument();
  });

  it('selects the tapped account and notifies the parent', () => {
    fireEvent.click(screen.getAllByTestId(ACCOUNTS_SECTION_TEST_IDS.chip)[1]);

    expect(mockSelectAccount).toHaveBeenCalledWith(mockSecondAccount.id);
    expect(mockOnAccountSelect).toHaveBeenCalled();
  });

  it('enters create mode and closes the menu when the add chip is tapped', () => {
    fireEvent.click(screen.getByTestId(ACCOUNTS_SECTION_TEST_IDS.addChip));

    expect(mockOnAccountSelect).toHaveBeenCalled();
    expect(mockSetMode).toHaveBeenCalledWith(APP_MODE.creatingAccount);
  });
});
