import { fireEvent, render, screen } from '@/test-utils/render';
import {
  mockAccountSummary,
  mockSiblingAccountSummary,
} from '@/test-utils/mocks/account.mocks';
import { ChildMenuAccountList } from './ChildMenuAccountList';
import { CHILD_MENU_ACCOUNT_LIST_TEST_IDS } from './constants';

describe('ChildMenuAccountList', () => {
  const mockSiblingAccounts = [mockAccountSummary, mockSiblingAccountSummary];
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <ChildMenuAccountList
        siblingAccounts={mockSiblingAccounts}
        onSelect={mockOnSelect}
      />
    );
  });

  it('shows each account it is given, in order', () => {
    const names = screen
      .getAllByTestId(CHILD_MENU_ACCOUNT_LIST_TEST_IDS.name)
      .map((name) => name.textContent);

    expect(names).toEqual(
      mockSiblingAccounts.map((siblingAccount) => siblingAccount.name)
    );
  });

  it('selects the account whose row is tapped', () => {
    fireEvent.click(
      screen.getAllByTestId(CHILD_MENU_ACCOUNT_LIST_TEST_IDS.row)[1]
    );

    expect(mockOnSelect).toHaveBeenCalledWith(mockSiblingAccountSummary.id);
  });

  it("names each row by the child's name alone", () => {
    const rows = screen.getAllByTestId(CHILD_MENU_ACCOUNT_LIST_TEST_IDS.row);

    expect(rows[0]).toHaveAccessibleName(mockAccountSummary.name);
  });
});
