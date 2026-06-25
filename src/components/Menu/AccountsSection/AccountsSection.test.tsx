import { fireEvent, render, screen } from '@/test-support/render';
import { AccountsSection } from './AccountsSection';
import { ACCOUNTS_SECTION_TEST_IDS } from './constants';
import {
  AccountsProvider,
  type AccountsContextValue,
} from '@/components/AccountSwitcher/accounts-context';
import { ACCOUNT, SECOND_ACCOUNT } from '@/test-support/fixtures';

const accounts = [ACCOUNT, SECOND_ACCOUNT];

interface RenderSectionParams {
  contextOverrides?: Partial<AccountsContextValue>;
  onAccountSelect?: () => void;
}

function renderSection({
  contextOverrides,
  onAccountSelect,
}: RenderSectionParams = {}): void {
  const value: AccountsContextValue = {
    accounts,
    selectedAccountId: ACCOUNT.id,
    selectAccount: () => {},
    ...contextOverrides,
  };

  render(
    <AccountsProvider value={value}>
      <AccountsSection onAccountSelect={onAccountSelect ?? ((): void => {})} />
    </AccountsProvider>
  );
}

describe('AccountsSection', () => {
  describe('rendering', () => {
    beforeEach(() => {
      renderSection();
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
  });

  it('selects the tapped account and notifies the parent', () => {
    const mockSelectAccount = jest.fn();
    const mockOnAccountSelect = jest.fn();
    renderSection({
      contextOverrides: { selectAccount: mockSelectAccount },
      onAccountSelect: mockOnAccountSelect,
    });

    fireEvent.click(screen.getAllByTestId(ACCOUNTS_SECTION_TEST_IDS.chip)[1]);

    expect(mockSelectAccount).toHaveBeenCalledWith(SECOND_ACCOUNT.id);
    expect(mockOnAccountSelect).toHaveBeenCalled();
  });
});
