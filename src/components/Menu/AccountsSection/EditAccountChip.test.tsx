import { fireEvent, render, screen } from '@/test-utils/render';
import { mockAccount } from '@/test-utils/fixtures';
import { EditAccountChip } from './EditAccountChip';
import {
  ACCOUNTS_SECTION_CONTENT,
  ACCOUNTS_SECTION_TEST_IDS,
} from './constants';

const mockOnEdit = jest.fn();

describe('EditAccountChip', () => {
  beforeEach(() => {
    mockOnEdit.mockClear();
    render(
      <EditAccountChip
        accountName={mockAccount.name}
        onEditAccount={mockOnEdit}
      />
    );
  });

  it('names the account it will open', () => {
    expect(
      screen.getByTestId(ACCOUNTS_SECTION_TEST_IDS.editChip)
    ).toHaveTextContent(
      `${ACCOUNTS_SECTION_CONTENT.editPrefix} ${mockAccount.name}`
    );
  });

  it('names that account to a screen reader too', () => {
    expect(
      screen.getByTestId(ACCOUNTS_SECTION_TEST_IDS.editChip)
    ).toHaveAccessibleName(
      `${ACCOUNTS_SECTION_CONTENT.editPrefix} ${mockAccount.name}`
    );
  });

  it('calls onEditAccount when clicked', () => {
    fireEvent.click(screen.getByTestId(ACCOUNTS_SECTION_TEST_IDS.editChip));

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });
});
