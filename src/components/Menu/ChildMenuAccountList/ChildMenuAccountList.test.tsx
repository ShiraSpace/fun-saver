import { fireEvent, render, screen } from '@/test-utils/render';
import { mockSiblingAccountSummary } from '@/test-utils/mocks/account.mocks';
import { ChildMenuAccountList } from './ChildMenuAccountList';
import { CHILD_MENU_ACCOUNT_LIST_TEST_IDS } from './constants';

describe('ChildMenuAccountList', () => {
  const mockYoungerSiblingAccount = {
    ...mockSiblingAccountSummary,
    id: 'a3',
    name: 'יואב',
  };
  const mockSiblingAccounts = [
    mockSiblingAccountSummary,
    mockYoungerSiblingAccount,
  ];
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

  it('shows each sibling account it is given, in order', () => {
    const names = screen
      .getAllByTestId(CHILD_MENU_ACCOUNT_LIST_TEST_IDS.name)
      .map((name) => name.textContent);

    expect(names).toEqual(
      mockSiblingAccounts.map((siblingAccount) => siblingAccount.name)
    );
  });

  it('selects the sibling account whose row is tapped', () => {
    fireEvent.click(
      screen.getAllByTestId(CHILD_MENU_ACCOUNT_LIST_TEST_IDS.row)[1]
    );

    expect(mockOnSelect).toHaveBeenCalledWith(mockYoungerSiblingAccount.id);
  });
});
