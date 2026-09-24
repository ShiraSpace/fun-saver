import { fireEvent, render, screen } from '@/test-utils/render';
import { AmountEditKeys } from './AmountEditKeys';
import { AMOUNT_KEYPAD_COPY, AMOUNT_KEYPAD_TEST_IDS } from '../constants';

const onClear = jest.fn();
const onBackspace = jest.fn();

describe('AmountEditKeys', () => {
  beforeEach(() => {
    onClear.mockClear();
    onBackspace.mockClear();
    render(<AmountEditKeys onClear={onClear} onBackspace={onBackspace} />);
  });

  it('clears when the clear key is tapped', () => {
    fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.clear));

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('backspaces when the delete key is tapped', () => {
    fireEvent.click(screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.backspace));

    expect(onBackspace).toHaveBeenCalledTimes(1);
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
