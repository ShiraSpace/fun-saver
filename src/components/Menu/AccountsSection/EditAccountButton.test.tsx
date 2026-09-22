import { fireEvent, render, screen } from '@/test-utils/render';
import { EditAccountButton } from './EditAccountButton';
import { ACCOUNTS_SECTION_TEST_IDS } from './constants';
import { mockAccount } from '@/test-utils/fixtures';

describe('EditAccountButton', () => {
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <EditAccountButton
        accountName={mockAccount.name}
        onEditAccount={mockOnEdit}
      />
    );
  });

  it('calls onEditAccount when clicked', () => {
    fireEvent.click(screen.getByTestId(ACCOUNTS_SECTION_TEST_IDS.editButton));

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });
});
