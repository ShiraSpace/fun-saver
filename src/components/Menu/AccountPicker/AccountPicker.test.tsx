import { render, screen } from '@/test-utils/render';
import { openAccountPicker } from '@/test-utils/account-picker';
import {
  mockDerivedAccount,
  mockSecondDerivedAccount,
} from '@/test-utils/fixtures';
import { AccountPicker } from './AccountPicker';
import { ACCOUNT_LIST_TEST_IDS } from '../AccountList/constants';
import { ACCOUNT_PICKER_TEST_IDS } from './constants';

const accounts = [mockDerivedAccount, mockSecondDerivedAccount];

describe('AccountPicker', () => {
  beforeEach(() => {
    render(
      <AccountPicker
        accounts={accounts}
        selectedAccountId={mockSecondDerivedAccount.id}
        onSelect={(): void => {}}
        onAdd={(): void => {}}
      />
    );
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
});
