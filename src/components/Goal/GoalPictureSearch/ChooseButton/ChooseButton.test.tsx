import { fireEvent, render, screen } from '@/test-utils/render';
import { ChooseButton } from './ChooseButton';
import { CHOOSE_BUTTON_TEST_IDS } from './constants';

describe('ChooseButton', () => {
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    mockOnConfirm.mockClear();
    render(<ChooseButton onConfirm={mockOnConfirm} />);
    fireEvent.click(screen.getByTestId(CHOOSE_BUTTON_TEST_IDS.button));
  });

  it('confirms when tapped', () => {
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });
});
