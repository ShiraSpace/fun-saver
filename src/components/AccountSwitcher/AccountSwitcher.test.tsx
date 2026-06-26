import { render, screen } from '@/test-support/render';
import { AccountSwitcher } from './AccountSwitcher';
import { AccountsProvider } from './accounts-context';
import { TITLE_TEST_IDS } from '@/components/Header/CrossfadeTitle/constants';
import {
  mockAccount,
  mockDerivedWallets,
  mockSecondAccount,
} from '@/test-support/fixtures';

const views = [
  { account: mockAccount, wallets: mockDerivedWallets },
  { account: mockSecondAccount, wallets: mockDerivedWallets },
];

function renderWithSelection(selectedAccountId: string): void {
  render(
    <AccountsProvider
      value={{
        accounts: views.map((view) => view.account),
        selectedAccountId,
        selectAccount: () => {},
      }}
    >
      <AccountSwitcher views={views} />
    </AccountsProvider>
  );
}

describe('AccountSwitcher', () => {
  it('renders the account selected in context', () => {
    renderWithSelection(mockSecondAccount.id);

    expect(screen.getByTestId(TITLE_TEST_IDS.title)).toHaveTextContent(
      mockSecondAccount.name
    );
  });

  it('falls back to the first account when the selection is unknown', () => {
    renderWithSelection('unknown-account-id');

    expect(screen.getByTestId(TITLE_TEST_IDS.title)).toHaveTextContent(
      mockAccount.name
    );
  });
});
