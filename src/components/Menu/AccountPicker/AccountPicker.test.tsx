import { render, screen } from '@/test-utils/render';
import { openAccountPicker } from '@/test-utils/account-picker';
import {
  mockDerivedAccount,
  mockSecondDerivedAccount,
} from '@/test-utils/fixtures';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { AccountPicker } from './AccountPicker';
import { ACCOUNT_LIST_TEST_IDS } from '../AccountList/constants';
import { ACCOUNT_PICKER_TEST_IDS } from './constants';

const accounts = [mockDerivedAccount, mockSecondDerivedAccount];

function renderPicker(
  pickableAccounts: AccountWithDerivedWallets[] = []
): void {
  render(
    <AccountPicker
      accounts={pickableAccounts}
      selectedAccountId={mockSecondDerivedAccount.id}
      onSelect={(): void => {}}
      onAdd={(): void => {}}
    />
  );
}

describe('AccountPicker', () => {
  beforeEach(() => {
    renderPicker(accounts);
  });

  it('keeps the accounts out of sight until the trigger is tapped', () => {
    expect(
      screen.queryByTestId(ACCOUNT_LIST_TEST_IDS.list)
    ).not.toBeInTheDocument();
  });

  it('shows the accounts when the trigger is tapped', () => {
    openAccountPicker();

    expect(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.list)).toBeInTheDocument();
  });

  it('names the selected account on the trigger', () => {
    expect(
      screen.getByTestId(ACCOUNT_PICKER_TEST_IDS.trigger)
    ).toHaveTextContent(mockSecondDerivedAccount.name);
  });

  it('puts the accounts away again when the trigger is tapped twice', () => {
    openAccountPicker();
    openAccountPicker();

    expect(
      screen.queryByTestId(ACCOUNT_LIST_TEST_IDS.list)
    ).not.toBeInTheDocument();
  });
});

describe('AccountPicker with no account to show', () => {
  beforeEach(() => {
    renderPicker();
  });

  it('leaves the accounts on show, since no trigger can reach them', () => {
    expect(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.list)).toBeInTheDocument();
  });

  it('offers no trigger', () => {
    expect(
      screen.queryByTestId(ACCOUNT_PICKER_TEST_IDS.trigger)
    ).not.toBeInTheDocument();
  });
});
