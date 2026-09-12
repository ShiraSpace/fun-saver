import { fireEvent, render, screen } from '@/test-support/render';
import { AddAccountChip } from './AddAccountChip';
import { ACCOUNTS_SECTION_TEST_IDS } from './constants';

describe('AddAccountChip', () => {
  it('calls onAdd when clicked', () => {
    const mockOnAdd = jest.fn();
    render(<AddAccountChip onAddAccount={mockOnAdd} />);

    fireEvent.click(screen.getByTestId(ACCOUNTS_SECTION_TEST_IDS.addChip));

    expect(mockOnAdd).toHaveBeenCalledTimes(1);
  });
});
