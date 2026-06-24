import { JSX } from 'react';
import { render, screen } from '@/test-support/render';
import { AccountsSection } from './AccountsSection';
import { ACCOUNTS_SECTION_TEST_IDS } from './constants';
import {
  AccountsProvider,
  type AccountsContextValue,
} from '@/components/AccountSwitcher/accounts-context';
import type { Account } from '@/lib/types';

const ACCOUNTS: Account[] = [
  { id: 'noa', name: 'נועה', avatarId: 'kid-03', isActive: true },
  { id: 'matan', name: 'מתן', avatarId: 'kid-08', isActive: true },
];

function withSelection(overrides: Partial<AccountsContextValue>): JSX.Element {
  const value: AccountsContextValue = {
    accounts: ACCOUNTS,
    selectedAccountId: 'noa',
    selectAccount: () => undefined,
    ...overrides,
  };

  return (
    <AccountsProvider value={value}>
      <AccountsSection onAccountSelect={() => undefined} />
    </AccountsProvider>
  );
}

describe('AccountsSection', () => {
  beforeEach(() => {
    render(withSelection({}));
  });

  it('renders a chip per account marking the selected one', () => {
    const chips = screen.getAllByTestId(ACCOUNTS_SECTION_TEST_IDS.chip);
    expect(chips).toHaveLength(ACCOUNTS.length);

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
