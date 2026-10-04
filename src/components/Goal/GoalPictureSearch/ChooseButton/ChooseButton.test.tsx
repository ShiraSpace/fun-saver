import { fireEvent, render, screen } from '@/test-utils/render';
import { ChooseButton } from './ChooseButton';
import { CHOOSE_BUTTON_TEST_IDS } from './constants';

describe('ChooseButton', () => {
  const mockOnChoose = jest.fn();

  beforeEach(() => {
    mockOnChoose.mockClear();
    render(<ChooseButton onChoose={mockOnChoose} />);
    fireEvent.click(screen.getByTestId(CHOOSE_BUTTON_TEST_IDS.button));
  });

  it('chooses when tapped', () => {
    expect(mockOnChoose).toHaveBeenCalledTimes(1);
  });
});
