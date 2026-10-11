import { render, screen } from '@/test-utils/render';
import { CloseButton } from './CloseButton';
import { CLOSE_BUTTON_TEST_IDS } from './constants';

describe('CloseButton', () => {
  it('draws nothing without onClose', () => {
    render(<CloseButton />);

    expect(
      screen.queryByTestId(CLOSE_BUTTON_TEST_IDS.button)
    ).not.toBeInTheDocument();
  });
});
