import { fireEvent, render, screen } from '@/test-support/render';
import { AmountPad } from './AmountPad';
import { AMOUNT_PAD_TEST_IDS } from './constants';

const onDigit = jest.fn();
const noop = (): void => {};

describe('AmountPad', () => {
  beforeEach(() => {
    onDigit.mockClear();
    render(<AmountPad onDigit={onDigit} onClear={noop} onBackspace={noop} />);
  });

  it('reports a tapped digit as a number', () => {
    fireEvent.click(screen.getByTestId(AMOUNT_PAD_TEST_IDS.key('7')));

    expect(onDigit).toHaveBeenCalledWith(7);
  });

  it('reports zero', () => {
    fireEvent.click(screen.getByTestId(AMOUNT_PAD_TEST_IDS.key('0')));

    expect(onDigit).toHaveBeenCalledWith(0);
  });

  it('offers all ten digit keys', () => {
    for (let digit = 0; digit <= 9; digit++) {
      expect(
        screen.getByTestId(AMOUNT_PAD_TEST_IDS.key(String(digit)))
      ).toBeInTheDocument();
    }
  });
});
