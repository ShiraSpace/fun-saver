import { fireEvent, render, screen } from '@/test-utils/render';
import { mockSiblingAccountSummary } from '@/test-utils/mocks/account.mocks';
import { ChildMenuAccountRow } from './ChildMenuAccountRow';
import { CHILD_MENU_ACCOUNT_LIST_TEST_IDS } from './constants';

describe('ChildMenuAccountRow', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <ChildMenuAccountRow
        siblingAccount={mockSiblingAccountSummary}
        onSelect={mockOnSelect}
      />
    );
  });

  it("shows the sibling account's name", () => {
    expect(
      screen.getByTestId(CHILD_MENU_ACCOUNT_LIST_TEST_IDS.name)
    ).toHaveTextContent(mockSiblingAccountSummary.name);
  });

  it('reports its sibling account when tapped', () => {
    fireEvent.click(screen.getByTestId(CHILD_MENU_ACCOUNT_LIST_TEST_IDS.row));

    expect(mockOnSelect).toHaveBeenCalledWith(mockSiblingAccountSummary.id);
  });

  it("is named by the child's name alone", () => {
    expect(
      screen.getByTestId(CHILD_MENU_ACCOUNT_LIST_TEST_IDS.row)
    ).toHaveAccessibleName(mockSiblingAccountSummary.name);
  });
});
