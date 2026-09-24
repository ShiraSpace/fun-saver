import { fireEvent, render, screen } from '@/test-utils/render';
import { AmountEditKeys } from './AmountEditKeys';
import { AMOUNT_KEYPAD_COPY, AMOUNT_KEYPAD_TEST_IDS } from '../constants';

const mockOnClear = jest.fn();
const mockOnBackspace = jest.fn();

describe('AmountEditKeys', () => {
  beforeEach(() => {
    mockOnClear.mockClear();
    mockOnBackspace.mockClear();
    render(
      <AmountEditKeys onClear={mockOnClear} onBackspace={mockOnBackspace} />
    );
  });

  it('clears when the clear key is tapped', () => {
    fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.clear));

    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it('backspaces when the delete key is tapped', () => {
    fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.backspace));

    expect(mockOnBackspace).toHaveBeenCalledTimes(1);
  });

  it('labels the keys with their copy', () => {
    expect(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.clear)).toHaveTextContent(
      AMOUNT_KEYPAD_COPY.clear
    );
    expect(
      screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.backspace)
    ).toHaveTextContent(AMOUNT_KEYPAD_COPY.backspace);
  });
});
