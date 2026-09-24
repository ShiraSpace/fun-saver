import { fireEvent, render, screen } from '@/test-utils/render';
import {
  mockDerivedAccount,
  mockSecondDerivedAccount,
} from '@/test-utils/fixtures';
import { WithMenu } from '@/test-utils/menu';
import { totalBalance } from '@/lib/derivations';
import { agorotToWholeShekels } from '@/lib/money';
import { AccountList } from './AccountList';
import { ACCOUNT_LIST_COPY, ACCOUNT_LIST_TEST_IDS } from './constants';

const accounts = [mockDerivedAccount, mockSecondDerivedAccount];

const shekelsOf = (account: (typeof accounts)[number]): string =>
  String(agorotToWholeShekels(totalBalance(account.wallets)));

describe('AccountList', () => {
  const mockOnSelect = jest.fn();
  const mockCloseMenu = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <WithMenu closeMenu={mockCloseMenu}>
        <AccountList
          accounts={accounts}
          currentAccountId={mockSecondDerivedAccount.id}
          onSelect={mockOnSelect}
        />
      </WithMenu>
    );
  });

  it('renders a row per account', () => {
    expect(screen.getAllByTestId(ACCOUNT_LIST_TEST_IDS.row)).toHaveLength(
      accounts.length
    );
  });

  it('shows each account its own total', () => {
    const totals = screen.getAllByTestId(ACCOUNT_LIST_TEST_IDS.total);

    expect(totals[0]).toHaveTextContent(shekelsOf(mockDerivedAccount));
    expect(totals[1]).toHaveTextContent(shekelsOf(mockSecondDerivedAccount));
  });

  it('marks the row matching the current account', () => {
    const rows = screen.getAllByTestId(ACCOUNT_LIST_TEST_IDS.row);

    expect(rows[0]).toHaveAttribute('aria-current', 'false');
    expect(rows[1]).toHaveAttribute('aria-current', 'true');
  });

  it('labels the add-account button', () => {
    expect(
      screen.getByTestId(ACCOUNT_LIST_TEST_IDS.addAccount)
    ).toHaveTextContent(ACCOUNT_LIST_COPY.addLabel);
  });

  it('leaves the menu when the add-account button is tapped, the form taking over', () => {
    fireEvent.click(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.addAccount));

    expect(mockCloseMenu).toHaveBeenCalled();
  });
});
