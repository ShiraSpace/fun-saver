import { fireEvent, render, screen } from '@/test-utils/render';
import { EditAccountChip } from './EditAccountChip';
import { ACCOUNTS_SECTION_TEST_IDS } from './constants';

describe('EditAccountChip', () => {
  it('calls onEditAccount when clicked', () => {
    const mockOnEdit = jest.fn();
    render(<EditAccountChip onEditAccount={mockOnEdit} />);

    fireEvent.click(screen.getByTestId(ACCOUNTS_SECTION_TEST_IDS.editChip));

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });
});
