import { fireEvent, render, screen } from '@/test-utils/render';
import { CloseButton } from './CloseButton';
import { CLOSE_BUTTON_TEST_IDS } from './constants';

describe('CloseButton', () => {
  describe('without onClose', () => {
    beforeEach(() => {
      render(<CloseButton />);
    });

    it('draws nothing', () => {
      expect(
        screen.queryByTestId(CLOSE_BUTTON_TEST_IDS.button)
      ).not.toBeInTheDocument();
    });
  });

  describe('when tapped', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
      mockOnClose.mockClear();
      render(<CloseButton onClose={mockOnClose} />);
      fireEvent.click(screen.getByTestId(CLOSE_BUTTON_TEST_IDS.button));
    });

    it('calls onClose', () => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('while disabled', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
      render(<CloseButton onClose={mockOnClose} disabled />);
    });

    it('cannot be tapped', () => {
      expect(screen.getByTestId(CLOSE_BUTTON_TEST_IDS.button)).toBeDisabled();
    });
  });
});
