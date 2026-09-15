import { fireEvent, render, screen } from '@/test-utils/render';
import {
  mockDerivedAccount,
  mockSecondDerivedAccount,
} from '@/test-utils/fixtures';
import { totalBalance } from '@/lib/derivations';
import { agorotToWholeShekels } from '@/lib/money';
import { AccountList } from './AccountList';
import { ACCOUNT_LIST_CONTENT, ACCOUNT_LIST_TEST_IDS } from './constants';

const accounts = [mockDerivedAccount, mockSecondDerivedAccount];

const shekelsOf = (account: (typeof accounts)[number]): string =>
  String(agorotToWholeShekels(totalBalance(account.wallets)));

describe('AccountList', () => {
  const mockOnSelect = jest.fn();
  const mockOnAdd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <AccountList
        accounts={accounts}
        selectedAccountId={mockSecondDerivedAccount.id}
        onSelect={mockOnSelect}
        onAdd={mockOnAdd}
      />
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

  it('marks the row matching the selected account', () => {
    const rows = screen.getAllByTestId(ACCOUNT_LIST_TEST_IDS.row);

    expect(rows[0]).toHaveAttribute('aria-current', 'false');
    expect(rows[1]).toHaveAttribute('aria-current', 'true');
  });

  it('labels the add row', () => {
    expect(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.addRow)).toHaveTextContent(
      ACCOUNT_LIST_CONTENT.addLabel
    );
  });

  it('asks to add an account when the add row is tapped', () => {
    fireEvent.click(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.addRow));

    expect(mockOnAdd).toHaveBeenCalled();
  });
});
