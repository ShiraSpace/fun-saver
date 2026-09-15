import { fireEvent, render, screen } from '@/test-utils/render';
import {
  mockDerivedAccount,
  mockSecondDerivedAccount,
} from '@/test-utils/fixtures';
import { AccountList } from './AccountList';
import { ACCOUNT_LIST_CONTENT, ACCOUNT_LIST_TEST_IDS } from './constants';

const accounts = [mockDerivedAccount, mockSecondDerivedAccount];

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
